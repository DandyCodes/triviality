const jwt = require("jsonwebtoken");
const secret = process.env.SECRET || "345we6srdxf84675ri=790--08p;oui";
const maxAge = "2h";

const serverAuth = {
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }
    if (!token) {
      return req;
    }
    try {
      const { data } = jwt.verify(token, secret, { maxAge });
      req.user = data;
    } catch (err) {
      console.log(err);
    }
    return req;
  },

  signToken: function ({ email, nickname, _id }) {
    const payload = { email, nickname, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: maxAge });
  },
};

module.exports = serverAuth;
