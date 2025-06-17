import React, { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext'; 
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext); 
  const navigate = useNavigate();

  const logout = () => {
    if (aToken) {
      localStorage.removeItem('aToken');
      setAToken('');
    }

    if (dToken) {
      localStorage.removeItem('dToken');
      setDToken('');
    }

    navigate('/login');
  };

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <img className='h-16 w-auto object-contain cursor-pointer' src={assets.logo} alt="logo" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>
          {aToken ? 'admin' : dToken ? 'doctor' : 'guest'}
        </p>
      </div>
      <button
        onClick={logout}
        className='bg-[var(--primary)] text-white text-sm px-10 py-2 rounded-full'
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
