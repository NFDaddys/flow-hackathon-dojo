import { useEffect, useState } from 'react';
import { UserObject } from '../constants/models';
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
    
  useEffect(() => {
      
  }, []);

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
            </Nav>
          </Collapse>
        </Navbar>
    </div>
  );
};

export default Navigation;
