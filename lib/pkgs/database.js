const Environment = require('../../src/environment');

class Database {

  databaseConnection;

  datesRanges = {
    thisDay: '%Y-%m-%d',
    thisMonth: '%Y-%m',
    thisYear: '%Y',
  };

  constructor() {
    this.databaseConnection = Environment.databaseConnection;
  }

  async tbExists(tb_name) {
    return (await this.databaseConnection.query("SHOW TABLES LIKE '" + tb_name + "'")).length > 0;
  }

  async insert(tb_name, columns, values) {
    var query = "INSERT INTO " + tb_name + " (`" + columns.join('`, `') + "`) VALUES ?";
    return await this.databaseConnection.query(query, [values]);
  }

  async select(tb_name, columns = "*", where = "", dateRange = "", dateRangeColumn = "created_at") {
    columns = columns != "*" && columns.length > 0 ? "`" + columns.join('`, `') + "`" : "*";
    if(dateRange && dateRange != "" && this.datesRanges.hasOwnProperty(dateRange)) {
      if(where == "") where = [[dateRangeColumn, "=", "CURDATE()"]];
      else where.push([dateRangeColumn, "=", "CURDATE()"]);
      if(columns == "*") columns = "DATE_FORMAT(" + dateRangeColumn + "," + this.datesRanges[dateRange] + ")";
      else columns = columns + " DATE_FORMAT(" + dateRangeColumn + ")"
    }
    var _where = "";
    if (where && where != "") {
      _where = [];
      for (let i = 0; i < where.length; i++) {
        _where.push("`" + where[i][0] + "` " + where[i][1] + " '" + where[i][2] + "'");
      }
      _where = " WHERE " + _where.join(" and ");
    }
    var query = "SELECT " + columns + " FROM `" + tb_name + "`" + _where;
    return await this.databaseConnection.query(query);
  }

  async _whereIn(tb_name, columns = "*", values, where = "", column = "id") {
    columns = columns != "*" && columns.length > 0 ? "`" + columns.join('`, `') + "`" : "*";
    var _wherein = " WHERE `" + column + "`" + " IN " +  "('" + values.join("', '") + "') ";
    var _where = _wherein;
    if (where && where != "") {
      _where = [];
      for (let i = 0; i < where.length; i++) {
        _where.push("`" + where[i][0] + "` " + where[i][1] + " '" + where[i][2] + "'");
      }
      _where = _wherein + _where.join(" and ");
    }
    var query = "SELECT " + columns + " FROM `" + tb_name + "`" + _where;
    return await this.databaseConnection.query(query);
  }

  async _update(tb_name, values, where = "") {
    var _values = "";
    values.forEach(value => {
      value[0] = "`"+value[0]+"`";
      value[1] = "'"+value[1]+"'";
      _values += value.join(" = ");
    });
    var _where = "";
    if (where && where != "" ) {
      _where = [];
      for (let i = 0; i < where.length; i++) {
        _where.push("`" + where[i][0] + "` " + where[i][1] + " '" + where[i][2] + "'");
      }
      _where = " WHERE " + _where.join(" and ");
    }
    var query = "UPDATE `"+tb_name+"` SET "+_values+_where;
    return await this.databaseConnection.query(query);
  }
    
  async _delete(tb_name, where) {
    var _where = [];
    for (let i = 0; i < where.length; i++) {
      _where.push("`" + where[i][0] + "` " + where[i][1] + " '" + where[i][2] + "'");
    }
    _where = " WHERE " + _where.join(" and ");
    var query = "DELETE FROM `"+tb_name+"`"+_where;
    return await this.databaseConnection.query(query);
  }

}

module.exports = Database