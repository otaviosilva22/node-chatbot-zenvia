const dotenv = require('dotenv');
const { TextContent, Client, WebhookController } = require('@zenvia/sdk');

const chatbot = require('./chatbot');
const { createUser,findUser } = require('./database/db');
const { Status } = require('./common/constants');

dotenv.config();

const client = new Client(process.env.ZENVIA_TOKEN);
const whatsapp = client.getChannel('whatsapp');

const webhook = new WebhookController({
  channel: 'whatsapp',
  
  messageEventHandler: async (messageEvent) => {
   //console.log(JSON.stringify(messageEvent));
   // let content = [new TextContent('ola!')];
    let content = [];
    let user = await findUser(messageEvent.message.from);
    if (user) {
      content = content.concat(await chatbot.proximoPasso(user,messageEvent.message.contents[0]));
    } else{
      user = {
        cellphone: messageEvent.message.from,
        nome: messageEvent.message.visitor.name,
        input: 'void',
        artista: 'null',
        musica: 'null',
        status: Status.FIRST_INPUT,
        tentativas: 0
      }
      user = await createUser(user);
      content = content.concat(await chatbot.proximoPasso(user,messageEvent.message.contents[0]));
    }

    whatsapp.sendMessage(messageEvent.message.to, messageEvent.message.from, ...content)
    .then((response) => {
      console.debug('Response:', response);
    });
  },
  
}); 
    

webhook.on('listening', () => {
  console.info('Webhook is listening');
});

webhook.init();
