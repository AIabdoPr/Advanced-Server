const Model = require("../../lib/pkgs/model");

class AccessTokenModel extends Model {

  constructor() {
    super("access_token");
  }

  tb_name = "access_tokens";
  columns = {
    user_type: "string",
    user_id: "integer",
    token: "string",
    last_used_at: "datetime",
    created_at: "datetime",
    updated_at: "datetime",
  };

  // links = {
  //   user_id: "user",
  // }

}

module.exports = AccessTokenModel