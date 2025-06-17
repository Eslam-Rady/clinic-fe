import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Myprofile = () => {
  const { token, user, setUser } = useContext(AppContext);

  const [userData, setUserData] = useState({
    name: '',
    image: assets.profile_pic,
    email: '',
    phone: '',
    address: {
      line1: '',
      line2: ''
    },
    gender: '',
    dateOfBirth: ''
  });

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`https://medical-be-u2v7.onrender.com/api/v1/users/${user?._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const fetchedUser = res.data?.data?.user;
        if (!fetchedUser) throw new Error("User not found");

        setUserData(prev => ({
          ...prev,
          ...fetchedUser,
          address: {
            ...prev.address,
            ...(fetchedUser.address || {})
          }
        }));

        
        setUser(fetchedUser);
      } catch (err) {
        console.error(" Failed to fetch user:", err);
        toast.error("Failed to load user data.");
      }
    };

    if (token && user?._id) {
      fetchUserData();
    }
  }, [token, user?._id]);

  const handleSave = async () => {
    try {
      const res = await axios.patch(`https://medical-be-u2v7.onrender.com/api/v1/users/${user._id}`, {
        name: userData.name,
        phone: userData.phone,
        gender: userData.gender,
        dateOfBirth: userData.dateOfBirth,
        address: userData.address
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedUser = res.data?.data?.user;
      setUser(updatedUser);
      setUserData(updatedUser);
      toast.success('✅ Your changes have been saved.');
      setIsEdit(false);
    } catch (error) {
      console.error(error);
      toast.error('❌ Failed to save changes.');
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://medical-be-u2v7.onrender.com/api/v1/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      toast.success("Account deleted successfully.");
      window.location.href = '/login';
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete account.");
    }
  };

  return (
    <div className='max-w-lg mx-auto flex flex-col gap-2 text-sm'>
      <img className='w-36 rounded-full' src={userData.image || assets.profile_pic} alt="Profile" />

      {isEdit ? (
        <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4'
               type="text"
               value={userData.name}
               onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} />
      ) : (
        <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
      )}

      <hr className='bg-zinc-400 h-[1px] border-none' />

      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{userData.email}</p>

          <p className='font-medium'>Phone:</p>
          {isEdit ? (
            <input className='bg-gray-100 max-w-52' type="text" value={userData.phone}
                   onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} />
          ) : (
            <p className='text-blue-400'>{userData.phone}</p>
          )}

          <p className='font-medium'>Address:</p>
          {isEdit ? (
            <p>
              <input className='bg-gray-50 block w-full mb-1'
                     type="text"
                     value={userData.address?.line1 || ''}
                     onChange={e => setUserData(prev => ({
                       ...prev,
                       address: { ...prev.address, line1: e.target.value }
                     }))} />
              <input className='bg-gray-50 block w-full'
                     type="text"
                     value={userData.address?.line2 || ''}
                     onChange={e => setUserData(prev => ({
                       ...prev,
                       address: { ...prev.address, line2: e.target.value }
                     }))} />
            </p>
          ) : (
            <p className='text-gray-500'>
              {userData.address?.line1}<br />
              {userData.address?.line2}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender:</p>
          {isEdit ? (
            <select className='max-w-20 bg-gray-100'
                    value={userData.gender}
                    onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className='text-gray-400'>{userData.gender}</p>
          )}

          <p className='font-medium'>Birthday:</p>
          {isEdit ? (
            <input className='max-w-28 bg-gray-100' type="date"
                   value={userData.dateOfBirth}
                   onChange={e => setUserData(prev => ({ ...prev, dateOfBirth: e.target.value }))} />
          ) : (
            <p className='text-gray-400'>{userData.dateOfBirth?.slice(0, 10)}</p>

          )}
        </div>
      </div>

      <div className='mt-10'>
        {isEdit ? (
          <button
            className='border border-[var(--primary)] px-8 py-2 rounded-full hover:bg-[var(--primary)] hover:text-white transition-all'
            onClick={handleSave}
          >
            Save information
          </button>
        ) : (
          <button
            className='border border-[var(--primary)] px-8 py-2 rounded-full hover:bg-[var(--primary)] hover:text-white transition-all'
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}

        <button
          className='border border-red-500 text-red-500 px-8 py-2 rounded-full hover:bg-red-500 hover:text-white transition-all mt-4'
          onClick={handleDelete}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Myprofile;
