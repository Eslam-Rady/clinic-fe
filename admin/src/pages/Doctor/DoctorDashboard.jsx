import React from 'react';

const DoctorDashboard = () => {
  return (
    <div className="w-full flex flex-col items-center px-4 py-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          👨‍⚕️ Welcome to Doctor Dashboard
        </h2>
        <p className="text-gray-600 mb-6">
          Here you can manage your appointments, view your rating, and much more.
        </p>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          
          <div className="bg-blue-100 text-blue-800 rounded-lg p-4 shadow" >
            <h3 className="font-semibold text-lg">Appointments</h3>
            <p className="text-sm mt-1">View and manage your bookings</p>
          </div>
          <div className="bg-yellow-100 text-yellow-800 rounded-lg p-4 shadow">
            <h3 className="font-semibold text-lg">Ratings</h3>
            <p className="text-sm mt-1">Check your average feedback</p>
          </div>
          <div className="bg-green-100 text-green-800 rounded-lg p-4 shadow">
            <h3 className="font-semibold text-lg">Profile</h3>
            <p className="text-sm mt-1">Update your information</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
