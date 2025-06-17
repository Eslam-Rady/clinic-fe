import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { specialityData } from '../assets/assets';

const SpecialityMenu = () => {
  const [departments, setDepartments] = useState([]);
  const { token } = useContext(AppContext);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('https://medical-be-u2v7.onrender.com/api/v1/departments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data?.data?.departments;
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load specialities');
    }
  };

  useEffect(() => {
    if (token) fetchDepartments();
  }, [token]);

  const getSpecialityImage = (name) => {
    const match = specialityData.find(item => item.speciality.toLowerCase() === name.toLowerCase());
    return match?.image || '';
  };

  return (
    <div className='flex flex-col items-center gap-4 py-16 text-gray-800' id='speciality'>
      <h1 className='text-3xl font-medium'>Find by Speciality</h1>
      <p className='sm:w-1/3 text-center text-sm'>
        Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
      </p>
      <div className='flex sm:justify-center gap-6 pt-5 w-full overflow-x-auto px-4'>
        {departments.map((item, index) => (
          <Link
            onClick={() => scrollTo(0, 0)}
            key={index}
            to={`/doctors/${item.name}`}
            className='flex flex-col items-center text-sm cursor-pointer flex-shrink-0 hover:translate-y-[-8px] transition-transform duration-300'
          >
            <div className="rounded-full bg-white p-4 shadow-md w-[110px] h-[120px] flex items-center justify-center">
              <img
                src={getSpecialityImage(item.name)}
                alt={item.name}
                className="w-20 h-20 object-contain"
              />
            </div>
            <p className="mt-2 text-center">{item.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
