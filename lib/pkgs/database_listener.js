const MySQLEvents = require('@rodrigogs/mysql-events');
const ListenerException = require("./hundler/listener_exception");
const Consts = require('../../src/consts');

class DatabaseListener {

  listeners = {
    "insert": {},
    "update": {},
    "delete": {},
  };
  mySQLEvents;

  constructor() {
    this.mySQLEvents = new MySQLEvents(Consts.DB_DNS, {startAtEnd: true});
    this.start();
  }

  async start() {
    await this.mySQLEvents.start();
    this.mySQLEvents.addTrigger({
      name: 'monitoring all statments',
      expression: Consts.DB_DATABASE+'.*', 
      statement: MySQLEvents.STATEMENTS.ALL,
      onEvent: event => {
        if(this.listeners[event.type.toLowerCase()][event.table] != undefined) {
          this.listeners[event.type.toLowerCase()][event.table].forEach(func => {
            func(event, event.type.toLowerCase());
          });
        }
      }
    });
    this.mySQLEvents.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
    this.mySQLEvents.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
  }

  createListener(listenerName, type, funcs) {
    this.listeners[type][listenerName] = funcs;
  }

  addListenerFunc(listenerName, type, func) {
    var eventTypes = ["insert", "update", "delete"]
    if(type = "*") {
      eventTypes.forEach(_type => {
        if(this.listeners[_type][listenerName] == undefined) this.createListener(listenerName, _type, []);
        this.listeners[_type][listenerName].push(func);
      })
    } else {
      if (eventTypes.indexOf(type) == -1) {
        throw new ListenerException("Incorrect Type (" + type + ")");
      }
      if(this.listeners[type][listenerName] == undefined) this.createListener(listenerName, type, []);
      this.listeners[type][listenerName].push(func);
    }
  }

  removeListener(listenerName, type) {
    delete(this.listeners[type][listenerName]);
  }

  removeListenerFunc(listenerName, type, funcId) {
    if(this.listeners[type][listenerName] != undefined && this.listeners[type][listenerName][funcId] != undefined) {
      delete(this.listeners[type][listenerName][funcId]);
    }
  }

}

module.exports = DatabaseListener;