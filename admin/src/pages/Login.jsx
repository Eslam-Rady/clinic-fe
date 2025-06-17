import React, { useContext, useState } from 'react';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState('Doctor'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setAToken } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      let res;

      if (state === 'Admin') {
        res = await axios.post('https://medical-be-u2v7.onrender.com/api/v1/admins/login', {
          email,
          password
        });
        localStorage.setItem('aToken', res.data.token);
        setAToken(res.data.token);
        toast.success('Admin logged in successfully');
        navigate('/admin-dashboard');
      } else {
res = await axios.post('https://medical-be-u2v7.onrender.com/api/v1/doctor/auth/login',
  { email, password },
  {
    headers: {
      'Content-Type': 'application/json'
    }
  });

        localStorage.setItem('dToken', res.data.token);
        localStorage.setItem('doctorId', res.data.data.doctor._id); 

        setDToken(res.data.token);
        toast.success('Doctor logged in successfully');
        navigate('/doctor-dashboard');
      }

    } catch (err) {
      console.error(err);
      toast.error('Invalid credentials or server error');
    }
  };

  return (
    <>
      <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
          <p className='text-2xl font-semibold m-auto'>
            <span className='text-[var(--primary)]'>{state}</span> Login
          </p>
          <div className='w-full'>
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='border border-[#DADADA] rounded w-full p-2 mt-1'
              type="email"
              required
            />
          </div>
          <div className='w-full'>
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='border border-[#DADADA] rounded w-full p-2 mt-1'
              type="password"
              required
            />
          </div>
          <button className='bg-[var(--primary)] text-white w-full py-2 mt-1'>Login</button>
          {
            state === 'Admin'
              ? <p>Doctor Login? <span className='text-[var(--primary)] underline cursor-pointer' onClick={() => setState('Doctor')}>Click here</span></p>
              : <p>Admin Login? <span className='text-[var(--primary)] underline cursor-pointer' onClick={() => setState('Admin')}>Click here</span></p>
          }
        </div>
      </form>
      <ToastContainer />
    </>
  );
};

export default Login;
