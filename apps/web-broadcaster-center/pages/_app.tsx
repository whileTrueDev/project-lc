import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from '@material-ui/core';
import { lightBigLogoUrl, lightLogoUrl } from '@project-lc/components';
import { createChakraTheme, createMuiTheme, createQueryClient } from '@project-lc/utils';
import { DefaultSeo } from 'next-seo';
import { AppProps } from 'next/app';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = createQueryClient();
const chakraTheme = createChakraTheme();
const muiTheme = createMuiTheme();

function CustomApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <DefaultSeo
        title="크크쇼 방송인센터"
        description="라이브 커머스 전문 크크쇼 방송인 센터"
        openGraph={{
          type: 'website',
          locale: 'ko_KR',
          // url: 'https://방송인.크크쇼.com/', // route53 등록 후 설정
          site_name: '크크쇼 방송인센터',
          images: [
            { url: lightLogoUrl, alt: 'KKSHOW' },
            { url: lightBigLogoUrl, alt: 'KKSHOW' },
          ],
        }}
      />

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
