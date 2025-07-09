import { useState } from "react";
import { registerUser } from "../../../api/api";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = await registerUser(form);
        localStorage.setItem("userId", user.id);
        navigate("/addresses");
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
                <input placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="submit">Register</button>
            </form>
        </div>

    );
}
