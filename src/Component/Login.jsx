import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import validation from './LoginValidation';

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInput = (e) => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validation(values);
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await axios.post("http://localhost:8081/login", values);

        if (response.data.success) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          navigate("/home"); // Navigate to home page on success
        } else {
          setErrors({ login: response.data.message });
        }
      } catch (error) {
        console.error("Login error:", error);
        setErrors({ login: "Something went wrong, please try again later." });
      }
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='bg-gray-100 shadow-lg rounded-2xl p-6 max-w-sm w-full'>
        <h2 className='text-2xl font-semibold text-center text-gray-800 mb-6'>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='email' className='block text-sm font-medium text-gray-900'>Email</label>
            <input 
              type='email' 
              onChange={handleInput} 
              id='email' 
              name='email' 
              value={values.email}
              className='w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-400 focus:border-blue-300' 
              placeholder='name@gmail.com' 
            />
            {errors.email && <span className='text-red-500 text-sm'>{errors.email}</span>}
          </div>
          <div className='mb-4 relative'>
            <label htmlFor='password' className='block text-sm font-medium text-gray-900'>Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                id='password' 
                name='password' 
                onChange={handleInput} 
                value={values.password}
                className='w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-400 focus:border-blue-300' 
                placeholder='Enter your password' 
              />
              <button 
                type="button" 
                onClick={togglePasswordVisibility} 
                className='absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 text-lg focus:outline-none'
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <span className='text-red-500 text-sm'>{errors.password}</span>}
          </div>
          {errors.login && <span className='text-red-500 text-sm'>{errors.login}</span>}
          <div className='flex justify-between items-center mb-4'>
            <button type='submit' className='w-1/2 bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition'>Submit</button>
            <a href='#' className='text-sm text-blue-600 hover:underline'>Forgot Password?</a> 
          </div>
          <p className='text-center text-sm text-gray-600'>Not registered? <Link to="/register" className='text-blue-600 hover:underline'>Create an account</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Login;
