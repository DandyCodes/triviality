require("dotenv").config();
const PORT = process.env.PORT || 3001;
const path = require("path");

const express = require("express");
const app = express();

const server = require("http").createServer(app);

const io = require("socket.io")(server);
require("./controllers/io-server")(io);

const mongooseConnection = require("./config/mongoose-connection");

const apollo = require("./config/apollo");

apollo.applyMiddleware({ app });
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

mongooseConnection.once("open", () => {
  server.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${apollo.graphqlPath}`);
  });
});
