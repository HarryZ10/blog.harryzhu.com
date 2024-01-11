import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PostPage from './pages/PostPage';
import BlogPage from './pages/BlogPage';

/**
 * Manages routing on the client side to different pages
 */
const RoutesHandler = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/posts/:id" element={<PostPage/>} />
        <Route path="/blog" element={<BlogPage/>} />
        <Route path="/login" element={<LoginPage/>} />
      </Routes>
    </Router>
  );
};

export default RoutesHandler;
