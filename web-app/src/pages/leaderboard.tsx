import { getDocs, collection } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import moment from 'moment';
import Avatar from '@/components/avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'reactstrap';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { UserObject, InitValue } from "../constants/models";
import Modal from 'react-modal';
import React from "react";
import {truncateWallet} from '../utils/utils'

Modal.setAppElement('#__next');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
  
const Leaderboard = () => {
    const [leaderBoard, setLeaderBoard] = useState<UserObject[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserObject>(InitValue);
    const [modalIsOpen, setIsOpen] = React.useState(false);
    let subtitle : any;

    const openModal = (d: any) => {
      setSelectedUser(d);
      setIsOpen(true);
    }
  
    const afterOpenModal = () => {
      // references are now sync'd and can be accessed.
      // subtitle.style.color = '#f00';
    }
  
    const closeModal = () => {
      setIsOpen(false);
    }

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
            item.totalPoints = item.checkins != undefined ? item.checkins.length : 0;
            const formingTime = item.created.toDate();
            item.membersince = moment(formingTime).format("MM/DD/YYYY");
            item.lastcheckin = item.checkins != undefined ? moment(item.checkins[0]).format("MM/DD/YYYY") : '';
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
        <div className="open-dia" key={i} onClick={() => openModal(d)}>
        {/* <div className="open-dia" key={i} onClick={() => setSelectedUser(d)}> */}
          <div className="container-lead" >
            <div className="profile-avatar">
              <Avatar address={d.address} avatar={d.metaData?.avatar} />
            </div>
            {d.metaData?.userName ?
                  <div>
                      <h4>{d.metaData?.userName}</h4>
                  </div>
              :
                  <div>
                      <h4>{truncateWallet(d.address)}</h4>
                  </div>
              }
              <div>
                <span>Total Points:</span>
                {d.totalPoints}
              </div>
              <div>
                <span>Member Since:</span>
                {d.membersince}
                </div>
          </div>
        </div>
      ))}

    <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        className="refix"
        contentLabel="Welcome"
      >
      <div className="flexholder">
        <div className="gravhold">
          <div className="avatar-image-container">
            <Avatar address={selectedUser?.address} avatar={selectedUser?.metaData?.avatar} />
          </div>
            <div className="leader-level levler">
              <span className="level-lev">Level:</span>
              <span>{selectedUser?.level}</span>
              {!selectedUser.level &&<span>1</span>}
            </div>
        </div>
        {selectedUser.metaData?.userName ?
            <div>
                <h4>{selectedUser.metaData?.userName}</h4>
            </div>
        :
            <div>
                <h4>{truncateWallet(selectedUser.address)}</h4>
            </div>
        }
      </div>
      

      <Button className="closebtn" onClick={closeModal}>
        <FontAwesomeIcon icon={faClose} />
      </Button>
      <div className="containment">
        <div className="childtarsky">
          <div className="rizzow">
            <p className="p-tag minus-bot memsince">Member Since <br /><strong>{selectedUser?.membersince}</strong></p>
            <p className="p-tag minus-bot plus lastdance">Last Checkin <br /><strong>{selectedUser?.lastcheckin}</strong></p>
          </div>
          <div className="rizzow">
            
            
            <div className="point-holder">
            <span className="value">{selectedUser.checkins.length > 0 ? selectedUser.totalPoints : 0}</span>
            <span className="label">Points</span>
          </div>
          </div>
          
          
          
          
          {/* <ProgressBar className="progress-bar-hawk" completed={tempUserDataCheckins.length} customLabel=" " maxCompleted={maxLevel} />
          <p className="progress-line">{maxLevel - selectedUser.metaData.checkins.length} more points needed for Level {selectedUser?.level ? selectedUser?.level + 1 : 2}</p> */}
          <div className="stat-holders">
            <p className="p-tag">Checkins <br /> <strong>{selectedUser?.checkins.length}</strong></p>
            <p className="p-tag bordera">Level <br /> <strong>{selectedUser?.level ? selectedUser?.level : 1}</strong></p>
            <p className="p-tag">Rewards <br /><strong>{selectedUser?.rewards?.length}</strong></p>
          </div>
        </div>
      </div>
    
      </Modal>
    </div>
  );
};

export default Leaderboard;
