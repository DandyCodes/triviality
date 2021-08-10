const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/server-auth");
const mongooseConnection = require("./config/mongoose-connection");
const PORT = process.env.PORT || 3001;

const app = express();

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

apollo.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

const httpServer = require("http").createServer(app);

const io = require("socket.io")(httpServer);
const ioServerController = require("./controllers/io-server-controller");
ioServerController.config(io);

mongooseConnection.once("open", () => {
  httpServer.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${apollo.graphqlPath}`);
  });
});
