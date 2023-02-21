import { useWeb3Context } from '../flow/web3';
import { useRouter } from 'next/router';
import { setDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import moment from 'moment';
import Qrcodes from "../check-code.json";

interface UserObject {
  checkins: [];
  address: string;
  created: string
}
const initValue : UserObject = {
  checkins: [],
  address: '',
  created: ''
}
 const Checkin = () => {
  const router = useRouter();
  const { connect, user, executeScript, logout } = useWeb3Context();
  const [dupeCheckin, setdupeCheckin] = useState(false);
  const [successCheckIn, setsuccessCheckIn] = useState(false);
  const [currentSelectedUser, setcurrentSelectedUser] = useState(initValue);

  useEffect(() => {
    if (!user.loggedIn) return 

    const handleLogIn = async () => {
      try {
        getUser(); 
      } catch (error) {
        console.error(error);
      }
    };

    handleLogIn();
  }, [user, executeScript, router]);

 
  const handleCheckin = () => {
    let dupeCheckIn = false;
    const currentDay = moment().day();
    let valueNeeded = '';
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const qrparam = urlParams.get('qr')
    const currentChecks : string[] = currentSelectedUser.checkins;

    if(currentChecks !== undefined) {
      currentChecks.forEach((item) => {
        // item.formedDate = new Date
        const formedTime = moment(item).format("MMM Do YYYY");
        const formedNowTime = moment().format("MMM Do YYYY");
        if(formedTime === formedNowTime) {
          dupeCheckIn = true;
          setdupeCheckin(true);
        }
      });
    }
    if(!dupeCheckIn) {
      Qrcodes.forEach((item) => {
        if(item.date === currentDay) {
          valueNeeded = item.value;
        };
      });
      if(valueNeeded === qrparam){ 
        setsuccessCheckIn(true);
        updateUser();
        // add additional handling for successful checkin
      } else {
        // add handling here for QR being incorrect
      }
    } else {
      // add handling for dupe check in handling
    }
    
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

  const updateUser = async () => {
    let tempChecks : string[];
    currentSelectedUser.checkins !== undefined ? tempChecks = currentSelectedUser.checkins : tempChecks = [];
    const nowTime = moment().format();
    tempChecks.push(nowTime);
    updateDoc(doc(db, "members", user.addr), {
      checkins: tempChecks
    })
    .then((result) => {
      console.log('added checkin')
    });
  }

  const getUser = async () => {
    let q;
    const docRef = doc(db, "members", user.addr);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const tempUserData = docSnap.data();
      const formedUser :  UserObject = {
        address: tempUserData.address,
        created: tempUserData.created,
        checkins: tempUserData.checkins
      }
      setcurrentSelectedUser(formedUser);
    } else {
      addUser();
    }
  }

  return (
    <div>
      <h1>hello world</h1>
      {!user.loggedIn && <div onClick={connect}>Log-in</div>}
      {user.loggedIn && <div onClick={logout}>Logout</div>}
      {user.loggedIn && !successCheckIn && !dupeCheckin && <div onClick={handleCheckin}>Checkin</div>}
      {dupeCheckin && <div >You already checked in today!</div>}
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
