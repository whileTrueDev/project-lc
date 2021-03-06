import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from '@material-ui/core';
import {
  lightBigLogo,
  lightLogo,
  LOGO_S3_PREFIX,
} from '@project-lc/components-shared/KksLogo';
import {
  createChakraTheme,
  createMuiTheme,
  createQueryClient,
} from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import kolocale from 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import { DefaultSeo } from 'next-seo';
import { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import '../styles/global.font.css';
import '../styles/global.override.css';

dayjs.extend(relativeTime);
dayjs.locale(kolocale);
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
          url: 'https://xn--vh3b23hfsf.xn--hp4b17xa.com/',
          site_name: '크크쇼 방송인센터',
          images: [
            { url: LOGO_S3_PREFIX + lightLogo, alt: 'KKSHOW' },
            { url: LOGO_S3_PREFIX + lightBigLogo, alt: 'KKSHOW' },
          ],
        }}
      />

      <div className="app">
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={chakraTheme}>
            <ThemeProvider theme={muiTheme}>
              <main>
                <NextNProgress options={{ showSpinner: false }} />
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
