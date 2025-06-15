import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Login from './Component/Login';
import Register from './Component/Register';
import Home from './Component/Home';
import Profile from './Component/Profile';
import Settings from './Component/Settings';
import RoutesPage from './Component/RoutesPage';
import SuccessPage from './Component/SuccessPage';
import CancelPage from './Component/CancelPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
      </Routes>
    </Router>
  );
};

export default App;
