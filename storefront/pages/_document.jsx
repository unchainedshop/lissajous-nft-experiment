import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class UnchainedDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <noscript
          // eslint-disable-next-line
          dangerouslySetInnerHTML={{
            __html: `
<!--

 _____ _____ _____ _____ _____ _____ _____ _____ ____
|  |  |   | |     |  |  |  _  |     |   | |   __|    \\
|  |  | | | |   --|     |     |-   -| | | |   __|  |  |
|_____|_|___|_____|__|__|__|__|_____|_|___|_____|____/


- Technology & Engineering by Unchained Commerce GmbH - https://unchained.shop

-->

  `,
          }}
        />
        <title>
          Lissajous.art NFT - One of the first of its kind Ethereum native
          generative geometric art experiment
        </title>
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/static/img/icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/img/icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/img/icon.png"
          />
          <link rel="shortcut icon" href="/static/img/icon.png" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@lissajous_art" />
          <meta name="twitter:creator" content="@lissajous_art" />
          <meta
            name="twitter:title"
            content="Ethereum Native
            Generative Geometric Art Experiment"
          />
          <meta
            name="twitter:description"
            content="Become an active part of this First of its kind Ethereum Native
            Generative Geometric Art Experiment!"
          />
          <meta
            name="twitter:image"
            content="https://lissajous.io/static/img/banner.png"
          ></meta>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default UnchainedDocument;
