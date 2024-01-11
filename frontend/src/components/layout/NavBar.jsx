import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Nav = styled.nav`
    background-color: '#36382e';
`;

const Navbar = () => {
    return (
        <Nav>
            <Link to="/">Home</Link>
            <Link to="/posts">Posts</Link>
            <Link to="/login">Login</Link>
            {/* Other navigation links */}
        </Nav>
    );
};

export default Navbar;