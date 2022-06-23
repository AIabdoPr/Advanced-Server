class Consts {
  static APP_PATH = __dirname + '/../';
  static APPLICATIONS_PATH = Consts.APP_PATH + 'services/applications/';
  static APP_NAME = "Advanced Server";
  // static APP_KEY = "base64:cLJe6ea21Y1ufYjkxSeHObkFK1iOFcNKbW6NFq7+O7E:";
  static APP_KEY = "addvanced_server";
  // static JWT_SECRET = "jwt secret key"; // for genrate it run "npm run generate-key"
  static JWT_SECRET = "$2b$10$mQUbR6D/X5BLN9N0GenTMur8/9uvaIZdY7ca7MlXoXdteIj6e1cqe"; // added at Thu Jun 16 2022 14:58:35 GMT+0100 (GMT+01:00)
  static SERVER_IP = "localhost";
  static SERVER_PORT = 80;
  static SERVER_URL = "http://" + this.SERVER_IP + ":" + this.SERVER_PORT;
  static DB_CONNECTION = "mysql";
  static DB_HOSTNAME = "localhost";
  static DB_PORTNUMB = 3306;
  static DB_DATABASE = "advanced_server";
  static DB_USERNAME = "root";
  static DB_PASSWORD = "";
  static DB_DNS = {
    host: Consts.DB_HOSTNAME,
    user: Consts.DB_USERNAME,
    password: Consts.DB_PASSWORD,
    database: Consts.DB_DATABASE,
    port: Consts.DB_PORTNUMB,
  }
  static DB_ENABLE_LISTENER = true;

  static SOCKET_HEADERS = {
    // transports: ["websocket"],
    cors: {
      origin: "*",
      allowEIO3: true,
      // methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
    allowEIO3: true,
    // transports: ['websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling'],
  }
}

module.exports = Consts;