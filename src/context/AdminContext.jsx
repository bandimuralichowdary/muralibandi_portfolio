// src/context/AdminContext.jsx
import { createContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME;
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  useEffect(() => {
    // Check local storage for session
    const session = localStorage.getItem("adminSession");
    if (session === "true") {
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem("adminSession", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("adminSession");
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  );
};
