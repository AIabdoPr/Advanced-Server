const JWTAuth = require('../../../../lib/pkgs/jwt_auth');
const Middleware = require('../../../../lib/pkgs/middleware');

class JwtMiddleware extends Middleware {

  constructor() {
    super('api', 'jwt');
  }

  verify = async (request, response) => {
    var token = request.query.token;
    if (token) {
      try {
        var verifyData = await JWTAuth.verify(token);
        if (verifyData) {
          for (const key in verifyData) {
            request.addValue(key, verifyData[key]);
          }
          return { success: true };
        } else {
          return {success: false, message: 'Invalid Token' }
        }
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    } else {
      return { success: false, message: 'The token is required' };
    }
  };

  socketVerify = async (socket, next) => {
    console.log(socket);
    var query = socket.handshake.query;
    if (query.token) {
      try {
        var tokenData = await JWTAuth.verify(query.token);
        if (tokenData && tokenData.userId) {
          socket.handshake.query.userId = tokenData.userId;
          return next();
        } else {
          return next(new Error('Invalid token or email'));
        }
      } catch (error) {
        // return next(new Error(error.message));
        return error.message.toString();
      }
    } else {
      return next(new Error('Invalid token or email'));
    }
  };

}

module.exports = JwtMiddleware;