const Routes = require("../../../../lib/pkgs/routes");
const Environment = require("../../../../src/environment");

class ApiRoutes extends Routes {

  constructor() {
    super('admin', '/admin');
    Environment.addViewPath(__dirname + '/../views');
  }

  setupRoutes() {

    var authGroup = this.createGroup("/auth");
    authGroup.createRoute().get("/login").func(this.controllers.admin.login);
    authGroup.createRoute().post("/login").func(this.controllers.admin.login);

    var adminGroup = this.middlewaredGroup("jwt");
    adminGroup.createRoute().get("").func(this.controllers.admin.index);
    adminGroup.createRoute().get("/logout").func(this.controllers.admin.logout);

  }

}

module.exports = ApiRoutes;