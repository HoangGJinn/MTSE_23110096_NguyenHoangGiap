import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'}/graphql`,
  credentials: 'include', // Cho phép gửi cookies
});

const authLink = setContext((_, { headers }) => {
  // Lấy token từ localStorage
  const token = localStorage.getItem('access_token');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first', // Ưu tiên cache
      nextFetchPolicy: 'cache-first', // Sau lần đầu, luôn dùng cache
    },
  },
});

export default apolloClient;



