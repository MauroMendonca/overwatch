import React, { useState } from "react";
import { login } from "../services/authService";
import logo from "../assets/logo_overwatch.png";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const data = await login(email, password);

            if (data.token) {
                localStorage.setItem("jwt_token", data.token);
                window.location.href = "/dashboard";
            }
        } catch (err) {
            setError(err.message || "Login failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-[#22304a]">
            <div className="w-full max-w-md p-8 bg-[#23232b] rounded-2xl shadow-2xl flex flex-col items-center">
                <div className="flex items-center justify-center space-x-4 mb-6">
                    <img src={logo} alt="Logo" className="w-64 h-64 object-contain mb-4" />
                </div>
                <div className="text-lg font-medium text-[#bfc9e0] mb-8 text-center">Manage your tasks Smarter</div>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-medium text-[#bfc9e0] mb-1">Email</label>
                            <input className="w-full px-4 py-2 rounded-lg bg-[#232b3b] border border-[#2e3a4e] text-[#e3e8f0] focus:outline-none focus:ring-2 focus:ring-[#3b5bdb] transition" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#bfc9e0] mb-1">Password</label>
                            <input className="w-full px-4 py-2 rounded-lg bg-[#232b3b] border border-[#2e3a4e] text-[#e3e8f0] focus:outline-none focus:ring-2 focus:ring-[#3b5bdb] transition" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="w-full bg-[#3b5bdb] hover:bg-[#2746a6] text-white font-semibold rounded-lg py-3 mt-2 shadow-md transition">Login</button>
                        {error && <p className="text-red-400 text-center mt-2">{error}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
}