// import { Button } from 'components/';
import ROUTES from '../constants/routes';
import { useWeb3Context } from '../flow/web3';
// import { ActionPanel, NavPanel, PageContainer, PageContent } from 'layout';
import { useRouter } from 'next/router';
import { collection, getDocs, addDoc, setDoc, getDoc, doc, updateDoc, where, startAfter, limit, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { db } from '../firebase';

const Checkin = () => {
  const router = useRouter();
  const { connect, user, executeScript, logout } = useWeb3Context();
  const [successCheckIn, setsuccessCheckIn] = useState(false);

  useEffect(() => {
    if (!user.loggedIn) return

    const handleLogIn = async () => {
      try {
        console.log('user ', user);
        getUser();
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

 
  const handleCheckin = () => {
    console.log('we are checking in');
    setsuccessCheckIn(true);
  }

  const addUser = async () => {
    setDoc(doc(db, "members", user.addr), {
      address: user.addr,
      created: new Date()
    })
    .then((result) => {
      console.log('we added a user')
    });
  }

  const getUser = async () => {
    let q;
    const docRef = doc(db, "members", user.addr);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const tempUserData = docSnap.data();
      console.log('yooooo', tempUserData);
    } else {
      // need to add here
      addUser();
    }
  }

  return (
    <div>
      <h1>hello world</h1>
      {!user.loggedIn && <div onClick={connect}>Log-in</div>}
      {user.loggedIn && <div onClick={logout}>Logout</div>}
      {user.loggedIn && !successCheckIn && <div onClick={handleCheckin}>Checkin</div>}
      {user.loggedIn && successCheckIn && <div >Success!</div>}
      {user.loggedIn &&
        <div>
         Address: {user.addr}
        </div>
      }
    </div>
  );
};

export default Checkin;
