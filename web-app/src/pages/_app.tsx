import type { AppProps } from 'next/app';
import { Web3ContextProvider } from '../flow/web3';
import '../styles/bootstrap.min.css';
import Navigation from '../components/nav'
import Footer from '../components/footer'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Web3ContextProvider>
      <Navigation />
      <Component {...pageProps} />
      <Footer />
    </Web3ContextProvider>
  );
};

export default App;
