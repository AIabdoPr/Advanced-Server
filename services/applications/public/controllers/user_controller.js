const Controller = require("../../../../lib/pkgs/controller");
const Environment = require("../../../../src/environment");

class UserController extends Controller {

  constructor() {
    super('public', 'user');
  }

  async index(request, response) {
    return response.send('success index');
  }

}

module.exports = UserController;