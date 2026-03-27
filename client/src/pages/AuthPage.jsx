// src/pages/authPage.jsx
import { useState } from "react";
import { signup, login } from "../services/authService";
import { useAuth } from "../context/authContext";

function AuthPage() {
  const { login: saveAuth } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fn = mode === "signup" ? signup : login;
      const data = await fn(email, password);
      saveAuth(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-xl border border-black bg-white p-6">
      <h2 className="mb-4 text-center text-2xl font-semibold text-slate-800">
        {mode === "login" ? "Login" : "Sign up"}
      </h2>

      <div className="mb-6 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`rounded-md px-3 py-1 text-sm ${
            mode === "login"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`rounded-md px-3 py-1 text-sm ${
            mode === "signup"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          Sign up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@gmail.com"
            required
            className="w-full rounded-md border text-black border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="******"
            required
            className="w-full rounded-md border text-black border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Login"
            : "Sign up"}
        </button>
      </form>
    </div>
  );
}

export default AuthPage;