import { useEffect, useState } from 'react';
import { useWeb3Context } from '../flow/web3';
import { db } from '../firebase';
import { getDoc, doc } from "firebase/firestore";
import moment from 'moment';
import { UserObject, InitValue } from "../constants/models";
  
const Profile = () => {
    const [currentSelectedUser, setcurrentSelectedUser] = useState(InitValue);
    const { connect, user, executeScript } = useWeb3Context();

    const getUser = async () => {
        let q;
        const docRef = doc(db, "members", user.addr);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const tempUserData = docSnap.data();
          const formingTime = tempUserData.created.toDate();
          const memSince = moment(formingTime).format("MM/DD/YYYY");
          const lastCheckin = moment(tempUserData.checkins[0]).format("MM/DD/YYYY")
          const formedUser :  UserObject = {
            address: tempUserData.address,
            created: tempUserData.created,
            checkins: tempUserData.checkins,
            membersince: memSince,
            lastcheckin: lastCheckin,
            totalPoints: tempUserData.checkins.length,
            rewards: tempUserData.rewards
          }
          // handle level once rewards are set ^^^
          setcurrentSelectedUser(formedUser);
        }
      }

    useEffect(() => {
        if (!user.loggedIn) {
            // handle you need to log in
        } else {
            getUser();
        }
    }, [user, executeScript]);

  return (
    <div>
      <h1>Profile</h1>
      {!user.loggedIn && <div onClick={connect}>Log-in</div>}
      {user.loggedIn && 
      <div>
            <div>
                <span>Member ID:</span>
                <span>{currentSelectedUser.address}</span>
            </div>
            <div>
                <span>Member Since:</span>
                <span>{currentSelectedUser.membersince}</span>
            </div>
            <div>
                <span>Total Points:</span>
                <span>{currentSelectedUser.totalPoints}</span>
            </div>
            <div>
                <span>Last Checkin:</span>
                <span>{currentSelectedUser.lastcheckin}</span>
            </div>
            <div>
            <span>Rewards Earned:</span>
            {currentSelectedUser.rewards?.map((d, i) => (
              <div key={i}>
                 <div>{i+1}</div>
                 {/* <div>{d.name}</div> */}
              </div>
            ))}
            </div>
        </div>
        }
    </div>
  );
};

export default Profile;
