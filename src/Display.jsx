import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Shop from './components/Shop';
import Dashboard from './pages/Dashboard';

const Display = () => {
  return (
    <>
    <BrowserRouter 
    // basename='/IVMS/'
    >
    <Routes>
      <Route path='/' element={<Login />}/>
      <Route path='/shop' element={<Shop />}/>
      <Route path='/dashboard' element={<Dashboard />}/>
      <Route path='/dashboard/:tab' element={<Dashboard />}/>
    </Routes>
    </BrowserRouter>
    </>
  );
};

export default Display;