import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Users = () => {
  const { aToken } = useContext(AdminContext);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('https://medical-be-u2v7.onrender.com/api/v1/users', {
        headers: {
          Authorization: `Bearer ${aToken}`,
        }
      });

      if (data?.data?.users) {
        setUsers(data.data.users);
      } else {
        console.error('No users found in response');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      await axios.delete(`https://medical-be-u2v7.onrender.com/api/v1/users/${id}`, {
        headers: {
          Authorization: `Bearer ${aToken}`,
        }
      });
      toast.success("User deleted successfully");
      setUsers(prev => prev.filter(user => user._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [aToken]);

  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-2">👤 All Users</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-5 text-center flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-3">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{user.email}</p>
            <button
              onClick={() => handleDelete(user._id)}
              className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-full transition-all duration-200"
            >
              🗑️ Delete
            </button>
          </div>
        ))}

        {users.length === 0 && (
          <div className="text-gray-400 text-center col-span-full">No users found.</div>
        )}
      </div>
    </div>
  );
};

export default Users;
