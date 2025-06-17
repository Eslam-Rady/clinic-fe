import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets, doctorImages } from '../assets/assets';

const calculateAvgRating = (ratings) => {
  if (!ratings || ratings.length === 0) return "No ratings";
  const sum = ratings.reduce((a, b) => a + b, 0);
  return (sum / ratings.length).toFixed(1);
};

const RelatedDoctors = ({ speciality, docId }) => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);
  const [relatedDoctors, setRelatedDoctors] = useState([]);

  useEffect(() => {
    const fetchRelatedDoctors = async () => {
      try {
        const res = await axios.get(`https://medical-be-u2v7.onrender.com/api/v1/doctors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const decodedSpec = decodeURIComponent(speciality).toLowerCase().trim();

        const related = res.data?.data?.doctors.filter(
          (doc) =>
            doc.department?.name?.toLowerCase().trim() === decodedSpec &&
            doc._id !== docId
        );

        setRelatedDoctors(related);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load related doctors');
      }
    };

    if (speciality && docId) {
      fetchRelatedDoctors();
    }
  }, [speciality, docId, token]);

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
      <p className='sm:w-1/2 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
      <div className='w-full grid grid-cols-[var(--grid-columns)] gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {relatedDoctors.slice(0, 5).map((item) => (
          <div
            key={item._id}
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
          >
            <img
              className='bg-blue-50 w-full h-44 object-cover'
              src={item.image || doctorImages[item.name] || assets.profile_pic}
              alt={item.name}
            />
            <div className='p-4'>
              <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
              </div>
              <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
              <p className='text-gray-600 text-sm'>{item.department?.name}</p>
              <p className='text-yellow-500'>
                Avg Rating: {item.ratings?.length ? `★ ${calculateAvgRating(item.ratings)}` : 'No ratings'}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10 cursor-pointer'>more</button>
    </div>
  );
};

export default RelatedDoctors;
