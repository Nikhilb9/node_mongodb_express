const jwt = require("jsonwebtoken");
const User = require("./models/user");
class JWTService {
  /**
   * Genereate token
   * @param {*} payload
   * @returns
   */
  async generateToken(payload) {
    try {
      let token = jwt.sign(payload, "fake");
      return `Bearer ${token}`;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Verify token
   * @param {*} token
   * @returns
   */
  async verifyToken(req, res, next) {
    try {
      const auth = req.headers["authorization"];

      if (!auth) {
        throw "Parameter Header: authorization is missing";
      }
      var tmp = auth.split(" ");

      if (tmp.length !== 2) {
        throw "Invalid authorization";
      }
      // Verify the extracted token
      const jwtToken = auth.split(" ")[1];

      let decodedToken = await await jwt.verify(jwtToken, "fake");

      if (!decodedToken) {
        throw createError(401, "Unauthorized Client");
      }

      const user = await User.findOne({
        email: decodedToken.email,
        token: auth,
      });

      if (!user) {
        throw "Unauthorized Client";
      }

      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).send({ error: "TOKEN EXPIRED" });
      } else if (
        err instanceof jwt.NotBeforeError ||
        err instanceof jwt.JsonWebTokenError
      ) {
        return res.status(401).send({ error: "Unauthorized Client" });
      }
      return res.status(401).send({ error: err });
    }
  }
}
const jwtService = new JWTService();
module.exports = { jwtService };
