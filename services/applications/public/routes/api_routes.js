const Routes = require("../../../../lib/pkgs/routes");
const Environment = require("../../../../src/environment");

class ApiRoutes extends Routes {

  constructor() {
    super('public');
    Environment.addViewPath(__dirname + '/../views');
  }

  setupRoutes() {

    this.createRoute().get('').func(this.controllers.user.index);
    var authGroup = this.createGroup("/auth");
    // authGroup.createRoute().get("/login").func(this.controllers.public.login);
    // authGroup.createRoute().post("/login").func(this.controllers.public.login);

  }

}


module.exports = ApiRoutes;