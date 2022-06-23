const TableMaker = require("../../../lib/pkgs/table_maker");

class Migration {
  
  table;
  // logInfo = "some log infos";

  constructor() {
    this.table = new TableMaker("access_tokens");
    this.setupTable();
  }

  setupTable() {
    this.table.index("id");
    this.table.column("user_type").string()._length(11).default("user");
    this.table.column("user_id").integer()._length(12);
    this.table.column("token").string()._length(255);
    this.table.column("last_used_at").datetime().nullable();  
    this.table.timestamps();
  }
  
  async execute() {
    return await this.table.execute();
  }

}

module.exports = Migration
