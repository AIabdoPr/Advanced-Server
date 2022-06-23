
const Environment = require("../../src/environment");
const ListenerException = require("./hundler/listener_exception");

class Controller {

  appId = '';
  controllerName = '';
  model = null;
  onListenerFuncs = {
    "insert": [],
    "update": [],
    "delete": [],
  };

  constructor(appId, controllerName, model) {
    this.appId = appId;
    this.controllerName = controllerName.toLowerCase();
    this.model = model;
  }

  setupListener(type = "*") {
    Environment.databaseListener.addListenerFunc(this.model.tb_name, type, (event, eventType) => {
      this.onListener(event, eventType);
    });
  }

  onListener(event, eventType) {
    this.onListenerFuncs[eventType].forEach(func => {
      func(event);
    });
  }

  addListenerFunc(func, type = "*") {
    var eventTypes = ["insert", "update", "delete"]
    if(type == "*") {
      eventTypes.forEach(_type => {
        this.onListenerFuncs[_type].push(func);
      });
    } else {
      if (eventTypes.indexOf(type) == -1) {
        throw new ListenerException("Incorrect Type (" + type + ")") ;
      }
      this.onListenerFuncs[type].push(func);
    }
  }

  checkValidators(validators, query) {
    var errors = [];
    for (var field in validators) {
      if(query[field]) {
        query[field].split('|').forEach(validator => {
          if(validator == 'integer') {
            try {

            } catch (error) {
              
            }
          }
        });
      } else {
        errors.push('The ' + field + ' required');
      }
    }
    return {
      success: errors.length == 0,
      errors: errors,
    }
  }

  async getRows(rows, after = true) {
    var _rows = [];
    rows.forEach(row => {
      if(after) _rows.push(row.after);
      else _rows.push(row.before);
    });
    var render = await this.model.render(_rows, true);
    return render;
  }

  store() {
    if(Environment.controllers[this.appId] == undefined) {
      Environment.controllers[this.appId] = {};
    }
    Environment.controllers[this.appId][this.controllerName] = this;
  }

}

module.exports = Controller;