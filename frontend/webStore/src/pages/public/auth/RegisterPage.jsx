import { useState } from "react";
import { registerUser } from "../../../api/api";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await registerUser(form);
      localStorage.setItem("userId", user.id);
      navigate("/addresses");
    } catch {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="page-container max-w-md mx-auto p-6">
      <h2 className="section-title mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit} className="glass-card flex flex-col gap-5 p-6">
        <div>
          <label htmlFor="username" className="block font-semibold mb-2">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Choose a username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            className="input w-full"
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-semibold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Your email address"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
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
            placeholder="Create a password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="input w-full"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Register
        </button>
      </form>
    </div>
  );
}
