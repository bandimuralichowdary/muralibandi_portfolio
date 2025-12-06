// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/admin/Login";
import AdminDashboard from "./components/admin/AdminDashboard";
import { AdminProvider, AdminContext } from "./context/AdminContext";
import { useContext } from "react";

const ProtectedRoute = ({ children }) => {
  const { isAdmin, loading } = useContext(AdminContext);
  if (loading) return null; // Or a loading spinner
  return isAdmin ? children : <Navigate to="/admin" />;
};

function App() {
  return (
    <AdminProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AdminProvider>
  );
}

export default App;
