import { useEffect, useState } from 'react';
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
  
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user, connect } = useWeb3Context();

  const navigateLink = (route: string) => {
    router.push(route);
  }

  return (
    <div className="nav-container">
      <Navbar color="light" light expand="md">
        <NavbarToggler onClick={() => { setIsOpen(!isOpen) }} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink onClick={() => navigateLink('/')}>Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={() => navigateLink('/leaderboard')}>Leaderboard</NavLink>
              </NavItem>
              <NavItem>
                <NavLink  onClick={() => navigateLink('/profile')}>Profile</NavLink>
              </NavItem>
              { !user.loggedIn ?
                <NavLink  onClick={connect}>Log-in</NavLink>                
                :
                <NavLink  onClick={logout}>Logout</NavLink>
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
