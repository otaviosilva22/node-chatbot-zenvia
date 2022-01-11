const { TextContent } = require('@zenvia/sdk');
var axios = require('axios');

const { updateUser, deleteUser, createUser } = require('../database/db');
const getLyrics = require('../services/getLyrics');
const { getSound } = require('../services/getSound');
const { Status } = require('../common/constants');
const { isInputOfAudio } = require('../common/utils');

const getMenu = () => {
  const menu = "*Escolha uma das opções abaixo 👇*\n" +
"*1* - Encontrar música com um trecho de exemplo\n" +
"*2* - Encontrar letra de uma música\n" +
"*3* - Encerrar conversa"
  
  return menu;
}

contTentativas = 0;
//return content[]
async function proximoPasso(user, input) {
  if (user.status === Status.MAIN_MENU) {
    user.tentativas = 0;
    if (input.text === '1') {
      user.status = Status.WAIT_MUSIC_EX
      
      updateUser(user);
      return [new TextContent('Certo, me envie uma amostra de áudio de no minimo 5 segundos que encontro sua musica 😊')];
    }
    else if (input.text === '2') {

      user.status = Status.WAIT_TYPE_SEARCH;
      updateUser(user);
      let menu = 'Como você gostaria de encontrar a letra da música?\n' +
        "*1* - Áudio com trecho da música\n" +
        "*2* - Nome cantor(a) ou banda e nome da música";
      return new TextContent(menu);
    }
    else if (input.text === '3') {
      deleteUser(user.cellphone);
      return [new TextContent('Certo, muito obrigado pela visita, volte sempre! 👋😉')];
    }
  }
  
  // na primeira msg: exibe menu e espera pela escolha do usuário
  else if (user.status === Status.FIRST_INPUT) {
    user.status = Status.MAIN_MENU
    updateUser(user);
    return [new TextContent(getMenu())];
  }
  else if (
    user.status === Status.WAIT_MUSIC_EX && isInputOfAudio(input)) {
    deleteUser(user.cellphone);
    let resultArray = await getSound(input.fileUrl, false);
    
    return resultArray;
  }
  else if (
    user.status === Status.WAIT_ARTIST_NAME
    || user.status === Status.WAIT_MUSIC_NAME
    ) {
    
    if (user.status === Status.WAIT_ARTIST_NAME) {
      user.artista = input.text;
      user.status = Status.WAIT_MUSIC_NAME
      updateUser(user);
      return new TextContent('Qual é o nome da musica?');

    } else if (user.musica === 'null' && user.status === Status.WAIT_MUSIC_NAME) {
      user.musica = input.text;
      const result = await getLyrics(user.musica, user.artista);
      console.log(result)
      if (result.type === 'exact') {
        deleteUser(user.cellphone);
        return new TextContent(
          `
          \nMúsica: *${result.mus[0].name}*
          \nArtista: *${result.art.name}*
          \nDisponivel em: ${result.art.url}
          \n*Letra*:\n${result.mus[0].text}
          `
        );
      }

      let elseMSg;
      user.tentativas++;
      user.musica = 'null';
      updateUser(user);
      if (user.tentativas < 3){
        elseMsg = 'Não foi possivel encontrar a música que você procura 😕' +
        '\nMas não se preocupe voce pode tentar de novo 🙂'
      }else{
        elseMsg = 'Desculpe, não foi possivel encontrar a música que você procura 😕' +
        '\nEstou encerrando este atendimento.'
        deleteUser(user.cellphone);
      }
      return new TextContent(elseMsg);      
    }
  } else if (user.status === Status.WAIT_TYPE_SEARCH) {
    if (input.text === '1') {
      user.status = Status.WAIT_SOUND_EX;
      updateUser(user);
      return new TextContent("Certo, agora me envie um trecho da música:")
      
    }

    if (input.text === '2') {
      user.status = Status.WAIT_ARTIST_NAME;
      updateUser(user);
      return new TextContent('Qual é o nome do artista?');
    }
    
  }
  else if (user.status === Status.WAIT_SOUND_EX) {
    if (isInputOfAudio(input)) {
      deleteUser(user.cellphone);
      let result = await getSound(input.fileUrl, true);
      return result;
    } else {
      return new TextContent('Não consegui entender, tenha certeza de enviar um aúdio com o trecho da música!')
    }
  }
  else if (user.status === Status.SEARCH_MUSICS_BY_AUTHOR_NAME) {
    const params = new URLSearchParams();
    params.append('q', input.text);
    params.append('limit', 5)
    let result = await axios.get('https://api.vagalume.com.br/search.art', {
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: JSON.stringify({
        q: input.text,
        limit: 5
      })
    }).catch((error) => console.log(error));
    console.log(result)

    if (result.status === 'success') {
      return new TextContent(result);
    } 
    deleteUser(user);
    return new TextContent("Não conseguir encontrar uma musica com esse nome 😕\n"
    + "Mas não se desanime você pode tentar novamente com uma outra música 😊");
  }
  else if (user.status === Status.WAIT_ARTIST_NAME) {
    
  }
  return new TextContent('Não entendi o que você quis dizer, pode repetir?');
}

module.exports = {
  proximoPasso
};
