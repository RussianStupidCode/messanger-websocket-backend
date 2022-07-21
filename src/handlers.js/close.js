/* eslint-disable import/extensions */

export default function closeHandler(server, clientSocket) {
  server.deleteClient(clientSocket);
}
