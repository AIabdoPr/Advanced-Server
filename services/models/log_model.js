const Model = require("../../lib/pkgs/model");

class LogModel extends Model {
  
  constructor() {
    super("log");
  }

  tb_name = "logs";
  columns = {
    id: "integer",
    type: "string",
    name: "string",
    message: "string",
    extra_values: "array",
    created_at: "datetime",
    updated_at: "datetime",
  };

}

module.exports = LogModel