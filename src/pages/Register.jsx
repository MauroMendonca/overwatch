import React, { useState } from "react";
import { register } from "../services/authService";
import { Link } from "react-router-dom";
import logo from "../assets/logo_overwatch.png";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const passwordsMatch = password === confirmPassword && password.length > 0;

    // simple email validation (client-side)
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!emailValid) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!passwordsMatch) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const data = await register({ name, email, password });
            console.log("Registration successful:", data);
            window.location.href = "/login";
        } catch (err) {
            setError(err?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
            <main className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-md p-6">
                <header className="mb-4">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        <img src={logo} alt="Logo" className="w-64 h-64 object-contain mb-4" />
                    </div>
                    <h1 className="text-2xl font-semibold text-[var(--text)]">Create account</h1>
                    <p className="text-sm text-[var(--muted)] mt-1">Enter your details to register</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <label className="block">
                        <span className="text-xs text-[var(--muted)]">Name</span>
                        <input
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 w-full px-3 py-2 rounded-md bg-[var(--panel)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                            aria-label="Name"
                        />
                    </label>

                    <label className="block">
                        <div className="flex items-baseline justify-between">
                            <span className="text-xs text-[var(--muted)]">Email</span>
                            <span className="text-xs text-[var(--muted)]">{email.length > 0 ? (emailValid ? "Valid" : "Invalid") : ""}</span>
                        </div>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={`mt-1 w-full px-3 py-2 rounded-md bg-[var(--panel)] border ${email.length === 0 ? "border-[var(--border)]" : emailValid ? "border-green-400" : "border-red-400"} text-[var(--text)] focus:outline-none focus:ring-2 ${emailValid ? "focus:ring-[var(--accent)]" : "focus:ring-red-400"}`}
                            aria-label="Email"
                        />
                        {email.length > 0 && !emailValid && (
                            <p className="text-xs text-red-500 mt-1">Please enter a valid email address.</p>
                        )}
                    </label>

                    <label className="block">
                        <span className="text-xs text-[var(--muted)]">Password</span>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 w-full px-3 py-2 rounded-md bg-[var(--panel)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                            aria-label="Password"
                        />
                    </label>

                    <label className="block">
                        <span className="text-xs text-[var(--muted)]">Repeat password</span>
                        <input
                            type="password"
                            placeholder="Repeat password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className={`mt-1 w-full px-3 py-2 rounded-md bg-[var(--panel)] border ${passwordsMatch || confirmPassword.length === 0 ? "border-[var(--border)]" : "border-red-400"} text-[var(--text)] focus:outline-none focus:ring-2 ${passwordsMatch ? "focus:ring-[var(--accent)]" : "focus:ring-red-400"}`}
                            aria-label="Repeat password"
                        />
                    </label>

                    {!passwordsMatch && confirmPassword.length > 0 && (
                        <p className="text-sm text-red-500">Passwords do not match.</p>
                    )}

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            type="submit"
                            disabled={!passwordsMatch || !emailValid}
                            className={`w-full sm:w-auto btn-accent px-4 py-2 rounded-md font-semibold text-[var(--btn-text)] ${(!passwordsMatch || !emailValid) ? "opacity-60 cursor-not-allowed" : ""}`}
                        >
                            Register
                        </button>

                        <Link to="/login" className="text-sm text-[var(--muted)] hover:text-[var(--accent)] mt-2 sm:mt-0">
                            Already have an account? Log in
                        </Link>
                    </div>
                </form>
            </main>
        </div>
    );
}