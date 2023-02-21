import { getDocs, collection } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import moment from 'moment';
import { UserObject } from '../constants/models';
  
const Leaderboard = () => {
    const [leaderBoard, setLeaderBoard] = useState<UserObject[]>([]);

    useEffect(() => {
        gettingUserInfoFromFullList()
    }, []);

    const gettingUserInfoFromFullList = async () => {
        let tempTokenHolderArray:any = [];    
        getDocs(collection(db, 'members'))
        .then((result) => { 
          result.forEach((doc) => {
            let item = doc.data();
            item.id = doc.id;
            item.totalPoints = item.checkins.length;
            const formingTime = item.created.toDate();
            item.membersince = moment(formingTime).format("MM/DD/YYYY");
            item.lastcheckin = moment(item.checkins[0]).format("MM/DD/YYYY");
            tempTokenHolderArray.push(item);
          });
          tempTokenHolderArray.sort((a: { totalPoints: number; },b: { totalPoints: number; }) => (a.totalPoints < b.totalPoints) ? 1 : ((b.totalPoints < a.totalPoints) ? -1 : 0));
          console.log('tempTokenHolderArray ', tempTokenHolderArray);
          setLeaderBoard(tempTokenHolderArray);
        });
      };

  return (
    <div>
      <h1>Leaderboard</h1>
      {leaderBoard?.slice(0, 20).map((d, i) => (
        <div className="container-lead" key={i}>
            {d.address} - 
            {d.totalPoints} -
            {d.membersince} -
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
