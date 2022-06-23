const {WebSocket} = require('ws');

class Websockets {

  websocketServer;

  constructor(expressServer) {
    this.websocketServer = new WebSocket.Server({
      noServer: true,
      path: "/websockets",
    });
    console.log(this.websocketServer)
  
    expressServer.on("upgrade", (request, socket, head) => {
      console.log(request, socket, head)
      this.websocketServer.handleUpgrade(request, socket, head, (websocket) => {
        this.websocketServer.emit("connection", websocket, request);
      });
    });
  
    this.websocketServer.on(
      "connection",
      function connection(websocketConnection, connectionRequest) {
        const [_path, params] = connectionRequest?.url?.split("?");
        const connectionParams = queryString.parse(params);
  
        // NOTE: connectParams are not used here but good to understand how to get
        // to them if you need to pass data with the connection to identify it (e.g., a userId).
        console.log(connectionParams);
  
        websocketConnection.on("message", (message) => {
          const parsedMessage = JSON.parse(message);
          console.log(parsedMessage);
        });
      }
    );
  
  };
}

module.exports = Websockets;