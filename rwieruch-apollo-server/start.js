// Credit to Robin Wieruch's excellent Graphql tutorial for the boilerplate walkthrough
// Tutorial: https://www.robinwieruch.de/graphql-apollo-server-tutorial

// NOTE: KEEP DOTENV AS FIRST IMPORT :D
import 'dotenv/config';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { v4 as uuidv4 } from 'uuid';

const app = express();

const schema = gql`
    type Query {
        me: User
        user(id: ID!): User
        users: [User!]

        messages: [Message!]!
        message(id: ID!): Message!
    }

    type Mutation {
        createMessage(text: String!): Message!
        deleteMessage(id: ID!): Boolean!
        updateMessage(id: ID!, text: String!): Message!
    }

    type User {
        id: ID!
        username: String!
        messages: [Message!]
    }

    type Message {
        id: ID!
        text: String!
        user: User!
    }
`

const users = {
    1: {
        id: '1',
        username: 'Trey',
        messageIds: [1],
    },
    2: {
        id: '2',
        username: 'Carol',
        messageIds: [2],
    }
}

let me = users[1];

let messages = {
    1: {
        id: '1',
        text: 'Hello World',
        userId: '1',
    },
    2: {
        id: '2',
        text: 'Bye World',
        userId: '2',
    },
}

// NOTE: The 4 params to a resolver are (parent, args, context, info)
const resolvers = {
    Query: {
        me: (_, __, { me }) => {
            return me;
        },
        user: (_, { id }) => {
            return users[id];
        },
        users: () => {
            return Object.values(users)
        },
        messages: () => {
            return Object.values(messages);
        },
        message: (_, { id }) => {
            return messages[id]
        },
    },
    Mutation: {
        createMessage: (_, { text }, { me }) => {
            const id = uuidv4()
            const message = {
                id,
                text,
                userId: me.id
            };
            messages[id] = message;
            users[me.id].messageIds.push(id);
            return message            
        },
        deleteMessage: (_, { id }, { me }) => {
            // Descructure messages by message found and remainder
            const { [id]: message, ...otherMessages } = messages;

            if (!message) return false;
            // Overwrite messages
            messages = otherMessages;
            return true
        },
        updateMessage: (_, { id, text }) => {
            const { [id]: message } = messages;

            if (!message) return `Message with id: ${id} not found`;
            message.text = text
            messages[id] = message;
            return message;
        },
    },
    // NOTE: Graphql resolver checks for user type to resolve field first,
    // then if not found, will fallback to default resolver of js object key.
    User: {
        username: (user) => user.username,
        messages: user => {
            return Object.values(messages).filter(
                message => message.userId === user.id
            );
        },
    },
    Message: {
        user: ({ userId }) => {
            return users[userId];
        }
    }
}

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
      me: users[1],
  }
});

server.applyMiddleware({ app, path: process.env.ROOT_PATH });

app.listen({ port: process.env.PORT }, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}${process.env.ROOT_PATH}`);
  });
