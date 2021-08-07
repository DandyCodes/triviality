require("dotenv").config();
const path = require("path");
const PORT = process.env.PORT || 3001;
const mongooseConnection = require("./config/mongoose-connection");
const apiRoutes = require("./controllers/api-routes");
const apollo = require("./config/apollo");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
require("./controllers/io-server")(io);

apollo.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.use(apiRoutes);

mongooseConnection.once("open", () => {
  server.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${apollo.graphqlPath}`);
  });
});
