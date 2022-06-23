const JWTAuth = require("../../../../lib/pkgs/jwt_auth");
const Middleware = require("../../../../lib/pkgs/middleware");

class JwtMiddleware extends Middleware {

  cookieAuthKey = 'auth';

  constructor(cookieAuthKey = 'auth') {
    super('public', "jwt");
    this.cookieAuthKey = cookieAuthKey;
  }

  cookiesParser(cookieContent) {
    var cookie = {};
    if(cookieContent) {
      cookieContent.split('; ').forEach(item => {
        cookie[item.split('=')[0]] = item.split('=')[1];
      });
    }
    return cookie;
  }

  verify = async (request, response) => {
    var token = request.request.cookies[this.cookieAuthKey];
    if (token) {
      try {
        var verifyData = await JWTAuth.verify(token);
        for (const key in verifyData) {
          request.addValue(key, verifyData[key]) ;
        }
        return { success: true };
      } catch (error) {
        console.log("auth:", error);
        return { success: false, redirectUrl: request.getRequestHostUrl() + "/auth/login" };
      }
    } else {
      return { success: false, redirectUrl: request.getRequestHostUrl() + "/auth/login" };
    }
  };

  socketVerify = async (socket, next) => {
    var cookie = this.cookiesParser(socket.handshake.headers.cookie);
    if (cookie[this.cookieAuthKey]) {
      try {
        var tokenData = await JWTAuth.verify(cookie[this.cookieAuthKey]);
        if (tokenData && tokenData.id) {
          socket.handshake.query.userId = tokenData.id;
          return next();
        } else {
          return next(new Error("Invalid token or email"));
        }
      } catch (error) {
        // return next(new Error(error.message));
        return error.message.toString();
      }
    } else {
      return next(new Error("Invalid token or email"));
    }
  };

}

module.exports = JwtMiddleware;