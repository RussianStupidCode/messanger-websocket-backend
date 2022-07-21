/* eslint-disable import/extensions */
import { WebSocketServer } from 'ws';
import closeHandler from './handlers.js/close.js';
import messageHandler from './handlers.js/message.js';
import ServerModel from './server-model.js';

const wss = new WebSocketServer({ port: 8080 });

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
