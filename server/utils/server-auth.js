const jwt = require("jsonwebtoken");

const secret = process.env.SECRET || "345wesrfg890puoi9-=0y[56w8isr4tuxjfgn";
const expiration = "2h";

module.exports = {
  authMiddleware: function ({ req }) {
    const token =
      req.body.token || req.query.token || req.headers.authorization;
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }
    if (!token) {
      return req;
    }
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (err) {
      console.log("Invalid token", err);
    }
    return req;
  },
  signToken: function ({ firstName, email, _id }) {
    return jwt.sign({ data: { firstName, email, _id } }, secret, {
      expiresIn: expiration,
    });
  },
};
