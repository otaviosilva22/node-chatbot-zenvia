const isInputOfAudio = (input) => {
  if (
      input.type === 'file'
      && input.fileMimeType.includes('audio')) {
      return true;
  }
  return false;
}

module.exports = {
  isInputOfAudio
}