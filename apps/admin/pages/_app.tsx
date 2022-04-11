import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from '@material-ui/core';
import {
  createChakraTheme,
  createMuiTheme,
  createQueryClient,
} from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import kolocale from 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

dayjs.locale(kolocale);
dayjs.extend(relativeTime);
const queryClient = createQueryClient();
const chakraTheme = createChakraTheme();
const muiTheme = createMuiTheme();
function CustomApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <title>크크쇼 관리자</title>
      </Head>
      <div className="app">
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={chakraTheme}>
            <ThemeProvider theme={muiTheme}>
              <main>
                <Component {...pageProps} />
              </main>
            </ThemeProvider>
          </ChakraProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </div>
    </>
  );
}

export default CustomApp;
