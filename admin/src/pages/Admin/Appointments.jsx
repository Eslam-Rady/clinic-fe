import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get('https://medical-be-u2v7.onrender.com/api/v1/appointments');

        if (data?.data?.appointments) {
          setAppointments(data.data.appointments);
        } else {
          toast.error('No appointments found');
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load appointments');
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-gray-800 mb-6">All Appointments</h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="px-6 py-3 text-left">#</th>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-left">Doctor</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Time</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {appointments.length > 0 ? (
              appointments.map((appt, index) => (
                <tr key={appt._id || index} className="hover:bg-gray-50 border-t">
                  <td className="px-6 py-3">{index + 1}</td>
                  <td className="px-6 py-3">{appt.user?.name || 'N/A'}</td>
                  <td className="px-6 py-3">{appt.doctor?.name || 'N/A'}</td>
                  <td className="px-6 py-3">{appt.date || 'N/A'}</td>
                  <td className="px-6 py-3">{appt.time || 'N/A'}</td>
                  <td className="px-6 py-3 capitalize font-medium">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        appt.status === 'booked'
                          ? 'bg-green-100 text-green-800'
                          : appt.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {appt.status || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;
