import { createContext, useState, useEffect } from "react";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [aToken, setAToken] = useState('');

  useEffect(() => {
    const storedAToken = localStorage.getItem('aToken');
    if (storedAToken) setAToken(storedAToken);
  }, []);

  return (
    <AdminContext.Provider value={{ aToken, setAToken }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
