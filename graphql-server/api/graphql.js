// graphql-server/api/graphql.js
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const express = require('express');
const http = require('http');
const cors = require('cors');
const { json } = require('body-parser');

// Import your schema and resolvers
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();
const httpServer = http.createServer(app);

// Enable CORS for Vercel
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://alx-project-nexus-lsbe.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true
}));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

async function startServer() {
  await server.start();
  
  app.use(
    '/graphql',
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Get the user token from the headers
        const token = req.headers.authorization || '';
        
        // Try to retrieve a user with the token
        const user = await getUser(token);
        
        // Add the user to the context
        return { user };
      },
    }),
  );
  
  // Modified for Vercel Serverless
  module.exports = app;
}

startServer();