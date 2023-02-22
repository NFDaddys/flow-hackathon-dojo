import { useWeb3Context } from '../flow/web3';
import { setDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import moment from 'moment';
import Qrcodes from "../check-code.json";
import Rewards from "../rewards.json";
import BeltRewards from "../belts.json";
import { UserObject, InitValue, Reward } from "../constants/models";


 const Checkin = () => {
  const { connect, user, executeScript, logout } = useWeb3Context();
  const [dupeCheckin, setdupeCheckin] = useState(false);
  const [successCheckIn, setsuccessCheckIn] = useState(false);
  const [currentSelectedUser, setcurrentSelectedUser] = useState<UserObject>(InitValue);
  const [levelInfo, setLevelInfo] = useState({}); // will use for new reward notification handling

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
  }, [user, executeScript]);

 
  const handleCheckin = () => {
    let dupeCheckIn = false;
    const currentDay = moment().day();
    let valueNeeded = '';
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const qrparam = urlParams.get('qr')
    const testVersion = urlParams.get('test')
    const currentChecks : string[] = currentSelectedUser.checkins;

    if(testVersion) {
      saveTestResults(parseInt(testVersion));
    }
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
        // add additional handling for successful checkin
        setsuccessCheckIn(true);
        // handle rewards
        checkRewardStatus();
      } else {
        // add handling here for QR being incorrect
      }
    } else {
      // add handling for dupe check in handling
    }
    
  }

  const checkRewardStatus = async () => {
    const prevEarnedRewards : Reward[] = currentSelectedUser.rewards !== undefined ? currentSelectedUser.rewards : [];
    let currentRewards : Reward[] = [];   
    let currentLevel = 0;
    console.log('is this undefined? ', currentSelectedUser.rewards);
    if (currentSelectedUser.rewards && currentSelectedUser.rewards.length > 0) {
      // loop through each reward
      Rewards.forEach((item:any) => {
        // if 'checkins.length' >= the reward -- push reward
        if(currentSelectedUser.checkins.length >= item.criteria) {
          // loop through prevSaved rewards
          prevEarnedRewards.forEach((alreadyAwarded) => {
             // see if this item exists..  
            if(alreadyAwarded.name === item.name) {
              // it does.. assign the correct
              item.claimed = alreadyAwarded.claimed;
            }
          })
          currentRewards.push(item);         
        }
        if(currentSelectedUser.checkins.length === item.criteria) {
          setLevelInfo(item)
          // handle level up logic congrats
        }
      });
      
      currentLevel = currentRewards.length;
      updateUser(currentRewards, currentLevel);
    } else {
      // the dont have metadata -- assuming its their first visit
      const currentLevel = 1;
      const defaultlevel: any = Rewards[0];
      console.log('this should be a level ', defaultlevel);
      currentRewards.push(defaultlevel); 
      updateUser(currentRewards, currentLevel);
      // HAWK HAWK HAWK LOOKAT THIS, MIGHT BE BUGGY
    }   
    
  };

  const addUser = async () => {
    setDoc(doc(db, "members", user.addr), {
      address: user.addr,
      created: new Date()
    })
    .then((result) => {
      console.log('we added a user')
    });
  }

  const updateUser = async (rewards?: Reward[], level?: number) => {
    let tempChecks : string[];
    currentSelectedUser.checkins !== undefined ? tempChecks = currentSelectedUser.checkins : tempChecks = [];
    const nowTime = moment().format();
    tempChecks.push(nowTime);
    updateDoc(doc(db, "members", user.addr), {
      rewards: rewards,
      level: level,
      checkins: tempChecks
    })
    .then((result) => {
      console.log('added checkin')
    });
  }

  const saveTestResults = async (testNumber?: number) => {
    let tempTests : any;
    let tempTestRewards : any;
    const levelnum = testNumber !== undefined ? testNumber-1 : 0;
    currentSelectedUser.tests !== undefined ? tempTests = currentSelectedUser.tests : tempTests = [];
    currentSelectedUser.testsRewards !== undefined ? tempTestRewards = currentSelectedUser.testsRewards : tempTestRewards = [];
    const nowTime = moment().format();
    tempTests.push({date: nowTime, test: testNumber});
    tempTestRewards.push(BeltRewards[levelnum]);
    updateDoc(doc(db, "members", user.addr), {
      tests: tempTests,
      testsRewards: tempTestRewards
    })
    .then((result) => {
      console.log('added test results');
      // handle confetti celebrate view
      // show them the badge and where claimable
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
        checkins: tempUserData.checkins,
        totalPoints: tempUserData.checkins.length,
        rewards: tempUserData.rewards,
        tests: tempUserData.tests
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
