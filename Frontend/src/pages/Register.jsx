import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate()

    function submitHandler(e) {
        e.preventDefault();
        const data = {
            email,
            password,
        };
        axios.post('/users/register', data)
            .then((response) => {
                console.log(response.data);
                navigate('/'); // Redirect to login page on successful registration
                // Handle successful registration (e.g., store token, redirect, etc.)
            })
            .catch((error) => {
                console.error('Registration error:', error);
                // Handle registration error (e.g., show error message)
            });
    }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white">Register here</h2>
        <form
        onSubmit= {submitHandler}
        className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register here
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;