/* eslint-disable import/extensions */
import { WebSocketServer } from 'ws';
import express from 'express';
import closeHandler from './handlers.js/close.js';
import messageHandler from './handlers.js/message.js';
import ServerModel from './server-model.js';

const PORT = process.env.PORT || 7070;
const server = express();

server
  .use((req, res) => {
    res.send('ws');
  })
  .listen(PORT);

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
