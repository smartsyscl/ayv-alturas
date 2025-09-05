"use client";
import { useState } from "react";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      const { token } = await res.json();
      Cookies.set("token", token, { expires: 7 }); // Guardar la cookie por 7 días
      window.location.href = "/dashboard";
    } else {
      const data = await res.json();
      setError(data.error || "Error de autenticación");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700">
      <div className="w-full max-w-md p-6 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl">
        <h1 className="text-3xl font-extrabold text-center text-white drop-shadow-sm">
          Bienvenido
        </h1>
        <p className="text-center text-gray-200 mb-6">
          Ingresa tus credenciales para continuar
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
          {error && (
            <div className="text-red-200 bg-red-600/50 p-2 rounded text-center">
              {error}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
