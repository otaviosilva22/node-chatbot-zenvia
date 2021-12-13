var axios = require('axios');
const dotenv = require('dotenv');

const {URL_VAGALUME} = require('../common/constants');

function getLyric (mus, art){
  dotenv.config();

  var config = {
    method: 'get',
    url: URL_VAGALUME,
    headers: { },
    params: {
      art,
      mus,
      apikey: process.env.TOKEN_VAGALUME
    }
  };
  
  const response_data = axios(config)
  .then(function (response) {
    console.log(response.data);
    return response.data;
  })
  .catch(function (error) {
    console.log(error);
  });
  
  return response_data;
}

module.exports = {
  getLyric
}