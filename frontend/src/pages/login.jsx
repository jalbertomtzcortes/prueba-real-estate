import React, { useState } from "react";
import api from "../services/api";

export default function Login({ onLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {

  try {
    const res = await api.post("/auth/login", { email, password });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    onLogin();

  } catch {
    setError("Credenciales incorrectas");
  }
};

  return (
    <div className="flex items-center justify-center h-screen bg-black">

      <div className="bg-gray-900 p-10 rounded w-96 space-y-4">

        <h1 className="text-2xl text-white">Login</h1>

        <input
          placeholder="Email"
          className="w-full p-3 bg-black text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 bg-black text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 p-3"
        >
          Ingresar
        </button>

      </div>
    </div>
  );
}