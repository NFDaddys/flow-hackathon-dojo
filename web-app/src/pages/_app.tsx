import type { AppProps } from 'next/app';
import { Web3ContextProvider } from '../flow/web3';
import '../styles/bootstrap.min.css';
import Navigation from '../components/nav'
import Footer from '../components/footer'
// import router from 'next/router';
import { useRouter } from 'next/router';
import '../styles/main.css';


const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  console.log(router.pathname);

  return (
    <Web3ContextProvider>
      {router.pathname !== '/scan' ?
        <>
          <Navigation />
          <Component {...pageProps} />
          <Footer />
        </>
       :
        <Component {...pageProps} />
      }
    </Web3ContextProvider>
  );
};

export default App;
