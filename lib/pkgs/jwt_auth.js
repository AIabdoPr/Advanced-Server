const JWT = require('jsonwebtoken');
const Consts = require('../../src/consts');
const Environment = require('../../src/environment');

class JWTAuth {

  static async sign(model, data, userId, user_type = "user", secretKey = Consts.JWT_SECRET) {
    var token = JWT.sign(data, secretKey);
    var access_token_id = await Environment.models.access_token.create({
      user_type: user_type,
      user_id: userId,
      token: token,
      last_used_at: new Date().now,
    }).insertId;
    await model.update(userId, {
      remember_token_id: access_token_id,
    });
    return token;
  }

  static async verify(token, action, secretKey = Consts.JWT_SECRET) {
    var access_token = await Environment.models.access_token.find(token, "token");
    if(access_token) {
      var tokenData = JWT.verify(token, secretKey);
      if(tokenData) {
        if (action == "sign") {
          await Environment.models.access_token.update(tokenData.userId, {
            last_used_at: new Date().now,
          });
        }
        return tokenData;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  static async signout(token) {
    var access_token = await Environment.models.access_token.find(token, "token");
    if (access_token) {
      console.log(await Environment.models.access_token.delete(access_token.id));
      return { success: true };
    } else {
      return { success: false, message: "invalid token" };
    }
  }

}

module.exports = JWTAuth;