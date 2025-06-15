import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import validation from './RegisterValidation';
import axios from 'axios';

const Register = () => {
  const [values, setValues] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validation(values);
    setErrors(validationErrors);

    // If no errors, proceed with API request
    if (Object.keys(validationErrors).length === 0) {
      try {
          const response = await axios.post('http://localhost:8081/register', values, {
              headers: { 'Content-Type': 'application/json' }
          });

          alert(response.data.message);
          navigate('/login'); // Redirect on successful registration
      } catch (error) {
          console.error("Registration error:", error);
          alert("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='bg-gray-100 shadow-lg rounded-2xl p-6 max-w-sm w-full'>
        <h2 className='text-2xl font-semibold text-center text-gray-800 mb-6'>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='fname' className='block text-sm font-medium text-gray-900'>First Name</label>
            <input type='text' name='fname' id='fname' onChange={handleInput} value={values.fname} className='w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-400 focus:border-blue-300' placeholder='Enter First Name' />
            {errors.fname && <span className='text-red-500'>{errors.fname}</span>}
          </div>

          <div className='mb-4'>
            <label htmlFor='lname' className='block text-sm font-medium text-gray-900'>Last Name</label>
            <input type='text' name='lname' id='lname' onChange={handleInput} value={values.lname} className='w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-400 focus:border-blue-300' placeholder='Enter Last Name' />
            {errors.lname && <span className='text-red-500'>{errors.lname}</span>}
          </div>

          <div className='mb-4'>
            <label htmlFor='email' className='block text-sm font-medium text-gray-900'>E-Mail</label>
            <input type='email' name='email' id='email' onChange={handleInput} value={values.email} className='w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-400 focus:border-blue-300' placeholder='Enter Email' />
            {errors.email && <span className='text-red-500'>{errors.email}</span>}
          </div>

          <div className='mb-4'>
            <label htmlFor='password' className='block text-sm font-medium text-gray-900'>Password</label>
            <div className='relative'>
              <input 
                type={showPassword ? 'text' : 'password'}
                name='password' 
                id='password'
                onChange={handleInput} 
                className='w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-400 focus:border-blue-300 pr-10'
                placeholder='Enter Password' 
              />
              <button 
                type="button" 
                onClick={togglePasswordVisibility} 
                className='absolute inset-y-0 right-2 flex items-center text-gray-600'>
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className='mb-4'>
            <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-900'>Confirm Password</label>
            <div className='relative'>
              <input 
                type={showConfirmPassword ? 'text' : 'password'}
                name='confirmPassword' 
                id='confirmPassword'
                onChange={handleInput} 
                className='w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-400 focus:border-blue-300 pr-10'
                placeholder='Confirm Password' 
              />
              <button 
                type="button" 
                onClick={toggleConfirmPasswordVisibility} 
                className='absolute inset-y-0 right-2 flex items-center text-gray-600'>
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className='flex justify-between items-center mb-4'>
            <button type='submit' className='w-1/2 bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition'>Submit</button>
            <p className='text-center text-sm text-gray-600'>Already a user? <Link to="/login" className='text-sm text-blue-600 hover:underline'>Sign In</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
