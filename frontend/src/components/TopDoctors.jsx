import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { doctorImages } from '../assets/assets';



const TopDoctors = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);
  const [doctors, setDoctors] = useState([]);

const fetchDoctors = async () => {
  try {
    const res = await axios.get('https://medical-be-u2v7.onrender.com/api/v1/doctors', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setDoctors(Array.isArray(res.data?.data?.doctors) ? res.data.data.doctors : []);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    setDoctors([]);
  }
};


  useEffect(() => {
    if (token) fetchDoctors();
  }, [token]);

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
      <p className='sm:w-1/2 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>

      <div className='w-full grid grid-cols-[var(--grid-columns)] gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {(doctors || []).slice(0, 10).map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(`/appointment/${item._id}`)}
            className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
          >
            <img
  className='bg-blue-50 w-full h-40 object-cover'
  src={doctorImages[item.name] || 'fallback-image-path.png'}
  alt={item.name || "Doctor"}
/>
            <div className='p-4'>
              <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
              </div>
              <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
              <p className='text-gray-600 text-sm'>{item.speciality}</p>
              <p className='text-yellow-500'>
              Avg Rating: {item.avgRating ? `★${item.avgRating.toFixed(1)}` : 'No ratings'}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          navigate('/doctors');
          scrollTo(0, 0);
        }}
        className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10 cursor-pointer'
      >
        more
      </button>
    </div>
  );
};

export default TopDoctors;
