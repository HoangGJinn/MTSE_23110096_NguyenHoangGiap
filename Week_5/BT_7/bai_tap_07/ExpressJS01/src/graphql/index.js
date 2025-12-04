const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const createApolloServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true, // Cho phép GraphQL Playground trong development
  });
};

const getGraphQLMiddleware = (apolloServer) => {
  return expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      // Lấy token từ header hoặc cookie
      let token = null;
      
      if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
      } else if (req.cookies && req.cookies.access_token) {
        token = req.cookies.access_token;
      }

      return { token };
    }
  });
};

module.exports = {
  createApolloServer,
  getGraphQLMiddleware
};


