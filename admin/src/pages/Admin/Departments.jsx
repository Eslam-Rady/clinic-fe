import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const aToken = localStorage.getItem('aToken');

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await axios.get('https://medical-be-u2v7.onrender.com/api/v1/departments');
        setDepartments(data.data.departments || []);
      } catch (error) {
        toast.error('Failed to load departments');
        console.error(error);
      }
    };
    fetchDepartments();
  }, []);

  const handleAdd = async () => {
    if (!newDept.trim()) return;
    try {
      const { data } = await axios.post(
        'https://medical-be-u2v7.onrender.com/api/v1/admins/departments',
        { name: newDept.trim() },
        { headers: { Authorization: `Bearer ${aToken}` } }
      );
      setDepartments(prev => [...prev, data.data.department]);
      setNewDept('');
      toast.success('Department added');
    } catch (error) {
      toast.error('Failed to add department');
      console.error(error);
    }
  };

  const handleDelete = async (index) => {
    const dept = departments[index];
    try {
      await axios.delete(`https://medical-be-u2v7.onrender.com/api/v1/admins/departments/${dept._id}`, {
        headers: { Authorization: `Bearer ${aToken}` },
      });
      setDepartments(departments.filter((_, i) => i !== index));
      toast.success('Department deleted');
    } catch (error) {
      toast.error('Failed to delete');
      console.error(error);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedName(departments[index].name);
  };

  const handleUpdate = async () => {
    const dept = departments[editingIndex];
    try {
      await axios.put(
        `https://medical-be-u2v7.onrender.com/api/v1/admins/departments/${dept._id}`,
        { name: editedName.trim() },
        { headers: { Authorization: `Bearer ${aToken}` } }
      );
      const updated = [...departments];
      updated[editingIndex].name = editedName.trim();
      setDepartments(updated);
      setEditingIndex(null);
      setEditedName('');
      toast.success('Updated successfully');
    } catch (error) {
      toast.error('Failed to update');
      console.error(error);
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Departments</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          value={newDept}
          onChange={(e) => setNewDept(e.target.value)}
          placeholder="Enter new department..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
        <button
          onClick={handleAdd}
          className="bg-[var(--primary)] text-white text-lg px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Add Department
        </button>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {departments.map((dept, i) => (
          <div
            key={dept._id || i}
            className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center justify-between"
          >
            {editingIndex === i ? (
              <input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-lg w-full text-center"
              />
            ) : (
              <h3 className="text-lg font-bold text-gray-700">{dept.name}</h3>
            )}

            <div className="flex gap-2 mt-4">
              {editingIndex === i ? (
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 hover:bg-green-600 text-white text-l px-4 py-1 rounded"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(i)}
                  className="bg-[var(--primary)] hover:bg-blue-600 text-white text-l px-4 py-1 rounded"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(i)}
                className="bg-red-500 hover:bg-red-600 text-white text-l px-4 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Departments;
