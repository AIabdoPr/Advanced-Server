# Advanced Server

## Introduction

This is an advanced server template, which i ctrated by Node.Js, Whichis characterized bt its ease of configuration and thz capabilites it provides which are:

- you can create many services application like (admin web, public web, api).
- you can create sucere routes for api or socket, with sucere middlewares.
- you can use socket connection

## Get Started

### Instalation

```sheel
  git clone https://github.com/AIabdoPr/Advanced-Server.git
  cd Advanced-Server
  npm install
```

### Configuration

- open file "src/consts.js" and edit configurations.
- generate jwt secret key by run command ```npm run generate-key```

## Commands

- create an application: ```npm run make:application <-appId-> <-type->``` [types like 'c_m_r_v_s' (c: controllers, m: middlewares, r: routes, rs, socket routes, ra: api routes, v: views, s: resources)]
- create controller: ```npm run make:controller <-controller name-> <-appId->```
- create middleware: ```npm run make:middleare <-middleware name-> <-appId->```
- create routes sourece: ```npm run make:routes_source <-type-> <-appId->``` [types: like 'socket' or 'api']
- create view: ```npm run make:view <-view name-> <-appId->```
- create model: ```npm run make:model <-model name->```
- create migration: ```npm run make:migration <-table name->```
- cerate fake: ```npm run make:fake <-table name->```
- execute migrations: ```npm run migrate```
- execute fakes: ```npm run fake```

## Model

It is used to work with database tables

### Model form

```js
  const Model = require("../../lib/pkgs/model");

  class TestModel extends Model {
    
    constructor() {
      super("model_name");
    }

    tb_name = "table name";
    columns = {
      id: 'integer',
      firstname: 'string',
      lastname: 'string',
      gender: 'string',
      phone: 'integer',
      email: 'string',
      password: 'string',
      img_id: 'string',
      permissions: 'array',
      rules: 'array',
      email_verified_at: 'datetime',
      remember_token_id: "string",
      created_at: 'datetime',
      updated_at: 'datetime',
    };

    hiddens = [// hiddne columns
      "email_verified_at",
      "password",
      "updated_at",
    ]

    links = {
      column: 'table_name' // for get column data from another table 
    }

    events = {
      'slsect': onSelectFunc()
    }

  }

  module.exports = LogModel
```

### Create row

```js
  Environment.models.model_name.create({
    id: 1,
    col1: 'val1',
    col2: ['1', 2, true],
    col3: {a: 1, b: ['test']}
    col3: true,
  });
```

### Get rows

```js
  // get all
  var rows = Environment.models.model_name.all();
  // get where
  var rows = Environment.models.model_name.where({col1:'a'});
  // find by id
  var row = Environment.models.model_name.find(1);
  // find by custom column
  var row = Environment.models.model_name.find('a', 'col1');
```

### Update rows

```js
  // all
  Environment.models.model_name.updateAll({
    col1: 'val1',
    col2: ['1', 2, true],
    col3: {a: 1, b: ['test']}
    col3: true,
  });
  // by id
  Environment.models.model_name.update(1, {
    id: 1,
    col1: 'val1',
    col2: ['1', 2, true],
    col3: {a: 1, b: ['test']}
    col3: true,
  });
  // by column
  Environment.models.model_name.updateWhere({col1: 1}, {
    id: 1,
    col1: 'val1',
    col2: ['1', 2, true],
    col3: {a: 1, b: ['test']}
    col3: true,
  });
```

### Delete row

```js
  Environment.models.model_name.delete(1)
```

## Migrations

It is used to create or update tables on database

### Migration form

```js
  const TableMaker = require("../../../lib/pkgs/table_maker");

  class Migration {
    
    table;
    logInfo = "some log infos when execute migration";

    constructor() {
      this.table = new TableMaker("admins");
      this.setupTable();
    }

    setupTable() {
      this.table.index("id");
      this.table.column("firstname").string()._length(255);
      this.table.column("lastname").string()._length(255);
      this.table.column("gender").choices(["male", "female"]).default("male");
      this.table.column("phone").integer()._length(13);
      this.table.column("email").string()._length(255);
      this.table.column("password").string()._length(255);
      this.table.column("remember_token_id").string()._length(255).nullable();
      this.table.column("permissions").array().default('{}');
      this.table.column("rules").array().default('{}');
      this.table.column("img_id").integer()._length(255).default(2);
      this.table.column("email_verified_at").datetime().nullable();
      this.table.timestamps();
    }
    
    async execute() {
      return await this.table.execute();
    }

  }

  module.exports = Migration
```

## Fakes

It is used for insert or update or delete fake data to tables on database

### Fake form

```js
  const Fake = require("../../../lib/pkgs/fake");

  class AdminFake extends Fake {

    logInfo = 'created admin user:\n'+
              '-> email: abdopr47@gmail.com\n'+
              '-> password: 123456';

    constructor() {
      super("admin");
      this.setup();
    }

    setup() {
      this.insert({
        firstname: 'Abdo',
        lastname: 'Pr',
        gender: 'male',
        email: 'abdopr47@gmail.com',
        phone: '+213778185797',
        password: this.createPassword('123456'),
      });
    }

  }

  module.exports = AdminFake
```

## Routes

It is used for create api and socket routes

### Api routes form

```js
  const Routes = require("../../../../lib/pkgs/routes");
  const Environment = require("../../../../src/environment");

  class ApiRoutes extends Routes {

    constructor() {
      super('admin', '/admin'); // appid, custom path 
      Environment.addViewPath(__dirname + '/../views'); // application views
    }

    setupRoutes() {

      var authGroup = this.createGroup("/auth");// create group routes
      authGroup.createRoute().get("/login").func(this.controllers.admin.login);// create route
      authGroup.createRoute().post("/login").func(this.controllers.admin.login);

      var adminGroup = this.middlewaredGroup("jwt");// create middlewared group routes
      adminGroup.createRoute().get("").func(this.controllers.admin.index);
      adminGroup.createRoute().get("/logout").func(this.controllers.admin.logout);

    }

  }

  module.exports = ApiRoutes;
```

### Socket routes form

```js
  const Routes = require('../../../../lib/pkgs/routes');
  const SocketClient = require('../../../../lib/pkgs/socket_client');
  const Environment = require('../../../../src/environment');

  class SocketRoutes extends Routes {

    constructor() {
      super('admin');// appid
      const SocketIO = require('socket.io');
      Environment.sockets.admin = SocketIO(Environment.server, {// create socket connection
        path: '/admin-socket/',// custom namespace
        cors: {
          origin: '*',
          allowEIO3: true,
        },
        allowEIO3: true,
      });
      Environment.sockets.admin.on('connection', (client) => {// on client connected
        if(Environment.socketClients.admin == undefined) Environment.socketClients.admin = {};
        Environment.socketClients.admin[client.handshake.query.userId] = new SocketClient(client, 'admin', Environment.models.admin);// create socket client
      });
      Environment.sockets.admin.use(Environment.middlewares.admin['socket-jwt']); // add middleware
    }

    setupRoutes() {
      this.createSocketRoute('event', (socketClient, tabname) => {
        this.controllers.admin.eventFunc(socketClient, tabname);
      });
      this.createSocketRoute('event2', (socketClient) => {
        socketClient.emit('event2-message', 'message');
      });

    }

  }

  module.exports = SocketRoutes;
```

## Middlewares

It is used to scuere api and socket routes

## Middleware form

```js
  const JWTAuth = require("../../../../lib/pkgs/jwt_auth");
  const Middleware = require("../../../../lib/pkgs/middleware");

  class JwtMiddleware extends Middleware {

    constructor() {
      super('admin', "jwt");// appid, middleware name
    }

    cookiesParser(cookieContent) {// to parser socket cookies
      var cookie = {};
      if(cookieContent) {
        cookieContent.split('; ').forEach(item => {
          cookie[item.split('=')[0]] = item.split('=')[1];
        });
      }
      return cookie;
    }

    verify = async (request, response) => { // this function rquired to api routes
      var token = request.request.cookies.adminAuth;
      if (token) {
        try {
          var verifyData = await JWTAuth.verify(token);
          for (const key in verifyData) {
            request.addValue(key, verifyData[key]) ;
          }
          return { success: true };
        } catch (error) {
          console.log("adminAuth:", error);
          return { success: false, redirectUrl: request.getRequestHostUrl() + "/admin/auth/login" };
        }
      } else {
        return { success: false, redirectUrl: request.getRequestHostUrl() + "/admin/auth/login" };
      }
    };

    socketVerify = async (socket, next) => { // this function required to socket routes
      var cookie = this.cookiesParser(socket.handshake.headers.cookie);
      if (cookie.adminAuth) {
        try {
          var tokenData = await JWTAuth.verify(cookie.adminAuth);
          if (tokenData && tokenData.admin_id) {
            socket.handshake.query.userId = tokenData.admin_id;
            return next();
          } else {
            return next(new Error("Invalid token or email"));
          }
        } catch (error) {
          // return next(new Error(error.message));
          return error.message.toString();
        }
      } else {
        return next(new Error("Invalid token or email"));
      }
    };

  }

  module.exports = JwtMiddleware;
```
