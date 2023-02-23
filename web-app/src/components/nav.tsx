import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faRankingStar, faPeopleArrows, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { useWeb3Context } from '../flow/web3';
import router from 'next/router';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import Image from 'next/image';
import Logo from "../../public/snooplion.png"
  
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user, connect } = useWeb3Context();

  const navigateLink = (route: string) => {
    router.push(route);
  }

  return (
    <div className="nav-container">
      <Navbar color="dark" dark expand="md">
        <Image src={Logo} alt="Logo" className="logo-img" />
        <NavbarToggler onClick={() => { setIsOpen(!isOpen) }} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink onClick={() => navigateLink('/')}>
                  <FontAwesomeIcon icon={faHome} className="nav-ico" /> Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={() => navigateLink('/leaderboard')}>
                  <FontAwesomeIcon icon={faRankingStar} className="nav-ico" /> Leaderboard
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink  onClick={() => navigateLink('/profile')}>
                  <FontAwesomeIcon icon={faPeopleArrows} className="nav-ico" /> Profile
                </NavLink>
              </NavItem>
              { !user.loggedIn ?
                <NavLink  onClick={connect}>
                  <FontAwesomeIcon icon={faPowerOff} className="nav-ico" />
                  Log-in</NavLink>                
                :
                <NavLink  onClick={logout}>
                  <FontAwesomeIcon icon={faPowerOff} className="nav-ico" /> Logout
                </NavLink>
              }
              <NavItem>
              </NavItem>              
            </Nav>
          </Collapse>
        </Navbar>
    </div>
  );
};

export default Navigation;
