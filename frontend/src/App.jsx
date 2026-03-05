import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import Login from "./pages/Login";

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token && token !== "undefined") {
      setIsAuthenticated(true);
    }

  }, []);

  const handleLogin = (token, user) => {

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setIsAuthenticated(true);
  };

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsAuthenticated(false);
  };

  return (
    <>
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;