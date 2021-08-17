import { ChakraProvider, theme } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>PROJECT_LC</title>
      </Head>
      <div className="app">
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <main>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <Component {...pageProps} />
            </main>
          </ChakraProvider>
        </QueryClientProvider>
      </div>
    </>
  );
}

export default CustomApp;
