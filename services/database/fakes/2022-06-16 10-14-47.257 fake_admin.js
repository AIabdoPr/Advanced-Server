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