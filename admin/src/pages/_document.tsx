import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from 'styled-components';


class MyDocument extends Document {
  static async  getInitialProps(ctx) {
      const sheet = new ServerStyleSheet();
      const originalRenderPage = ctx.renderPage;

      try {
        ctx.renderPage = () =>
          originalRenderPage({
            enhanceApp: (App) => (props) =>
              sheet.collectStyles(<App {...props} />),
          });

        const initialProps = await Document.getInitialProps(ctx);
        return {
          ...initialProps,
          styles: (
            <>
              {initialProps.styles}
              {sheet.getStyleElement()}
            </>
          ),
        };
      } finally {
        sheet.seal();
      }
  }
  /* const initialProps = await Document.getInitialProps(ctx);
  return { ...initialProps }; */
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/public/gl-nav-icon.png" />
          <link
            href="https://kit-pro.fontawesome.com/releases/v5.13.0/css/pro.min.css"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
          <link href="/assets/css/elegant-icon.css" rel="stylesheet" />
          <link href="/assets/css/icomoon-icon.css" rel="stylesheet" />
        </Head>
        <body>
          <Main/>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
