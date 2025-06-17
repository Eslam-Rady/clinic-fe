import { createContext, useState, useEffect } from "react"
import { doctors as doctorsData } from "../assets/assets"

export const AppContext = createContext()

const AppContextProvider = (props) => {
  const [doctors, setDoctors] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('doctors'))
    return stored && stored.length > 0 ? stored : doctorsData
  })

  const [users, setUsers] = useState([
    { name: 'Ahmed', email: 'ahmed@example.com' },
    { name: 'Sara', email: 'sara@example.com' },
  ])

  useEffect(() => {
    localStorage.setItem('doctors', JSON.stringify(doctors))
  }, [doctors])

  const value = {
    doctors,
    setDoctors,
    users,
    setUsers
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
