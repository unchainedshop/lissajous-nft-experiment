import React from 'react';
import App, { Container } from 'next/app';
import Layout from '../components/Layout';
import { AppContextWrapper } from '../components/AppContextWrapper';

// import '../public/static/css/all.css';
// import withApollo from '../modules/apollo/utils/withApollo';

const UnchainedApp = ({ Component, pageProps }) => {
  return (
    <Container>
      <AppContextWrapper>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppContextWrapper>
    </Container>
  );
};

UnchainedApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

// export default withApollo(UnchainedApp);
export default UnchainedApp;
