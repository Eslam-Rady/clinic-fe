import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const DoctorEditProfile = () => {
  const { dToken } = useContext(DoctorContext);
  const doctorId = localStorage.getItem('doctorId');

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    experience: '',
    about: '',
    address: '',
    fees: '',
    startTime: '',
    endTime: '',
    sessionTime: '',
    availableDays: [],
  });

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`https://medical-be-u2v7.onrender.com/api/v1/doctors/${doctorId}`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      setProfile(res.data.data.doctor || {});
    } catch (err) {
      toast.error('Failed to load profile.');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = {
        ...profile,
        availableDays: Array.isArray(profile.availableDays)
          ? profile.availableDays
          : profile.availableDays.split(',').map((d) => d.trim()),
      };

      await axios.patch(`https://medical-be-u2v7.onrender.com/api/v1/doctors/${doctorId}`, updatedProfile, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile.');
    }
  };

  useEffect(() => {
    if (dToken && doctorId) fetchProfile();
  }, [dToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <div className="w-full flex justify-center px-4 bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-md p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
          Edit Profile
        </h2>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Name', name: 'name' },
            { label: 'Email', name: 'email' },
            { label: 'Experience', name: 'experience' },
            { label: 'About', name: 'about' },
            { label: 'Address', name: 'address' },
            { label: 'Fees', name: 'fees' },
            {
              label: 'Available Days (e.g. Sunday, Tuesday)',
              name: 'availableDays',
              value: Array.isArray(profile.availableDays)
                ? profile.availableDays.join(', ')
                : profile.availableDays,
            },
            {
              label: 'Session Duration (e.g. 30)',
              name: 'sessionTime',
            },
          ].map(({ label, name, value }) => (
            <div key={name} className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="text"
                name={name}
                value={value !== undefined ? value : profile[name]}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          ))}

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={profile.startTime}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input
              type="time"
              name="endTime"
              value={profile.endTime}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="col-span-full flex justify-center pt-4">
            <button
              type="submit"
              className="bg-[var(--primary)] text-white font-semibold py-3 px-10 rounded-full hover:bg-blue-700 transition"
            >
              Update Profile
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default DoctorEditProfile;
