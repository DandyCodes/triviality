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
    } catch {
      console.log("Invalid token");
    }
    return req;
  },

  signToken: function ({ email, name, _id }) {
    const payload = { email, name, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: maxAge });
  },
};

module.exports = serverAuth;
