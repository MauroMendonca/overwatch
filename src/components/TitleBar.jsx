import React, { useState, useRef, useEffect } from "react";
import ThemeToggle from './ThemeToggle';

export default function TitleBar({ user, onLogout }) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    return (
        <header className="w-full bg-[var(--panel)] px-6 py-3 flex items-center justify-between shadow-md fixed top-0 left-0 z-50 border-b border-[var(--border)]">
            <div className="text-xl font-bold text-[var(--text)]">OverWatch</div>

            <div className="flex items-center gap-4">
                <ThemeToggle />

                <div className="relative" ref={wrapperRef}>
                    <button
                        onClick={() => setOpen((v) => !v)}
                        aria-haspopup="true"
                        aria-expanded={open}
                        className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[var(--card)] hover:bg-[var(--panel)] text-[var(--text)] border border-[var(--border)] transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--text)]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" />
                            <path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4v1H4v-1z" />
                        </svg>
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-2 w-64 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg p-4 text-[var(--text)] z-50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-[var(--panel)] flex items-center justify-center text-[var(--text)]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" />
                                        <path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4v1H4v-1z" />
                                    </svg>
                                </div>

                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-[var(--text)]">{user?.name || "Usuário"}</div>
                                    <div className="text-xs text-[var(--muted)]">{user?.email || "email@exemplo.com"}</div>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => { setOpen(false); onLogout && onLogout(); }}
                                    className="px-3 py-1 rounded-lg font-semibold transition"
                                    style={{ backgroundColor: "var(--accent)", color: "var(--btn-text)" }}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}