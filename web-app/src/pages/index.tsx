// import { Button } from 'components/';
import ROUTES from '../constants/routes';
import { useWeb3Context } from '../flow/web3';
// import { ActionPanel, NavPanel, PageContainer, PageContent } from 'layout';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styles from 'styles/HomePage.module.css';

const Home = () => {
  const router = useRouter();
  const { connect, user, executeScript, logout } = useWeb3Context();

  useEffect(() => {
    if (!user.loggedIn) return;

    const handleLogIn = async () => {
      try {
        console.log('user ', user);
        // handle new users
        // check to see if they are a current user
        // if so handle and display
        // else create a user and start cooking
      } catch (error) {
        console.error(error);
      }
    };

    handleLogIn();
  }, [user, executeScript, router]);

  return (
    <div>
      <h1>hello world</h1>
      <div onClick={connect}>connect wallet</div>
      <div onClick={logout}>Logout</div>
    </div>
  );
};

export default Home;