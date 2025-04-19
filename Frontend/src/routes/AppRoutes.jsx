import React from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import Register from '../pages/Register' 


const AppRoutes = () => {
  return (
    <div>
      <BrowserRouter>

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>} />
        </Routes>

      </BrowserRouter>
    </div>
  )
}

export default AppRoutes
