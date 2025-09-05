import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from './ThemeToggle';
import logoMini from "../assets/logo_overwatch_mini.png";
import { Bolt, SunMedium, LayoutDashboard, ClockAlert  } from "lucide-react"

export default function TitleBar({ user, onLogout }) {
    const [open, setOpen] = useState(false); // user menu / desktop menu toggle
    const [sidebarOpen, setSidebarOpen] = useState(false); // navigation sidebar
    const wrapperRef = useRef(null);
    const drawerRef = useRef(null);
    const hamburgerRef = useRef(null);

    useEffect(() => {
        function handleOutside(e) {
            const target = e.target;
            if (wrapperRef.current && wrapperRef.current.contains(target)) return;
            if (drawerRef.current && drawerRef.current.contains(target)) return;
            if (hamburgerRef.current && hamburgerRef.current.contains(target)) return;
            // close both menus if clicked outside
            setOpen(false);
            setSidebarOpen(false);
        }
        document.addEventListener("click", handleOutside);
        return () => document.removeEventListener("click", handleOutside);
    }, []);

    const NavLink = ({ to, label, icon }) => (
        <Link
            to={to}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[var(--panel)] transition text-[var(--text)]"
            onClick={() => setSidebarOpen(false)}
        >
            <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
            {/* Alterado para exibir no mobile também */}
            <span className="inline">{label}</span>
        </Link>
    );

    return (
        <>
            {/* Left collapsible sidebar: mobile off-canvas + desktop collapsible */}
            {/* Mobile off-canvas */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-60 md:hidden" aria-hidden="true">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setSidebarOpen(false)}
                    />
                    {/* place drawer below header: top-14 (header height) and bottom-0 so content isn't hidden behind titlebar */}
                    <aside
                        className="absolute left-0 top-14 bottom-0 w-72 bg-[var(--card)] border-r border-[var(--border)] p-4 shadow-xl z-60"
                        ref={drawerRef}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <img src={logoMini} alt="Logo" className="w-8 h-8 object-contain" />
                            <div>
                                <div className="text-sm font-semibold text-[var(--text)]">
                                    {user?.name || "User"}
                                </div>
                                <div className="text-xs text-[var(--muted)]">{user?.email || ""}</div>
                            </div>
                        </div>

                        <nav className="flex flex-col gap-1">
                            <NavLink
                                to="/dashboard"
                                label="Dashboard"
                                icon={<LayoutDashboard className="w-5 h-5" />}
                            />
                            <NavLink
                                to="/myday"
                                label="My Day"
                                icon={<SunMedium className="w-5 h-5" />}
                            />
                            <NavLink
                                to="/settings"
                                label="Settings"
                                icon={<Bolt className="w-5 h-5" />}
                            />
                            <NavLink
                                to="/latetasks"
                                label="Late Tasks"
                                icon={<ClockAlert className="w-5 h-5" />}
                            />
                        </nav>

                        <div className="mt-6">
                            <button
                                onClick={() => {
                                    setSidebarOpen(false);
                                    onLogout && onLogout();
                                }}
                                className="w-full text-left px-3 py-2 rounded-md btn-accent"
                            >
                                Logout
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* Desktop sidebar: render only when sidebarOpen so menu "sumir" when closed */}
            {sidebarOpen && (
                <aside className="hidden md:flex md:flex-col md:fixed md:top-0 md:left-0 md:h-full z-30 bg-[var(--card)] border-r border-[var(--border)] transition-all md:w-56">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center gap-3 p-3">
                            <img src={logoMini} alt="Logo" className="w-8 h-8 object-contain" />
                            <div className="text-sm font-bold text-[var(--text)]">OverWatch</div>
                        </div>

                        <nav className="flex-1 px-1 space-y-1">
                            <NavLink
                                to="/dashboard"
                                label="Dashboard"
                                icon={<LayoutDashboard className="w-5 h-5" />}
                            />
                            <NavLink
                                to="/myday"
                                label="My Day"
                                icon={<SunMedium className="w-5 h-5" />}
                            />
                            <NavLink
                                to="/settings"
                                label="Settings"
                                icon={<Bolt className="w-5 h-5" />}
                            />
                            <NavLink
                                to="/latetasks"
                                label="Late Tasks"
                                icon={<ClockAlert className="w-5 h-5" />}
                            />
                        </nav>

                        <div className="p-3">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="p-2 rounded-md hover:bg-[var(--panel)] transition text-[var(--text)]"
                                    aria-label="Close sidebar"
                                >
                                    «
                                </button>
                                <button
                                    onClick={() => onLogout && onLogout()}
                                    className="ml-auto px-3 py-2 rounded-md btn-accent"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            )}

            {/* Header */}
            <header
                className={`h-14 w-full bg-[var(--panel)] px-4 py-3 flex items-center justify-between shadow-md fixed top-0 left-0 z-50 border-b border-[var(--border)] ${sidebarOpen ? "md:pl-[14rem]" : "md:pl-16"
                    }`}
            >
                {/* left: mobile hamburger (open sidebar on mobile) + logo + title */}
                <div className="flex items-center gap-3">
                    {/* mobile/desktop: toggle navigation */}
                    <button
                        ref={hamburgerRef}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSidebarOpen((s) => !s);
                        }}
                        className="p-2 rounded-lg hover:bg-[var(--card)] text-[var(--text)] border border-transparent hover:border-[var(--border)] transition"
                        aria-label="Toggle navigation"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
                        </svg>
                    </button>

                    <img src={logoMini} alt="Logo" className="w-8 h-8 object-contain" />

                    <div className="text-sm md:text-xl font-bold text-[var(--text)] truncate">OverWatch</div>
                </div>

                {/* right: theme toggle + user/menu */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    <div className="relative hidden md:block" ref={wrapperRef}>
                        <button
                            onClick={() => setOpen((v) => !v)}
                            aria-haspopup="true"
                            aria-expanded={open}
                            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[var(--card)] hover:bg-[var(--panel)] text-[var(--text)] border border-[var(--border)] transition"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-[var(--text)]"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" />
                                <path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4v1H4v-1z" />
                            </svg>
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-64 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg p-4 text-[var(--text)] z-50">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-[var(--panel)] flex items-center justify-center text-[var(--text)]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" />
                                            <path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4v1H4v-1z" />
                                        </svg>
                                    </div>

                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-[var(--text)]">{user?.name || "User"}</div>
                                        <div className="text-xs text-[var(--muted)]">{user?.email || ""}</div>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => {
                                            setOpen(false);
                                            onLogout && onLogout();
                                        }}
                                        className="px-3 py-1 rounded-lg font-semibold btn-accent"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* mobile user/avatar button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setOpen(true)}
                            aria-label="Open user"
                            className="p-2 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--text)]"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" />
                                <path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4v1H4v-1z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
}