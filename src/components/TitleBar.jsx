import React, { useState, useRef, useEffect } from "react";
import ThemeToggle from './ThemeToggle';
import logoMini from "../assets/logo_overwatch_mini.png";
// ...existing code...

export default function TitleBar({ user, onLogout }) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const drawerRef = useRef(null); // <--- novo: ref para o drawer mobile

    useEffect(() => {
        function handleOutside(e) {
            // se o click aconteceu dentro do menu desktop (wrapperRef) ou do drawer mobile (drawerRef), não fecha
            if (wrapperRef.current && wrapperRef.current.contains(e.target)) return;
            if (drawerRef.current && drawerRef.current.contains(e.target)) return;
            // caso contrário fecha
            setOpen(false);
        }
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    return (
        <header className="w-full bg-[var(--panel)] px-4 py-3 flex items-center justify-between shadow-md fixed top-0 left-0 z-50 border-b border-[var(--border)]">
            {/* left: hamburger (mobile) + logo + title */}
            <div className="flex items-center gap-3">
                {/* hamburger: visible only on small screens */}
                <button
                    onClick={() => setOpen(true)}
                    className="md:hidden p-2 rounded-lg hover:bg-[var(--card)] text-[var(--text)] border border-transparent hover:border-[var(--border)] transition"
                    aria-label="Abrir menu"
                >
                    <span className="text-lg">☰</span>
                </button>

                <img src={logoMini} alt="Logo" className="w-8 h-8 object-contain" />

                {/* app title: compact on mobile, larger on md+ */}
                <div className="text-sm md:text-xl font-bold text-[var(--text)] truncate">OverWatch</div>
            </div>

            {/* right: theme toggle + user/menu */}
            <div className="flex items-center gap-3">
                <ThemeToggle />

                {/* desktop user button */}
                <div className="relative hidden md:block" ref={wrapperRef}>
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
                                    className="px-3 py-1 rounded-lg font-semibold btn-accent"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* mobile user/avatar button: visible only on small screens */}
                <div className="md:hidden">
                    <button
                        onClick={() => setOpen(true)}
                        aria-label="Abrir usuário"
                        className="p-2 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--text)]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" />
                            <path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4v1H4v-1z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile drawer / overlay (mobile-first) */}
            {open && (
                <div className="fixed inset-0 z-40 md:hidden" aria-hidden="true">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setOpen(false)}
                    />
                    <aside ref={drawerRef} className="absolute left-0 top-0 h-full w-72 bg-[var(--card)] border-r border-[var(--border)] p-4 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <img src={logoMini} alt="Logo" className="w-8 h-8 object-contain" />
                            <div>
                                <div className="text-sm font-semibold text-[var(--text)]">{user?.name || "Usuário"}</div>
                                <div className="text-xs text-[var(--muted)]">{user?.email || "email@exemplo.com"}</div>
                            </div>
                        </div>

                        <nav className="flex flex-col gap-2">
                            <button
                                onClick={() => { setOpen(false); onLogout && onLogout(); }}
                                className="w-full text-left px-3 py-2 rounded-md btn-accent"
                            >
                                Logout
                            </button>

                            {/* add other mobile nav/actions here if needed */}
                        </nav>

                        <div className="mt-4">
                            <ThemeToggle />
                        </div>
                    </aside>
                </div>
            )}
        </header>
    );
}
// ...existing code...