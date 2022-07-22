/* eslint-disable import/extensions */
import { WebSocketServer } from 'ws';
import http from 'http';
import closeHandler from './handlers.js/close.js';
import messageHandler from './handlers.js/message.js';
import ServerModel from './server-model.js';

const PORT = process.env.port || 3000;
const server = http.createServer();
server.on('request', (request, response) => {
  response.write('hello');
  response.end();
});

server.listen(PORT);

const wss = new WebSocketServer({ server });

const serverModel = new ServerModel(wss);

serverModel.start((clientSocket) => {
  clientSocket.on('message', (data) => {
    try {
      messageHandler(serverModel, clientSocket, data);
    } catch (err) {
      console.log(err);
    }
  });

  clientSocket.on('close', () => closeHandler(serverModel, clientSocket));
});
