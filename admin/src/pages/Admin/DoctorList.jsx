import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assets ,doctorImages } from '../../assets/assets';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const aToken = localStorage.getItem('aToken');

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('https://medical-be-u2v7.onrender.com/api/v1/doctors');
      setDoctors(res.data.data.doctors || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch doctors');
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this doctor?');
    if (!confirm) return;

    try {
      await axios.delete(`https://medical-be-u2v7.onrender.com/api/v1/admins/doctors/${id}`, {
        headers: { Authorization: `Bearer ${aToken}` },
      });
      setDoctors(prev => prev.filter(doc => doc._id !== id));
      toast.success('Doctor deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete doctor');
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className='p-6'>
      <ToastContainer />
      <h2 className='text-3xl font-bold mb-6 text-gray-800'>All Doctors</h2>
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {doctors.map((doc) => (
          <div key={doc._id} className='border border-gray-200 p-4 rounded-xl shadow bg-white hover:shadow-lg transition duration-200'>
<div className="w-full aspect-[3/4] bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
  <img
    src={doctorImages[doc.name] || assets.defaultDoctorImage}
    alt={doc.name}
    className="h-full object-contain"
  />
</div>

            <h3 className='text-xl font-semibold text-gray-800'>{doc.name}</h3>
            <p className='text-sm text-gray-600 mb-1'>
              Department: {doc.department?.name || 'N/A'}
            </p>
            <p className='text-sm text-gray-600 mb-1'>Email: {doc.email || 'N/A'}</p>
            <p className='text-yellow-600 font-medium mt-2'>
              ⭐ Avg Rating: {doc.avgRating ?? 'No ratings'}
            </p>
            <div className='flex justify-end mt-4'>
              <button
                onClick={() => handleDelete(doc._id)}
                className='text-sm bg-red-100 hover:bg-red-200 text-red-700 px-4 py-1 rounded'
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
