import { ChangeEvent, useEffect, useState } from 'react';
import { useWeb3Context } from '../flow/web3';
import { db } from '../firebase';
import { getDoc, doc, updateDoc } from "firebase/firestore";
import moment from 'moment';
import Image from 'next/image';
import Rewards from "../rewards.json";
import Avatars from "../avatar.json";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { UserObject, Reward, InitReward, InitValue, MediaMetadata, InitUserMetaData } from "../constants/models";
import Modal from 'react-modal';
import React from "react";
import Avatar from '@/components/avatar';
import ProgressBar from "@ramonak/react-progress-bar";

Modal.setAppElement('#__next');

const Profile = () => {
    const [currentSelectedUser, setcurrentSelectedUser] = useState(InitValue);
    const { connect, user, executeScript } = useWeb3Context();
    const [ userMetaData, setUserMetaData] = useState<MediaMetadata>(InitUserMetaData);
    const [ userMetaDataOriginal, setUserMetaDataOriginal] = useState<MediaMetadata>(InitUserMetaData);
    const [maxLevel, setmaxLevel] = useState(0);
    const [currentBadgeInfo, setcurrentBadgeInfo] = useState<Reward>(InitReward);
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [badgeModalIsOpen, setBadgeModalIsOpen] = React.useState(false);

    const openModal = () => {
      setIsOpen(true);
    }

    const openBadgeModal = (e : any) => {
      setBadgeModalIsOpen(true);
      badgeDetails(e);
    }
  
    const afterOpenModal = () => {
      // references are now sync'd and can be accessed.
      // subtitle.style.color = '#f00';
    }
  
    const closeModal = () => {
      setIsOpen(false);
      setBadgeModalIsOpen(false);
    }

    const saveUser = async () => {
        let clonedUser = JSON.parse(JSON.stringify(currentSelectedUser));
        clonedUser.metaData = userMetaData;
        updateDoc(doc(db, "members", user.addr), {
            metaData: userMetaData
          })
          .then((result) => {
            console.log('updated user profile');
            setcurrentSelectedUser(clonedUser);
            // handle user update status
          });
          closeModal();
    }
    const cancelSave = async () => {
        console.log('save');
        setUserMetaData(userMetaDataOriginal);
        // reset meta data
        closeModal();
    }

    
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
            rewards: tempUserData.rewards,
            metaData: tempUserData.metaData,
            level: tempUserData.level,
            testsRewards: tempUserData.testsRewards,
            tests: tempUserData.tests
          }
          if(tempUserData.metaData !== undefined) {
            setUserMetaData(tempUserData.metaData);
            setUserMetaDataOriginal(tempUserData.metaData);
          }
          // handle level once rewards are set ^^^
          setcurrentSelectedUser(formedUser);
          levelMax(formedUser.level);
        }
      }

      const isDisabled = (e: any) => {
        if (e.criteria > currentSelectedUser?.checkins.length) {
          return true;
        } else {
          if(currentSelectedUser?.tests !== undefined) {
            if(currentSelectedUser?.tests.length < e.tests) {
              return true;
            } else {
              return false;
            }
          } else {
            if(e.tests > 0) {
              return true;
            } else {
              return false;
            }
          }
        }
      }

      const levelMax = (level: any) => {
        Rewards.forEach((reward) => {
          if (reward.level === (level + 1)) {
            setmaxLevel(reward.criteria);
          }
          // setting first level if its missing for some reason
          if (level == null) {
            setmaxLevel(Rewards[1].criteria);
          }
        });
      }

      const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setUserMetaData(values => ({...values, [name]: value}))
      }

    const badgeDetails = (badge: any) => {
        setcurrentBadgeInfo(badge);
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
   
        <div>
            <h1>Profile</h1>
            {user.loggedIn && 
                <div className="open-dia" onClick={() => openModal()}>
                    <p className="edit-button">Edit Profile</p>
                </div>
            }
        </div>
    
      {!user.loggedIn && <div onClick={connect}>Log-in</div>}
      {user.loggedIn && 
      <div>
            {currentSelectedUser.metaData?.userName ?
                <div>
                    <h4>{currentSelectedUser.metaData?.userName}</h4>
                </div>
            :
                <div>
                    <span>Member ID:</span>
                    <span>{currentSelectedUser.address}</span>
                </div>
            }
            <div className="profile-avatar">
                <Avatar address={user.addr} avatar={userMetaData.avatar} />
            </div>
            <ProgressBar className="progress-bar-hawk" completed={currentSelectedUser.checkins.length} customLabel=" " maxCompleted={maxLevel} />
            <div>
                <span>Member Since:</span>
                <span>{currentSelectedUser.membersince}</span>
            </div>
            <div>
                <span>Bio:</span>
                <span>{currentSelectedUser.metaData?.bio}</span>
            </div>
            <div>
                <span>Twitter:</span>
                <span>{currentSelectedUser.metaData?.twitter}</span>
            </div>
            <div>
                <span>Belt Level:</span>
                <span>{currentSelectedUser.level}</span>
            </div>
            <div>
                <span>Total Checkins:</span>
                <span>{currentSelectedUser.totalPoints}</span>
            </div>
            <div>
                <span>Last Checkin:</span>
                <span>{currentSelectedUser.lastcheckin}</span>
            </div>
            {currentSelectedUser.testsRewards && currentSelectedUser.testsRewards?.length > 0  && 
              <div>
                <span>Belts Earned:</span>
                {currentSelectedUser.testsRewards?.map((e: any, j) => (
                    <div className="badge" key={j}>
                        <div className="open-dia" onClick={() => openBadgeModal(e)}>
                        <div className={'newbadge ' + e.icon}></div>
                        </div>
                    </div>
                ))}
            </div>
            }
            
            <div>
                <span>Badges Earned:</span>
                {currentSelectedUser.rewards?.map((e: any, j) => (
                    <div className="badge" key={j}>
                        <div className="open-dia" onClick={() => openBadgeModal(e)}>
                        <div className={'newbadge ' + e.icon}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        }
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          className="refix"
          contentLabel="Welcome"
        >
              <h3 className="claimh">Modify Profile</h3>
              <Button className="closebtn" onClick={closeModal}>
                <FontAwesomeIcon icon={faClose} />
              </Button>
              <div className="containment">
                <Form>
                    <FormGroup>
                        <Label for="userName">User Name:</Label>
                        <Input type="text" name="userName" id="userName" 
                            value={userMetaData.userName || ""}
                            onChange={(e) => {handleChange(e)}}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="email">Email:</Label>
                        <Input type="email" name="email" id="email" 
                         value={userMetaData.email || ""}
                         onChange={(e) => {handleChange(e)}}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="email">Twitter:</Label>
                        <Input type="text" name="twitter" id="twitter" 
                         value={userMetaData.twitter || ""}
                         placeholder="@TwitterName"
                         onChange={(e) => {handleChange(e)}}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="bio">Bio:</Label>
                        <Input type="textarea" name="bio" id="bio"
                        value={userMetaData.bio || ""}
                        onChange={(e) => {handleChange(e)}}
                        />
                    </FormGroup>
                    <FormGroup tag="fieldset">
                      <h4 className="avatartitle">Avatar:</h4>
                        <div className="avatar-selector">
                            <div className="avatar-list">
                            {Avatars.map((e: any, j) => (
                              <FormGroup check key={j+e.type}>
                                <Label check>
                                <Input
                                  name="avatar"
                                  disabled={isDisabled(e)}
                                  type="radio"
                                  value={e.type}
                                  checked={userMetaData.avatar === e.type}
                                  onChange={(e) => {handleChange(e)}}
                                />{' '}
                                  {e.criteria > currentSelectedUser?.checkins.length ? 
                                    <span><FontAwesomeIcon icon={faUnlock} /> at {e.criteria} Checkins</span>
                                  :
                                    currentSelectedUser?.tests !== undefined ?
                                      // user has test
                                      e.tests > currentSelectedUser?.tests?.length ?
                                        <span><FontAwesomeIcon icon={faUnlock} /> at Level {e.tests}</span>
                                      :
                                        <span>{e.type}</span>
                                    :
                                      e.tests > 0 ? 
                                      <span><FontAwesomeIcon icon={faUnlock} /> at Level {e.tests}</span>
                                      :
                                        <span>{e.type}</span>
                                        //user has no tests results

                                  
                                  
                                      



                                  }
                                </Label>
                            </FormGroup>
                            ))}                            
                            </div>
                            <div className="avatar-image-container">
                                <Avatar address={user.addr} avatar={userMetaData.avatar} />
                                <span className="preview-image">PREVIEW:</span>
                            </div>
                        </div>
                    
                    </FormGroup>
                </Form>
                <Button className="clicklink linker" onClick={() => saveUser()}>SAVE</Button>
                <Button className="clicklink linker greygoose" onClick={() => cancelSave()}>CANCEL</Button>
              </div>
            
            </Modal>
            <Modal
              isOpen={badgeModalIsOpen}
              onAfterOpen={afterOpenModal}
              onRequestClose={closeModal}
              className="refix"
              contentLabel="Welcome"
            >
              <h3 className="claimh claimg">Badge Details</h3>
              <Button className="closebtn" onClick={closeModal}>
                <FontAwesomeIcon icon={faClose} />
              </Button>
              <div className="containment">
               <div className="badge-content">
                  <div className="imgholdy">
                    <div className={'leader-rank newbadge newbig ' + currentBadgeInfo.icon}></div>
                  </div>
                  { currentBadgeInfo.level && currentBadgeInfo.level > 0 && 
                  <div className="holdertarsky modslvl">
                    <span >Level {currentBadgeInfo.level} Reward</span>
                  </div>
                  }
                  <div className="holdertarsky">
                    <span className="lab">Reward Name:</span>
                    {currentBadgeInfo.name}
                  </div>                 
                
                  <div className="holdertarsky">
                    <span className="lab">Reward Earned:</span>
                    {currentBadgeInfo.reward}
                  </div>

                  {currentBadgeInfo.pointTotal &&
                    <div className="holdertarsky">
                      <span className="lab">Total Points Earned:</span>
                      {currentBadgeInfo.pointTotal}
                    </div>
                  }
                  {currentBadgeInfo.claimed &&
                    <div className="status-rew claimed">CLAIMED</div> 
                  }
                  {!currentBadgeInfo.claimed &&
                    <div className="status-rew activer">REDEEMABLE</div>
                  }
               </div>
              </div>
            
            </Modal>
    </div>
  );
};

export default Profile;
