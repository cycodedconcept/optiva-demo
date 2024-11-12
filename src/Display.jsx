import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login'
import Dashboard from './pages/Dashboard'

const Display = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login />}/>
      <Route path='/dashboard' element={<Dashboard />}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default Display
