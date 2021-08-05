import { ChakraProvider, theme } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import Head from 'next/head';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>PROJECT_LC</title>
      </Head>
      <div className="app">
        <ChakraProvider theme={theme}>
          <main>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Component {...pageProps} />
          </main>
        </ChakraProvider>
      </div>
    </>
  );
}

export default CustomApp;
