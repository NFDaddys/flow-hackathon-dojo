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
      <h1 className="title-header">Leaderboard</h1>
      {leaderBoard?.slice(0, 20).map((d, i) => (
        <div className="open-dia" key={i} onClick={() => openModal(d)}>
        {/* <div className="open-dia" key={i} onClick={() => setSelectedUser(d)}> */}
          <div className="container-lead" >
            <div className="profile-avatar leado">
              <Avatar address={d.address} avatar={d.metaData?.avatar} />
            </div>
            {d.metaData?.userName ?
                  <div className="middle-item">
                      <h4 className="usernam">{d.metaData?.userName}</h4>
                      <span className="levelsub">Level {d.level}</span>
                  </div>
              :
                  <div className="middle-item">
                    <h4 className="usernam">{truncateWallet(d.address)}</h4>
                    <span className="levelsub">Level {d.level}</span>
                  </div>
              }
              <div className="ldr-points">
                <span className="pointtot tard">{d.totalPoints}</span>
                <span className="pointlab labp">Points</span>
              </div>
          </div>
        </div>
      ))}

    <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        className="refix cf"
        contentLabel="Welcome"
      >
      <div className="flexholder">
        <div className="gravhold">
          <div className="avatar-image-container lg-height">
            <Avatar address={selectedUser?.address} avatar={selectedUser?.metaData?.avatar} />
          </div>
        </div>
        {selectedUser.metaData?.userName ?
            <div>
                <h4 className="modname">{selectedUser.metaData?.userName}</h4>
            </div>
        :
            <div>
                <h4 className="modname">{truncateWallet(selectedUser.address)}</h4>
            </div>
        }
        <div className="leader-level levler">
          <span className="level-lev">Level</span>
          <span>{' '+ selectedUser?.level}</span>
          {!selectedUser.level &&<span>1</span>}
        </div>
        <div className="ldr-points propoints ldrpua">
          <span className="pointtot">{selectedUser.totalPoints}</span>
          <span className="pointlab">Points</span>
        </div>
      

      <Button className="closebtn" onClick={closeModal}>
        <FontAwesomeIcon icon={faClose} />
      </Button>
      <div className="containment">
        <div className="childtarsky">
          <div className="rizzow">
            <p className="p-tag minus-bot memsince">Member Since <br /><strong className="lastdate">{selectedUser?.membersince}</strong></p>
            <p className="p-tag minus-bot plus lastdance">Last Checkin <br /><strong className="lastdate">{selectedUser?.lastcheckin}</strong></p>
          </div>
          
          </div>

        </div>
      </div>
    
      </Modal>
    </div>
  );
};

export default Leaderboard;
