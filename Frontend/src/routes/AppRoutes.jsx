import React from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import Register from '../pages/Register' 
import Project from '../pages/Project'
import UserAuth from '../auth/UserAuth'


const AppRoutes = () => {
  return (
    <div>
      <BrowserRouter>

        <Routes>
            <Route path="/" element={<UserAuth><Home /></UserAuth>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>} />
            <Route path="/project" element={<UserAuth><Project /></UserAuth>} />
        </Routes>

      </BrowserRouter>
    </div>
  )
}

export default AppRoutes
