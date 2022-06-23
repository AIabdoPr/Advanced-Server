const bcrypt = require('bcrypt');
const fs = require('fs');
const Controller = require("../../../../lib/pkgs/controller");
const JWTAuth = require('../../../../lib/pkgs/jwt_auth');
const Log = require('../../../../lib/pkgs/log');
const Consts = require('../../../../src/consts');
const Environment = require('../../../../src/environment');

class AdminController extends Controller {

  constructor() {
    super('admin', 'admin', Environment.models.admin);
  }

  async index(request, response) {
    var user = {firstname: '', lastname: ''};
    var admin = await Environment.models.admin.find(request.admin_id);
    if(admin) {
      user.firstname = admin.firstname;
      user.lastname = admin.lastname;
    }
    return response.render('admin/pages/dashboard/index', {user: user});
  }

  async login(request, response) {
    if ("login", request.request.cookies.adminAuth) {
      if (await JWTAuth.verify(request.request.cookies.adminAuth)) {
        return response.redirect(request.getRequestHostUrl() + "/admin");
      }
    }
    var index = request.type == "GET";
    var validates = {
      email: "",
      password: "",
    };
    var values = {
      email: "",
      password: "",
    }
    if (!index && (request.email == undefined || request.email == "")) {
      validates.email = "The email is required";
    } else {
      values.email = request.email;
    }
    if (!index && (request.password == undefined || request.password == "")) {
      validates.password = "The password is required";
    } else {
      values.password = request.password;
    }
    if (!index && values.email != null && values.password != "") {
      var admin = await Environment.models.admin.find(request.email, "email");
      if (admin) {
        if(await bcrypt.compare(request.password, admin.password)) {
          var token = await JWTAuth.sign(Environment.models.admin, { admin_id: admin.id, email: request.email }, "admin");
          if (token) {
            Log.log("AdminAuth", "successfully login", {
              admin_id: admin.id,
              authToken: token,
            });
            response.cookie('adminAuth', token);
            return response.redirect(request.getRequestHostUrl() + "/admin");
          } else {
            Log.warninig("AdminAuth", "unsuccessfully login", {
              admin_id: admin.id,
              requestData: request.allData,
            });
            validates.email = "Invalid email or password";
          }
        } else {
          Log.warninig("AdminAuth", "Invaliable email or password", {
            admin_id: admin != undefined ? admin.id : undefined,
            requestData: request.allData,
          });
          validates.password = "Invalid password";
        }
      } else {
        Log.warninig("AdminAuth", "Invaliable email or password", {
          admin_id: admin != undefined ? admin.id : undefined,
          requestData: request.allData,
        });
        validates.email = "Invalid email";
      }
    }
    return response.render('admin/pages/login', {validates: validates, values: values});
  }

  async logout(request, response) {
    var signout = await JWTAuth.signout(request.token);
    if (signout.success) {
      response.clearCookie("adminAuth");
    } else {
      console.log("signout", signout.message);
    }
    return response.redirect(301, request.getRequestHostUrl() + "/admin/auth/login");
  }


}

module.exports = AdminController;