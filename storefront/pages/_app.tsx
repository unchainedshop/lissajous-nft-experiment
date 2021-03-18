import React from 'react';
import App from 'next/app';
import Layout from '../components/Layout';
import { AppContextWrapper } from '../components/AppContextWrapper';

import '../public/static/font/stylesheet.css';

const UnchainedApp = ({ Component, pageProps }) => {
  return (
    <AppContextWrapper>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContextWrapper>
  );
};

UnchainedApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

// export default withApollo(UnchainedApp);
export default UnchainedApp;
