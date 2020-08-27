// Credit to Robin Wieruch's excellent Graphql tutorial for the boilerplate walkthrough
// Tutorial: https://www.robinwieruch.de/graphql-apollo-server-tutorial

// NOTE: KEEP DOTENV AS FIRST IMPORT :D
import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import models, { sequelize } from './src/models/index';
import schema from './src/schema/index';
import resolvers from './src/resolvers/index';
import { createUsersWithMessages } from './seed';

const app = express();

// Deconstruct ENV vars for brevity
const { ROOT_ENDPOINT, ERASE_DB_ON_SYNC, PORT } = process.env

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: error => {
    // Globally format error messages
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');
 
    return {
      ...error,
      message,
    };
  },
  context: async () => ({
      // Context calls to DB models are async in sequelize
      models,
      me: await models.User.findByLogin('rwieruch')
  })
});

// Express is middleware to apollo-server
server.applyMiddleware({ app, path: ROOT_ENDPOINT });

// DB syncing actions are performed before opening the server
sequelize.sync({ force: ERASE_DB_ON_SYNC }).then(() => {
  if (ERASE_DB_ON_SYNC) {
    createUsersWithMessages();
  }

  app.listen({ port: PORT }, () => {
      console.log(`Server is running at http://localhost:${PORT}${ROOT_ENDPOINT}`);
    });
});
