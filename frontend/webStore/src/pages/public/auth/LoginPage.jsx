import { useState } from "react";
import { loginUser } from "../../../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(form);
      localStorage.setItem("jwt", response.token);
      localStorage.setItem("userId", response.userId);
      navigate("/home");
    } catch (err) {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="page-container max-w-md mx-auto p-6">
      <h2 className="section-title mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="glass-card flex flex-col gap-5 p-6">
        <div>
          <label htmlFor="username" className="block font-semibold mb-2">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            className="input w-full"
          />
        </div>
        <div>
          <label htmlFor="password" className="block font-semibold mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="input w-full"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
