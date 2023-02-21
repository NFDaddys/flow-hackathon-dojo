// import { Button } from 'components/';
import ROUTES from '../constants/routes';
import { useWeb3Context } from '../flow/web3';
// import { ActionPanel, NavPanel, PageContainer, PageContent } from 'layout';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styles from 'styles/HomePage.module.css';

const Scan = () => {
  const router = useRouter();

  const goCheckIn = () => {
    router.push(ROUTES.CHECKIN);
  }

  return (
    <div>
      <h1>QR HOLDER Page</h1>
      <div>app description</div>
      <div onClick={goCheckIn}>Scan</div>
    </div>
  );
};

export default Scan;
