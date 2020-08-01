// Credit to Robin Wieruch's excellent Graphql tutorial for the boilerplate walkthrough
// Tutorial: https://www.robinwieruch.de/graphql-apollo-server-tutorial

// NOTE: KEEP DOTENV AS FIRST IMPORT :D
import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import models from './src/models/index';
import schema from './src/schema/index.js';
import resolvers from './src/resolvers/index';

const app = express();


const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
      models,
      me: models.users[1],
  }
});

server.applyMiddleware({ app, path: process.env.ROOT_PATH });

app.listen({ port: process.env.PORT }, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}${process.env.ROOT_PATH}`);
  });
