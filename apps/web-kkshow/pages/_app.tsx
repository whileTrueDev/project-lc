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
import { ErrorBoundary } from '@project-lc/components-web-kkshow/ErrorBoundary';
import dayjs from 'dayjs';
import kolocale from 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import { DefaultSeo } from 'next-seo';
import { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import { useState } from 'react';
import { Hydrate, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import 'swiper/css/bundle';
import '../styles/global.font.css';
import '../styles/global.input.css';
import '../styles/swiper.override.css';

dayjs.extend(relativeTime);
dayjs.locale(kolocale);
const queryClient = createQueryClient();
const chakraTheme = createChakraTheme();
const muiTheme = createMuiTheme();

function CustomApp({ Component, pageProps }: AppProps): JSX.Element {
  const [_queryClient] = useState(queryClient);
  return (
    <>
      <DefaultSeo
        title="크크쇼"
        description="라이브 커머스"
        openGraph={{
          type: 'website',
          locale: 'ko_KR',
          url: 'https://xn--hp4b17xa.com/',
          site_name: '크크쇼',
          images: [
            { url: LOGO_S3_PREFIX + lightLogo, alt: 'KKSHOW' },
            { url: LOGO_S3_PREFIX + lightBigLogo, alt: 'KKSHOW' },
          ],
        }}
      />

      <div className="app">
        <QueryClientProvider client={_queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <ChakraProvider theme={chakraTheme}>
              <ThemeProvider theme={muiTheme}>
                <main>
                  <NextNProgress options={{ showSpinner: false }} />
                  <ErrorBoundary>
                    <Component {...pageProps} />
                  </ErrorBoundary>
                </main>
              </ThemeProvider>
            </ChakraProvider>
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          </Hydrate>
        </QueryClientProvider>
      </div>
    </>
  );
}

export default CustomApp;
