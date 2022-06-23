const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');

const Environment = require("./src/environment");
const Consts = require("./src/consts");

const bodyParser = require('body-parser');
const Cors = require('cors');
const cookieParser = require("cookie-parser");

const path = require('path');
const fs = require('fs');

const MySQL = require('promise-mysql');
const Database = require('./lib/pkgs/database');
const DatabaseListener = require('./lib/pkgs/database_listener');
const Applications = require('./services/applications/applications');

async function main() {
  // create an app
  Environment.app = express();
  Environment.app.use(express.json());
  Environment.app.use(Cors());
  Environment.app.use(express.static(__dirname + '/node_modules'));
  // Add headers before the routes are defined
  Environment.app.use((request, response, next) => {
    // Website you wish to allow to connect
    response.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    response.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
  });
  Environment.app.use(bodyParser.json());
  Environment.app.use(bodyParser.urlencoded({ extended: true }));
  Environment.app.use(cookieParser());
  Environment.app.set('view engine', 'ejs');
  Environment.app.disable('etag');
  // init route checker
  Environment.addViewPath('services/general_storage/views');

  // create a server
  Environment.server = http.createServer(Environment.app);

  // init database connection
  Environment.databaseConnection = await MySQL.createConnection(Consts.DB_DNS);
  Environment.database = new Database();
  
  // init database listener
  Environment.databaseListener = new DatabaseListener();

  // init models
  initDirModels();

  // init applications
  new Applications().store();

  // start listenig server
  Environment.server.listen(Consts.SERVER_PORT, (error) => {
    if(error) {
      console.error(error);
    } else {
      console.log('server started\n');
      console.log('server routes: ');
      getAppRoutes(true);
      console.log('');
    }
  });
}

function initDirModels(dirname = "./services/models") {
  var dirItems = fs.readdirSync(dirname);
  dirItems.forEach(dirItem => {
    if(dirItem.indexOf('.js') != -1) {
      const _class = require('./' + dirname + '/' + dirItem.replace('.js', ''));
      new _class().store();
    } else {
      this.initDirModels(dirname+'/'+dirItem, target);
    }
  });
}

function getAppRoutes(showIt = false) {
  var routes = [];
  var i = 1;
  Environment.app._router.stack.forEach(layer => {
    if(layer.route) {
      routes.push({path: layer.route.path, methods: Object.keys(layer.route.methods)});
      if(showIt) console.log(i+'-', '"'+layer.route.path+'"');
      i++;
    }
  });
  return routes;
}

function routeExists(route) {
  var isExists = false;
  getAppRoutes().forEach(_route => {
    if(_route.path.indexOf(':') != -1) _route.path = removeEndSplit(_route.path, '/');
    if( _route.path != '' && route.path.indexOf(_route.path) != -1 && _route.methods.indexOf(route.method) != -1) {
      isExists = true;
    }
  });
  return isExists;
}

function removeEndSplit(str, splitStr) {
  return str.split(splitStr).slice(0, str.split(splitStr).length - 1).join(splitStr);
}

main();