const Model = require("../../lib/pkgs/model");

class AdminModel extends Model {
  
  constructor() {
    super("admin");
  }

  tb_name = "admins";
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

  hiddens = [
    "email_verified_at",
    "password",
    "updated_at",
  ]

}

module.exports = AdminModel