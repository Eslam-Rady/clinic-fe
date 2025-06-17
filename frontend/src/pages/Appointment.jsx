import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets, doctorImages } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {
  const { docId } = useParams()
  const { token, currencySymbol } = useContext(AppContext)

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const fetchDocInfo = async () => {
    try {
      const res = await axios.get(`https://medical-be-u2v7.onrender.com/api/v1/doctors/${docId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const doctor = res.data?.data?.doctor
      doctor.image = doctorImages[doctor.name] || assets.defaultDoctorImage
      setDocInfo(doctor)
    } catch (err) {
      toast.error('Failed to fetch doctor details')
      console.error(err)
    }
  }

  const getAvailableSlots = async () => {
    setDocSlots([])
    let today = new Date()
    const slotsPerDay = []

    if (!docInfo?.availableDays || docInfo.availableDays.length === 0) return

    const availableDaysSet = new Set(docInfo.availableDays)

    for (let i = 0; i < 14; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      const weekDay = currentDate.toLocaleDateString('en-US', { weekday: 'long' })
      if (!availableDaysSet.has(weekDay)) continue

      const dateStr = currentDate.toISOString().split('T')[0]
      const now = new Date()

      try {
        const res = await axios.get(`https://medical-be-u2v7.onrender.com/api/v1/doctors/${docId}/available-slots?date=${dateStr}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        let timeSlots = res.data?.data?.availableSlots?.map(time => {
          return {
            datetime: new Date(`${dateStr}T${time}:00`),
            time: time
          }
        })

        timeSlots = timeSlots.filter(slot => {
          const isToday = dateStr === now.toISOString().split('T')[0]
          return !isToday || slot.datetime > now
        })

        if (timeSlots.length > 0) {
          slotsPerDay.push(timeSlots)
        }
      } catch (err) {
        console.error("Error fetching slots for", dateStr, err)
      }
    }

    setDocSlots(slotsPerDay)
  }

  const handleBook = async () => {
    if (!slotTime) {
      toast.warn("Please select a time slot")
      return
    }

    const selectedSlot = docSlots[slotIndex].find(s => s.time === slotTime)

    const appointmentData = {
      doctorId: docId,
      date: selectedSlot.datetime.toISOString().split('T')[0],
      time: selectedSlot.time
    }

    try {
      await axios.post(`https://medical-be-u2v7.onrender.com/api/v1/appointments/`, appointmentData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      toast.success("Appointment booked successfully!")
      setSlotTime('')
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book appointment.")
      console.error(err)
    }
  }

  useEffect(() => {
    if (token && docId) fetchDocInfo()
  }, [token, docId])

  useEffect(() => {
    if (docInfo) getAvailableSlots()
  }, [docInfo])

  return docInfo && (
    <div>
      
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-[var(--primary)] w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="" />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.department?.name}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>
          <p className='text-yellow-500'>
            Avg Rating: {docInfo.avgRating ? `★ ${docInfo.avgRating.toFixed(1)}` : 'No ratings'}
          </p>

          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About <img src={assets.info_icon} alt="" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600'>{currencySymbol} {docInfo.fees}</span>
          </p>
        </div>
      </div>

      
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {docSlots.length > 0 && docSlots.map((slotGroup, index) => {
            const firstSlot = slotGroup[0]
            return (
              <div
                key={index}
                onClick={() => setSlotIndex(index)}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-[var(--primary)] text-white' : 'border border-gray-200'}`}>
                <p>{firstSlot.datetime.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</p>
                <p>{firstSlot.datetime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
              </div>
            )
          })}
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length > 0 && docSlots[slotIndex]?.length > 0 ? (
            docSlots[slotIndex].map((item, index) => (
              <p
                key={index}
                onClick={() => setSlotTime(item.time)}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-[var(--primary)] text-white' : 'text-gray-400 border border-gray-300'}`}>
                {item.time}
              </p>
            ))
          ) : (
            <p className='text-sm text-red-500 italic'>❌ No available slots</p>
          )}
        </div>

        <button
          onClick={handleBook}
          className='bg-[var(--primary)] text-white text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer'>
          Book an appointment
        </button>
      </div>

      <RelatedDoctors docId={docId} speciality={docInfo.department?.name} />
    </div>
  )
}

export default Appointment
