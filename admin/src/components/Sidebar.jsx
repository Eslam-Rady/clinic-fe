import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    const {aToken} =useContext(AdminContext)
  return (
    <div className='min-h-screen bg-white border-r'>
        {
            aToken && <ul className='text-[#515151] mt-5'>
                <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/admin-dashboard'}>
                    <img src={assets.home_icon} alt="" />
                    <p>Dashboard</p>
                </NavLink>
                <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/depart'}>
                    <img src={assets.appointment_icon} alt="" />
                    <p>Departments</p>
                </NavLink>
                <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary':''}`} to={'/add-doctor'}>
                    <img src={assets.add_icon} alt="" />
                    <p>Add Doctor</p>
                </NavLink>
                
            </ul>
        }

    </div>
  )
}

export default Sidebar