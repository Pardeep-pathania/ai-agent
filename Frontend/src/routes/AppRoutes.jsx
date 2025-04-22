import React from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import Register from '../pages/Register' 
import Project from '../pages/Project'


const AppRoutes = () => {
  return (
    <div>
      <BrowserRouter>

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>} />
            <Route path="/project" element={<Project />} />
        </Routes>

      </BrowserRouter>
    </div>
  )
}

export default AppRoutes
