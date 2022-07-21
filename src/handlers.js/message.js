/* eslint-disable import/extensions */
import moment from 'moment';
import MESSAGE_TYPES from '../message-types.js';
import Message from '../message.js';

function loginHandler(server, clientSocket, clientMessage, successCallback) {
  const date = moment().unix();

  if (!server.hasClient(clientSocket)) {
    if (server.hasClientName(clientMessage.content)) {
      const message = new Message({
        type: MESSAGE_TYPES.login,
        content: '',
        error: 'username is taken',
        date,
      });

      clientSocket.send(JSON.stringify(message.toObject()));
      return;
    }

    server.addClient(clientSocket);
    server.setClientName(clientSocket, clientMessage.content);

    const message = new Message({
      type: MESSAGE_TYPES.login,
      content: 'ok',
      date,
    });

    clientSocket.send(JSON.stringify(message.toObject()));

    successCallback();
  }
}

function userMessageHandler(server, clientSocket, clientMessage) {
  const date = moment().unix();
  const senderName = server.getClientName(clientSocket);

  const createUserMessage = (socket) =>
    new Message({
      senderName,
      type: MESSAGE_TYPES.userMessage,
      content: clientMessage.content,
      date,
      isYouOwner: clientSocket === socket,
    });

  server.sendAllCallback(createUserMessage);
}

export default function messageHandler(server, clientSocket, data) {
  const object = JSON.parse(data);

  const clientMessage = Message.fromObject(object);

  const createUserListMessage = (socket) => {
    const userNames = [...server.uniqueClientName].filter(
      (name) => name !== server.getClientName(socket)
    );

    return new Message({
      type: MESSAGE_TYPES.usersList,
      content: userNames,
      date: moment().unix(),
    });
  };

  const sendAllUserNames = () => {
    server.sendAllCallback(createUserListMessage);
  };

  if (clientMessage.type === MESSAGE_TYPES.login) {
    loginHandler(server, clientSocket, clientMessage, sendAllUserNames);
  }

  if (clientMessage.type === MESSAGE_TYPES.userMessage) {
    userMessageHandler(server, clientSocket, clientMessage);
  }
}
