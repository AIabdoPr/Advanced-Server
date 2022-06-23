const TableMaker = require("../../../lib/pkgs/table_maker");

class Migration {
  
  table;
  // logInfo = "some log infos";

  constructor() {
    this.table = new TableMaker("users");
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
    this.table.column("remember_token").string()._length(255).nullable();
    this.table.column("img_id").integer()._length(255).default(2);
    this.table.column("email_verified_at").datetime().nullable();
    this.table.timestamps();
  }
  
  async execute() {
    return await this.table.execute();
  }

}

module.exports = Migration
