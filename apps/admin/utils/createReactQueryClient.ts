import { QueryClient } from 'react-query';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
  });

export default createQueryClient;
