import { ChangeEvent, useEffect, useState } from 'react';
import { useWeb3Context } from '../flow/web3';
import { db } from '../firebase';
import { getDoc, doc, updateDoc } from "firebase/firestore";
import moment from 'moment';
import Rewards from "../rewards.json";
import Avatars from "../avatar.json";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faUnlock, faPencil } from '@fortawesome/free-solid-svg-icons';
import { UserObject, Reward, InitReward, InitValue, MediaMetadata, InitUserMetaData } from "../constants/models";
import Modal from 'react-modal';
import React from "react";
import Avatar from '@/components/avatar';
import ProgressBar from "@ramonak/react-progress-bar";
import getTotalSupply from '../cadence/scripts/getTotalSupply';
import mintDojoNFT from '../cadence/transactions/mintDojoNFT';
import initializeAccount from '../cadence/transactions/initializeAccount';
import * as fcl from "@onflow/fcl";
import { TxnStatus } from '@/utils/utils';
import {
  TwitterShareButton,
  TwitterIcon
} from "react-share";

Modal.setAppElement('#__next');

const Profile = () => {
    const [currentSelectedUser, setcurrentSelectedUser] = useState(InitValue);
    const { executeTransaction, connect, user, executeScript } = useWeb3Context();
    const [ userMetaData, setUserMetaData] = useState<MediaMetadata>(InitUserMetaData);
    const [ userMetaDataOriginal, setUserMetaDataOriginal] = useState<MediaMetadata>(InitUserMetaData);
    const [maxLevel, setmaxLevel] = useState(0);
    const [currentBadgeInfo, setcurrentBadgeInfo] = useState<Reward>(InitReward);
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [badgeModalIsOpen, setBadgeModalIsOpen] = React.useState(false);
    const [earnedWhat, setearnedWhat] = React.useState('Badge');
    const beltPrice = '0.0';

    const [signerAccount, setSignerAccount] = useState<any>({});
    const [isMintInProgress, setIsMintInProgress] = useState<boolean>(false);
    const [txId, setTxId] = useState('');
    const [txStatus, setTxStatus] = useState<TxnStatus>();
  
    
    const openModal = () => {
      setIsOpen(true);
    }

    const openBadgeModal = (e : any) => {
      setearnedWhat('Belt')
      setBadgeModalIsOpen(true);
      badgeDetails(e);
    }

    const openBadgeModalDef = (e : any) => {
      setearnedWhat('Badge')
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
            testRewards: tempUserData.testRewards,
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
    

    // Subscribe to tx returned from /api/signAsMinter
    useEffect(() => {
      if (txId) {
        fcl.tx(txId).subscribe(setTxStatus);
      }
    }, [txId]);

  const sendQuery = async () => {
    const res: any = await executeScript(
      getTotalSupply,
    );
    console.log('total supply res ', res);
  }

  const handleInit = async () => {
    await executeTransaction(initializeAccount, () => [], {
      limit: 9999,
    });
  };

  // const handleAnything = async () => {
  //   await executeTransaction(mintDojoNFT, (arg: any, t: any) => [
  //     arg(user.addr, t.Address),
  //     arg(currentBadgeInfo.title, t.String),
  //     arg(currentBadgeInfo.reward, t.String),
  //     arg('test-Silver', t.String),
  //   ], {
  //     authorizations: [fcl.authz]
  //   });
  // };

 
  const handleClickMint = async () => {
    // console.log('signerAccount ', signerAccount);
    console.log('fcl.authz  ', fcl.authz);
    console.log('user.addr ', fcl.currentUser);
    console.log('currentBadgeInfo.title ', currentBadgeInfo.title);
    console.log('currentBadgeInfo.reward ', currentBadgeInfo.reward);
      setIsMintInProgress(true);
      try {
        const txId = await fcl.mutate({
          cadence: mintDojoNFT,
          args: (arg: any, t: any) => [
            arg(user.addr, t.Address),
            arg(currentBadgeInfo.title, t.String),
            arg(currentBadgeInfo.reward, t.String),
            arg('https://valorpds.nfdaddys.tech/belt.png', t.String),
          ],
          proposer: fcl.authz,
          payer: fcl.authz,
          authorizations:[fcl.authz]
          // authorizations: [fcl.currentUser]
        });
  
        setTxId(txId);
        console.log('we made it through');
      } catch (error) {
        console.error(error);
  
        setIsMintInProgress(false);
      }
    };

  return (
    <div className="flex-holder">
      <h1 className="title-header">Profile</h1>
   {!user.loggedIn ? 
      <button className="clicklink blue-but" onClick={connect}>Log-in</button>
      :
      <div className="profile-header">
        {user.loggedIn && 
      <div className="profile-subhead">
            <div className="profile-avatar">
                <Avatar address={user.addr} avatar={userMetaData.avatar} />
            </div>
            <div className="open-dia edify" onClick={() => openModal()}>
                <p className="edit-button"><FontAwesomeIcon icon={faPencil} className="pencil" /> Edit </p>
            </div>
            {currentSelectedUser.metaData?.userName ?
                <div>
                    <h4 className="pro-name">{currentSelectedUser.metaData?.userName}</h4>
                </div>
            :
                <div>
                  <h4 className="pro-name">{currentSelectedUser.address}</h4>
                </div>
            }
            <div className='levelpro'>
                <span>Level</span>
                <span>{' ' + currentSelectedUser.level}</span>
            </div>
            <div className="ldr-points propoints">
              <span className="pointtot">{currentSelectedUser.totalPoints}</span>
              <span className="pointlab">Points</span>
            </div>
            <ProgressBar className="progress-bar-hawk" completed={currentSelectedUser.checkins.length} customLabel=" " maxCompleted={maxLevel} />
            {/* <div>
                <span>Twitter:</span>
                <span>{currentSelectedUser.metaData?.twitter}</span>
            </div> */}
            <div className="date-holding">
                <div className="inv-date">
                    <span className="date-labels">Last Checkin:</span>
                    <span className="date-date">{currentSelectedUser.lastcheckin}</span>
                </div>
                <div className="inv-date">
                  <span className="date-labels">Member Since:</span>
                  <span className="date-date">{currentSelectedUser.membersince}</span>
              </div>
            </div>
            
            {currentSelectedUser.testRewards && currentSelectedUser.testRewards?.length > 0  && 
              <div className="belts-earned">
                <span>Belts Earned:</span>
                <div className="belt-listing">
                  {currentSelectedUser.testRewards?.map((e: any, j) => (
                      <div className="badge" key={j}>
                          <div className="open-dia badge-shade" onClick={() => openBadgeModal(e)}>
                          <div className={'newbadge ' + e.icon}></div>
                          </div>
                      </div>
                  ))}
                </div>
            </div>
            }
            
            <div className="belts-earned beltin">
                <span>Badges Earned:</span>
                <div className="belt-listing">
                  {currentSelectedUser.rewards?.map((e: any, j) => (
                      <div className="badge" key={j}>
                          <div className="open-dia badge-shade" onClick={() => openBadgeModalDef(e)}>
                          <div className={'newbadge ' + e.icon}></div>
                          </div>
                      </div>
                  ))}
                </div>
            </div>
        </div>
        }
      </div>
    }     
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          className="refix cfs"
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
          className="refix cf"
          contentLabel="Welcome"
        >
          <Button className="closebtn" onClick={closeModal}>
            <FontAwesomeIcon icon={faClose} />
          </Button>
          <div className="containment">
            <div className="badge-content">
              <div className="imgholdy">
                <div className={'leader-rank newbadge newbig ' + currentBadgeInfo.icon}></div>
              </div>
              <div className="holdertarsky modslvl">
                {currentBadgeInfo.name}
              </div> 
              { currentBadgeInfo.level && currentBadgeInfo.level > 0 && 
              <div className="level-lvl">
                <span >Level {currentBadgeInfo.level} Reward</span>
              </div>
              } 
              <div className="level-desc">
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
              {!currentBadgeInfo.claimed && earnedWhat === 'Belt' &&
                <>
                  {/* <div className="status-rew activer blue-but" onClick={() => handleInit()}>INIT ACOUNT</div> */}
                  {/* <div className="status-rew activer blue-but" onClick={() => handleAnything()}>MINT</div> */}
                  <div className="status-rew activer blue-but" onClick={() => handleClickMint()}>MINT</div>
                  
                </>
              }
              <TwitterShareButton className="social-share" hashtags={['valorpds', 'bjj', 'flowdojo']} url="https://valorpdsapp.web.app/" title={'I just earned the "' + currentBadgeInfo.name + '" reward! '}>
                <Button className="share-twitty">Share on Twitter <TwitterIcon className="twitty" size={30} round={true} /></Button>   
              </TwitterShareButton>
            </div>
          </div>
        
        </Modal>
    </div>
  );
};

export default Profile;
