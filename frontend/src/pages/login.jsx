import React, { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          email,
          password
        }
      );

      const { token, user } = response.data;

      onLogin(token, user);

    } catch (error) {

      console.error(error);
      setError("Credenciales incorrectas");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#0f0f14]">

      <div className="w-full max-w-md bg-[#17171f] p-10 rounded-xl shadow-2xl border border-gray-800">

        {/* LOGO / TITULO */}
        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-white">
            Real Estate Intelligence
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Plataforma de análisis inmobiliario
          </p>

        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">

          <div>

            <label className="text-sm text-gray-400">
              Email
            </label>

            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg bg-[#0f0f14] border border-gray-700 text-white focus:outline-none focus:border-green-500"
              required
            />

          </div>

          <div>

            <label className="text-sm text-gray-400">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg bg-[#0f0f14] border border-gray-700 text-white focus:outline-none focus:border-green-500"
              required
            />

          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 transition p-3 rounded-lg font-semibold"
          >
            Iniciar sesión
          </button>

        </form>

        {/* FOOTER */}
        <div className="mt-8 text-center text-xs text-gray-500">

          <p>
            © 2026 Real Estate Intelligence
          </p>

        </div>

      </div>

    </div>

  );

}

export default Login;