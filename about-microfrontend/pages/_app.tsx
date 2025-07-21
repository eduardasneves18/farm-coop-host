import App, { AppContext, AppProps } from 'next/app';

function AboutApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

AboutApp.getInitialProps = async (ctx: AppContext) => {
  const appProps = await App.getInitialProps(ctx);
  return { ...appProps };
};

export default AboutApp;
