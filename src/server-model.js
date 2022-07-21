export default class ServerModel {
  constructor(webSocketServer) {
    this.server = webSocketServer;
    this.clientSockets = new Set();

    this.uniqueClientName = new Set();

    this.clientsName = new Map();
  }

  deleteClient(clientSocket) {
    const clientName = this.getClientName(clientSocket);

    this.clientSockets.delete(clientSocket);
    this.clientsName.delete(clientSocket);
    this.uniqueClientName.delete(clientName);
  }

  hasClient(clientSocket) {
    return this.clientSockets.has(clientSocket);
  }

  hasClientName(clientName) {
    return this.uniqueClientName.has(clientName);
  }

  getClientName(clientSocket) {
    return this.clientsName.get(clientSocket);
  }

  getOtherClientNames(clientSocket) {
    return [...this.uniqueClientName].filter(
      (name) => name !== this.getClientName(clientSocket)
    );
  }

  sendAllCallback(callback) {
    this.clientSockets.forEach((clientSocket) => {
      const message = callback(clientSocket);

      clientSocket.send(JSON.stringify(message.toObject()));
    });
  }

  setClientName(clientSocket, name) {
    this.uniqueClientName.add(name);
    this.clientsName.set(clientSocket, name);
  }

  addClient(clientSocket) {
    this.clientSockets.add(clientSocket);
    this.clientsName.set(clientSocket, 'undefined');
  }

  start(callback) {
    this.server.on('connection', callback);
  }
}
