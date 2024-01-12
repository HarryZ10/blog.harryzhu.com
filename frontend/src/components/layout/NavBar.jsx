import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const NavBar = () => {
    const [username, setUsername] = useState('');

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
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                        <Nav>
                            <Nav.Link style={LinkStyle} href="/">Home</Nav.Link>
                            <Nav.Link style={LinkStyle} href="/feed">Blog</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>

                    <Navbar.Collapse className="justify-content-end">
                        <Nav>
                            {username ? (
                                <Nav.Link style={LinkStyle} href="/profile">
                                    {username}
                                </Nav.Link>
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

const NavStyle = {
    backgroundColor: '#36382e',
}

export default NavBar;
