const { TextContent, FileContent } = require('@zenvia/sdk');

const recognizeMusic = require('../services/recognizeMusic');
const getLyrics = require('../services/getLyrics');

async function getSound(fileUrl) {
  
  const music = await recognizeMusic(fileUrl);
  console.log(music);
  let content = []
  if (music) {
    let text = '';
    if (music.artist) {
      text = `${text}*Artista:* ${music.artist}\n`;
    }
    if (music.title) {
      text = `${text}*Título:* ${music.title}\n`;
    }
    if (music.album) {
      text = `${text}*Álbum:* ${music.album}\n`;
    }
    if (music.title && music.artist){
      const vagalume_response = await getLyrics(music.title, music.artist);
      if (vagalume_response.type == "exact" || vagalume_response.type == "aprox")
        text = `${text}*Letra:* \n${vagalume_response.mus[0].text}\n`;
      
    }
    content.push(new TextContent(text))
    if (music.deezer && music.deezer.picture) {
      content.push(new FileContent(music.deezer.picture, 'image/jpeg'));
    }
    if (music.deezer && music.deezer.preview) {
      content.push(new FileContent(music.deezer.preview, 'audio/mpeg'));
    }
  } else {
    content = [new TextContent('Não foi possível identificar a música do áudio.')];
  }

  return content;
}

module.exports = {
  getSound
}