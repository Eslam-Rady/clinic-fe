import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';

const AddDoctor = () => {
  const { doctors, setDoctors } = useContext(AppContext);
  const backendUrl = 'https://medical-be-u2v7.onrender.com';
  const aToken = localStorage.getItem('aToken');

  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  const [department, setDepartment] = useState('');
  const [address, setAddress] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [availableDays, setAvailableDays] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/v1/departments`);
        setDepartments(res.data?.data?.departments || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load departments");
      }
    };

    fetchDepartments();
  }, []);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        name,
        email,
        password,
        experience,
        fees: Number(fees),
        about,
        departmentId: department,
        address,
        startTime,
        endTime,
        sessionTime,
        availableDays,
      };

      const { data } = await axios.post(`${backendUrl}/api/v1/admins/doctors`, payload, {
        headers: {
          Authorization: `Bearer ${aToken}`,
        },
      });

if (data.status === 'success') {
  toast.success("Doctor added successfully");

        setDoctors([...doctors, data.doctor]);
        setName('');
        setEmail('');
        setPassword('');
        setExperience('1 Year');
        setFees('');
        setAbout('');
        setDepartment('');
        setAddress('');
        setStartTime('');
        setEndTime('');
        setSessionTime('');
        setAvailableDays([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <ToastContainer />
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl">
        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <InputField label="Doctor name" value={name} onChange={setName} placeholder="Name" />
            <InputField label="Doctor Email" value={email} onChange={setEmail} placeholder="Email" type="email" />
            <InputField label="Doctor Password" value={password} onChange={setPassword} placeholder="Password" type="password" />
            <SelectField
              label="Experience"
              value={experience}
              onChange={setExperience}
              options={Array.from({ length: 8 }, (_, i) => `${i + 1} Year`)}
            />
            <InputField label="Fees" value={fees} onChange={setFees} placeholder="Fees" type="number" />
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Department</p>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="border rounded px-3 py-2"
                required
              >
                <option value="">-- Select Department --</option>
                {departments.map(dep => (
                  <option key={dep._id} value={dep._id}>
                    {dep.name}
                  </option>
                ))}
              </select>
            </div>
            <InputField label="Address" value={address} onChange={setAddress} placeholder="Address" />
            <InputField label="Start Time" value={startTime} onChange={setStartTime} type="time" />
            <InputField label="End Time" value={endTime} onChange={setEndTime} type="time" />
            <InputField label="Session Time (minutes)" value={sessionTime} onChange={setSessionTime} placeholder="ex: 30" type="number" />
            <div className="flex flex-col gap-1">
              <p>Available Days</p>
              <div className="grid grid-cols-2 gap-2">
                {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                  <label key={day} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={day}
                      checked={availableDays.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAvailableDays([...availableDays, day]);
                        } else {
                          setAvailableDays(availableDays.filter((d) => d !== day));
                        }
                      }}
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="mt-4 mb-2">About Doctor</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full px-4 pt-2 border rounded"
            placeholder="Write about doctor"
            rows="5"
            required
          />
        </div>

        <button type="submit" className="bg-[var(--primary)] text-white px-10 py-3 mt-4 rounded-full">
          Add Doctor
        </button>
      </div>
    </form>
  );
};

const InputField = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div className="flex-1 flex flex-col gap-1">
    <p>{label}</p>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-3 py-2"
      type={type}
      placeholder={placeholder}
      required
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div className="flex-1 flex flex-col gap-1">
    <p>{label}</p>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="border rounded px-3 py-2" required>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default AddDoctor;
