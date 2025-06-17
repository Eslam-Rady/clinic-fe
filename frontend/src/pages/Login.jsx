
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

  const Login = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useContext(AppContext);



  const [state, setState] = useState('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setdateOfBirth] = useState('');
  const [gender, setGender] = useState('Male');

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      let res;
      if (state === 'Sign Up') {
        res = await axios.post('https://medical-be-u2v7.onrender.com/api/v1/auth/register', {
          name, email, password, phone, dateOfBirth, gender
        });
      } else {
        res = await axios.post('https://medical-be-u2v7.onrender.com/api/v1/auth/login', {
          email, password
        });
      }

if (res.data?.token) {
  setToken(res.data.token);
  setUser(res.data.data.user);
  localStorage.setItem('userToken', res.data.token);
  localStorage.setItem('userData', JSON.stringify(res.data.data.user));
  navigate('/');
}

    } catch (error) {
      console.error("Authentication failed", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login/Register failed");
    }
  };

  return (
    <form className='min-h-[80vh] flex items-center' onSubmit={onSubmitHandler}>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>
          {state === 'Sign Up' ? "Create Account" : "Login"}
        </p>
        <p>Please {state === 'Sign Up' ? "sign up" : "log in"} to book appointment</p>

        {state === "Sign Up" && (
          <>
            <div className='w-full'>
              <p>Full Name</p>
              <input type="text" className='border border-zinc-300 rounded w-full p-2 mt-1'
                value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className='w-full'>
              <p>Phone</p>
              <input type="text" className='border border-zinc-300 rounded w-full p-2 mt-1'
                value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div className='w-full'>
              <p>Date of Birth</p>
              <input type="date" className='border border-zinc-300 rounded w-full p-2 mt-1'
                value={dateOfBirth} onChange={(e) => setdateOfBirth(e.target.value)} required />
            </div>
            <div className='w-full'>
              <p>Gender</p>
              <select className='border border-zinc-300 rounded w-full p-2 mt-1'
                value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
          </>
        )}

        <div className='w-full'>
          <p>Email</p>
          <input type="email" className='border border-zinc-300 rounded w-full p-2 mt-1'
            value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input type="password" className='border border-zinc-300 rounded w-full p-2 mt-1'
            value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button type="submit" className='bg-[var(--primary)] text-white w-full py-2 rounded-md text-base'>
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>

        <p>
          {state === "Sign Up"
            ? <>Already have an account? <span className='text-[var(--primary)] underline cursor-pointer' onClick={() => setState('Login')}>Login here</span></>
            : <>Create an account? <span className='text-[var(--primary)] underline cursor-pointer' onClick={() => setState('Sign Up')}>Click here</span></>}
        </p>
      </div>
    </form>
  );
};

export default Login;
