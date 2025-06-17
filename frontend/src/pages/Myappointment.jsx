import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import RatingComponent from '../components/Rating';
import axios from 'axios';
import { toast } from 'react-toastify';
import { doctorImages } from '../assets/assets';

const Myappointment = () => {
  const { token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get('https://medical-be-u2v7.onrender.com/api/v1/appointments/my', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAppointments(res.data?.data?.appointments || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load appointments.");
      }
    };

    if (token) {
      fetchAppointments();
    }
  }, [token]);

  const handleCancel = async (appointmentId) => {
    try {
      await axios.delete(`https://medical-be-u2v7.onrender.com/api/v1/appointments/${appointmentId}/cancel`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAppointments(prev => prev.filter(app => app._id !== appointmentId));
      toast.success("Appointment cancelled.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel appointment.");
    }
  };

  const handleRatingSubmit = async (appointmentId, rating) => {
    try {
      await axios.patch(`https://medical-be-u2v7.onrender.com/api/v1/appointments/${appointmentId}/rate`, { rating }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Thank you for your rating!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit rating.");
    }
  };

  const handlePayment = async (appointmentId) => {
    try {
      // حفظ الـ ID مؤقتًا عشان نستخدمه بعد الدفع
      localStorage.setItem("appointmentId", appointmentId);

      const res = await axios.post(
        'https://medical-be-u2v7.onrender.com/api/payments/create-checkout-session',
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      window.open(res.data.url, "_blank");
    } catch (err) {
      console.error(err);
      toast.error("Failed to start payment process.");
    }
  };

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
      {appointments.length === 0 ? (
        <p className="text-sm text-gray-500 mt-4">No appointments yet.</p>
      ) : (
        appointments.map((item) => {
          const appointmentDateTime = new Date(`${item.date}T${item.time}`);
          const isPast = appointmentDateTime < new Date();

          const formattedDate = appointmentDateTime.toLocaleString();
          const doctorName = item.doctor?.name || 'Unknown Doctor';
          const doctorImage = doctorImages[doctorName] || "https://via.placeholder.com/150";

          return (
            <div key={item._id} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b'>
              <img className='w-32 bg-indigo-50' src={doctorImage} alt={doctorName} />
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{doctorName}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-xs'>{item.doctor?.address || 'No address provided'}</p>
                <p className='text-xs mt-1'>
                  <span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {formattedDate}
                </p>

                <div className='mt-2'>
                  {item.rating ? (
                    <p className='text-sm text-green-600'>You rated: {item.rating} ★</p>
                  ) : (
                    <>
                      <p className='text-sm text-zinc-700'>Rate this doctor:</p>
                      <RatingComponent appointmentId={item._id} onSubmit={handleRatingSubmit} />
                    </>
                  )}
                </div>
              </div>

              <div className='flex flex-col gap-2 justify-end'>
                {!isPast && item.paymentStatus !== 'paid' && (
                  <button
                    onClick={() => handlePayment(item._id)}
                    className="text-sm text-center sm:min-w-48 py-2 border text-white bg-[var(--primary)] transition-all duration-300"
                  >
                    Pay Online
                  </button>
                )}

                {!isPast && (
                  <button
                    className='text-sm text-stone-500 sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300'
                    onClick={() => handleCancel(item._id)}
                  >
                    Cancel appointment
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Myappointment;
