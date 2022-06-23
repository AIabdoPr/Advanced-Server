const Routes = require('../../../../lib/pkgs/routes');
const SocketClient = require('../../../../lib/pkgs/socket_client');
const Environment = require('../../../../src/environment');

class SocketRoutes extends Routes {

  constructor() {
    super('admin');
    const SocketIO = require('socket.io');
    Environment.sockets.admin = SocketIO(Environment.server, {
      path: '/admin-socket/',
      cors: {
        origin: '*',
        allowEIO3: true,
      },
      allowEIO3: true,
    });
    Environment.sockets.admin.on('connection', (client) => {
      if(Environment.socketClients.admin == undefined) Environment.socketClients.admin = {};
      Environment.socketClients.admin[client.handshake.query.userId] = new SocketClient(client, 'admin', Environment.models.admin);
      Environment.socketClients.admin[client.handshake.query.userId].addEvent('users')
      client.on('join', (data) => {
        console.log(data);
      });
    });
    Environment.sockets.admin.use(Environment.middlewares.admin['socket-jwt']);
  }

  setupRoutes() {
    this.createSocketRoute('load-tab', (socketClient, tabname) => {
      this.controllers.admin.tabLoader(socketClient, tabname);
    });
    this.createSocketRoute('load-users', (socketClient) => {
      this.controllers.admin.sendUsers(socketClient);
    });

  }

}

module.exports = SocketRoutes;