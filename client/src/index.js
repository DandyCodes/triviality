import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./controllers/io-client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { ApolloLink } from "@apollo/client";

const httpLinkToGraphQLServer = createHttpLink({
  uri: "/graphql",
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("id_token");
  const oldContext = operation.getContext();
  const oldHeaders = oldContext?.headers || {};
  const newContext = {
    headers: {
      ...oldHeaders,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
  operation.setContext(newContext);
  return forward(operation);
});

const apolloClientLinks = authLink.concat(httpLinkToGraphQLServer);

const client = new ApolloClient({
  link: apolloClientLinks,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
