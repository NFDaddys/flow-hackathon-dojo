import { useWeb3Context } from '../flow/web3';
import { setDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import router from 'next/router';
import moment from 'moment';
import 'react-toastify/dist/ReactToastify.css';
import Qrcodes from "../check-code.json";
import Rewards from "../rewards.json";
import BeltRewards from "../belts.json";
import { UserObject, InitValue, Reward } from "../constants/models";
import Avatar from '@/components/avatar';
import { truncateWallet } from '@/utils/utils';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Confetti from 'react-confetti'
import { ToastContainer, toast } from 'react-toastify';
import useWindowSize from 'react-use/lib/useWindowSize'

 const Checkin = () => {
  const { width, height } = useWindowSize();
  const { connect, user, executeScript, logout } = useWeb3Context();
  const [dupeCheckin, setdupeCheckin] = useState(false);
  const [successCheckIn, setsuccessCheckIn] = useState(false);
  const [currentSelectedUser, setcurrentSelectedUser] = useState<UserObject>(InitValue);
  const [levelInfo, setLevelInfo] = useState({}); // will use for new reward notification handling
  const [today, settoday] = useState(moment().format("MMM Do YYYY")); // will use for new reward notification handling
  let currentDay = moment().day();

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

 
  const navigteToProfile = () => {
    router.push('/profile');
  }
  const handleCheckin = () => {
    let dupeCheckIn = false;
    
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
          toast.info("Welcome back! We missed you too!", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
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
        toast.success("SUCCESS: You checked in successfully!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
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
    const prevEarnedRewards : Reward[] = currentSelectedUser.rewards !== undefined ? JSON.parse(JSON.stringify(currentSelectedUser.rewards)) : [];
    let currentRewards : Reward[] = [];   
    let currentLevel = 0;
    
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
      console.log('added');
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
      console.log('added');
    });
  }

  const saveTestResults = async (testNumber?: number) => {
    let tempTests : any;
    let tempTestRewards : any;
    
    const levelnum = testNumber !== undefined ? testNumber-1 : 0;
    tempTests = currentSelectedUser.tests !== undefined ? JSON.parse(JSON.stringify(currentSelectedUser.tests)) : [];
    tempTestRewards = currentSelectedUser.testRewards !== undefined ? JSON.parse(JSON.stringify(currentSelectedUser.testRewards)) : [];
    const nowTime = moment().format();
    

    tempTests.push({date: nowTime, test: testNumber});
    tempTestRewards.push(BeltRewards[levelnum]);

    updateDoc(doc(db, "members", user.addr), {
      tests: tempTests,
      testRewards: tempTestRewards
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
        tests: tempUserData.tests,
        metaData: tempUserData.metaData,
        testRewards: tempUserData.testRewards,
      }
      setcurrentSelectedUser(formedUser);
    } else {
      addUser();
    }
  }

  return (
    <>
      {successCheckIn || dupeCheckin && 
        <Confetti
          width={width}
          height={height}
          numberOfPieces={60}
        />
      }
      <div className="flex-holder">
      {!user.loggedIn ? 
      <button className="clicklink blue-but" onClick={connect}>Log-in</button>
      :
        <>
          <div className="profile-header checkpad">
            <div className="profile-avatar">
              <Avatar address={currentSelectedUser.address} avatar={currentSelectedUser.metaData?.avatar} />
            </div>
            {currentSelectedUser.metaData?.userName ?
              <div>
                  <h4>Hey {currentSelectedUser.metaData?.userName}!</h4>
              </div>
            :
              <div>
                <h4>Hey {truncateWallet(currentSelectedUser.address)}</h4>
              </div>
            }
            {!successCheckIn && !dupeCheckin &&  <button className="clicklink blue-but" onClick={handleCheckin}>Check In</button>}
            {dupeCheckin && 
            <div className="centering">
            <div className="success-msg">
              <span >You already checked in today!  - {today}</span>
              
           </div>
            
            <button className="clicklink blue-but" onClick={navigteToProfile}>View Your Profile</button>
            </div>
          }
          {successCheckIn && 
            <>
              <div className="success-msg">
                <span><FontAwesomeIcon icon={faCheck} /> Check In Successful! - {today}</span>
               
                </div>
              
              <button className="clicklink blue-but" onClick={navigteToProfile}>View Your Profile</button>
            </>
          }
          </div>
          {/* {<div onClick={logout}>Logout</div>} */}
          
          
        </>
      }
      
    </div>
    <ToastContainer
      position="top-right"
      autoClose={1500}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      />
    </>
    
  );
};

export default Checkin;
