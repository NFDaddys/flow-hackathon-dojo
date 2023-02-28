import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faClose } from '@fortawesome/free-solid-svg-icons';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import React from "react";
import Modal from 'react-modal';
import Faq from "../faq.json";
import { Button } from 'reactstrap';
import YoutubeEmbed from "../components/youtube";

Modal.setAppElement('#__next');

const Home = () => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [currentVideo, setCurrentVideo] = React.useState('');
  const [currentVidType, setCurrentVidType] = React.useState('');

  const afterOpenModal = () => {

  }

  const openModal = (belt: string, name: string) => {
    setCurrentVideo(belt);
    setCurrentVidType(name);
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  }

  return (
     <div className="flex-holder">
      <h1 className="title-header">Get Ready!</h1>
      <div className="home-top-container">
          <h3 className="home-title">Welcome to <br />the Flow Dojo</h3>
          <span className="home-link">Learn More</span>
        </div>
      <div className="profile-header extra-p">
          <div className="profile-subhead">
            <h3 className="resouce-title">Resources</h3>
          </div>
          <div className="hour-res">
            <div className="burst-holder"><FontAwesomeIcon icon={faCalendarDays} className="burst-ico" /> </div>
            <div className="hour-list">
              <span>Sunday 5-7pm</span>
              <span>Tuesday 6-7:30pm</span>
              <span>Thursdays 8:15-9:15pm</span>
            </div>
          </div>

          <div className="video-section">
            <div className="profile-subhead">
              <h3 className="resouce-title">BJJ Videos</h3>
            </div>
            <div className="video-cat" onClick={() => openModal('XOCzuCb1RqM', 'Bronze')}>
              Bronze
            </div>
            <div className="video-cat silver" onClick={() => openModal('8Pvj6oFWyPw', 'Silver')}>
              Silver
            </div>
            <div className="video-cat goldup" onClick={() => openModal('f7Mrvka_PpU', 'Gold')}>
              Gold
            </div>
          </div>

          <div className="faq-section">
          <div className="profile-subhead">
              <h3 className="resouce-title">FAQ<span className="smalls">s</span></h3>
            </div>
            <Accordion allowZeroExpanded>
              {Faq.map((item, index) => (
                <AccordionItem key={index}>
                    <AccordionItemHeading>
                        <AccordionItemButton>
                            {item.faqTitle}
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      {item.faqContent}
                    </AccordionItemPanel>
                </AccordionItem>
              ))}
              </Accordion>
          </div>
      </div>
      {/* <div onClick={goCheckIn}>Scan</div> */}

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        className="refix cf vid"
        contentLabel="Welcome"
      >
        <h3 className="claimh">BJJ Videos - {currentVidType}</h3>
        <Button className="closebtn" onClick={closeModal}>
          <FontAwesomeIcon icon={faClose} />
        </Button>
        <div className="flexholder vidholder">
          <YoutubeEmbed embedId={currentVideo} />
        </div>
      </Modal>
    </div>
  );
};

export default Home;
