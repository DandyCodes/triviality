require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");
const db = require("./config/connection");
const http = require("http");
const router = require("./routes/routes");

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);
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

app.use(router);

db.once("open", () => {
  server.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${apollo.graphqlPath}`);
  });
});
