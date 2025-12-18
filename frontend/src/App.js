import React, { useState, useEffect } from "react";
import "./App.css";
import LoginScreen from "./components/LoginScreen";
import Dashboard from "./components/Dashboard";
import NewYearDecoration from "./components/NewYearDecoration";
import { Toaster } from "./components/ui/sonner";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('bb_token');
    const authMethod = localStorage.getItem('bb_auth_method');
    const accessLevel = localStorage.getItem('bb_access_level');

    if (token && authMethod && accessLevel) {
      setAuthData({
        token,
        method: authMethod,
        access_level: accessLevel
      });
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  const handleAuthenticated = (data) => {
    setAuthData(data);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('bb_token');
    localStorage.removeItem('bb_auth_method');
    localStorage.removeItem('bb_access_level');
    setAuthData(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <NewYearDecoration />
      {isAuthenticated ? (
        <Dashboard
          authData={authData}
          onLogout={handleLogout}
        />
      ) : (
        <LoginScreen
          onAuthenticated={handleAuthenticated}
        />
      )}
      <Toaster />
    </div>
  );
}

export default App;