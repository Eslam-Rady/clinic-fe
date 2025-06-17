import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets, doctorImages } from '../assets/assets';



const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`https://medical-be-u2v7.onrender.com/api/v1/doctors/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allDoctors = res.data?.data?.doctors || [];

 if (speciality) {
  const decodedSpec = decodeURIComponent(speciality).toLowerCase().trim();
  setFilterDoc(
    allDoctors.filter(doc =>
      doc.department?.name?.toLowerCase().trim() === decodedSpec
    )
  );
} else {
  setFilterDoc(allDoctors);
}

    } catch (err) {
      console.error(err);
      toast.error("Failed to load doctors.");
    }
  };

  const fetchSpecialities = async () => {
    try {
      const res = await axios.get(`https://medical-be-u2v7.onrender.com/api/v1/departments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const all = res.data?.data?.departments?.map(dep => dep.name) || [];
      setSpecialities(all);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load specialities.");
    }
  };

  useEffect(() => {
    if (token) {
      fetchDoctors();
      fetchSpecialities();
    }
  }, [token, speciality]);

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <div className='flex flex-col gap-4 text-sm text-gray-600'>
          {specialities.map((s, i) => (
            <button
              key={i}
              onClick={() =>
                speciality === s ? navigate('/doctors') : navigate(`/doctors/${s}`)
              }
              className={`w-[94vw] sm:w-auto text-left pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                speciality === s ? 'bg-indigo-100 text-black' : ''
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className='w-full grid grid-cols-[var(--grid-columns)] gap-4 gap-y-6'>
          {filterDoc.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/appointment/${item._id}`)}
              className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
            >
              <img
                className='bg-blue-50 w-full h-44 object-cover'
                src={doctorImages[item.name] || assets.defaultDoctorImage}
                alt={item.name}
              />

              <div className='p-4'>
                <div className='flex items-center gap-2 text-sm text-green-500'>
                  <p className='w-2 h-2 bg-green-500 rounded-full'></p>
                  <p>Available</p>
                </div>
<p className='text-yellow-500'>
  Avg Rating: {item.avgRating ? `★${item.avgRating.toFixed(1)}` : 'No ratings'}
</p>

                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                <p className='text-gray-600 text-sm'>{item.department?.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;