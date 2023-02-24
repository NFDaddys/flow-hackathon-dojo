import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import Faq from "../faq.json";

const Home = () => {
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
            <div className="video-cat">
              Bronze
            </div>
            <div className="video-cat silver">
              Silver
            </div>
            <div className="video-cat goldup">
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
    </div>
  );
};

export default Home;
