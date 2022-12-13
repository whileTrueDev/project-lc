/* eslint-disable react/no-danger */
import { ColorModeScript } from '@chakra-ui/react';
import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render(): JSX.Element {
    return (
      <Html lang="ko">
        <Head>
          {/* Google Tag Manager */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PRZT6QL');`,
            }}
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/images/favicon/apple-touch-icon-180x180.png"
          />
          <link
            rel="android-chrome-icon"
            sizes="192x192"
            href="/images/favicon/android-chrome-icon-192x192.png"
          />
          <link
            rel="android-chrome-icon"
            sizes="512x512"
            href="/images/favicon/android-chrome-icon-512x512.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/images/favicon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/images/favicon/favicon-16x16.png"
          />
          <link rel="icon" href="/images/favicon/favicon.ico" />
          {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}

          {/* 네이버 웹마스터 도구 사이트 확인 - kkshow_dev@naver.com */}
          <meta
            name="naver-site-verification"
            content="1b71b20c016704c65fe9a4ffe6815f54103dc3dd"
          />
          {/* 페이스북 메타태크 */}
          <meta
            name="facebook-domain-verification"
            content="318la5nym43i696t6dm6w63sw0cgzb"
          />
        </Head>
        <body>
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              title="google-tag-manager"
              src="https://www.googletagmanager.com/ns.html?id=GTM-PRZT6QL"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>

          <ColorModeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
