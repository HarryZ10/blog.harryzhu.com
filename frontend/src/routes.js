import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import BlogPage from './pages/BlogPage';
import { Logout } from './api/UsersAPI';

/**
 * Manages routing on the client side to different pages
 */
const RoutesHandler = () => {
  return (
    <Router basename='/~hzhu20'>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/feed" element={<BlogPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/logout" element={<Logout /> } />
      </Routes>
    </Router>
  );
};

export default RoutesHandler;
