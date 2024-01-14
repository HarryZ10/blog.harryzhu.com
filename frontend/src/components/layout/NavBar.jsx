import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import '../../styles/navbar.css';

export const Styles = {
    button: {
        // backgroundColor: '#5bc3eb',
        background: 'transparent',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        // borderRadius: '45px',
        transition: 'background-color 0.3s, transform 0.3s',
        marginTop: '10px',
        display: 'block',
        marginLeft: 'auto', // Centers the button
        marginRight: 'auto', // Centers the button
    }
};

const NavBar = () => {
    const [username, setUsername] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // Dropdown
    const toggleDropdown = () => setIsOpen(!isOpen);
    const menuClass = isOpen ? "dropdown-menu-enter" : "";

    // Get username to display
    useEffect(() => {
        // Get the token from cookies
        const token = Cookies.get('token');
        if (token) {
            // Decode the token to get the username
            const decodedToken = jwtDecode(token);
            setUsername(decodedToken.username); // Adjust according to the token's structure
        }
    }, []);

    return (
        <>
            <Navbar style={NavStyle} expand="lg">
                <Container>
                    <Navbar.Brand style={LinkStyle} href="/">Flez</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" className="custom-toggler" />
                    <Navbar.Collapse>
                        <Nav>
                            <Nav.Link style={LinkStyle} href="/">Home</Nav.Link>
                            <Nav.Link style={LinkStyle} href="/feed">Blog</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    <Navbar.Collapse className="justify-content-end">
                        <Nav>
                            {username ? (
                                <Dropdown show={isOpen} onToggle={toggleDropdown}>
                                    <Dropdown.Toggle style={{...LoggedInLink, ... Styles.button}}>
                                        {username}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={{ width: "200px" }} className={menuClass}>
                                        <Dropdown.Item
                                            style={{
                                                display: "flex",
                                                justifyContent: "center"
                                            }}
                                            href="/profile">Profile</Dropdown.Item>
                                        <Dropdown.Item 
                                            style={{
                                                display: "flex",
                                                justifyContent: "center"
                                            }}
                                            href="/logout">Logout</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <Nav.Link style={LinkStyle} href="/login">
                                    Login
                                </Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};


const LinkStyle = {
    textDecoration: 'none',
    color: '#fff'
}

const LoggedInLink = {
    textDecoration: 'none',
    border: '#5bc3eb',
    width: '200px'
}

const NavStyle = {
    marginLeft: '50px',
    marginRight: '50px',
    fontFamily: 'Outfit',
    fontSize: '19px',
}

export default NavBar;
