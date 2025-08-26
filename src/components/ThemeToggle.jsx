import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const ctx = useTheme();

    // fallback leve enquanto Provider não estiver presente (não crashar)
    if (!ctx) {
        return (
            <button
                aria-hidden="true"
                className="p-2 rounded-full bg-[var(--card)] text-[var(--muted)] pointer-events-none"
                title="Theme toggle (disabled)"
            >
                <Sun className="w-5 h-5" />
            </button>
        );
    }

    const { theme, toggleTheme } = ctx;

    return (
        <button
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
            aria-pressed={theme === "dark"}
            className="p-2 rounded-full bg-[var(--card)] text-[var(--text)] hover:bg-[var(--panel)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
        >
            {theme === "light" ? (
                // show moon icon to indicate switching to dark
                <Moon className="w-5 h-5" />
            ) : (
                // show sun icon to indicate switching to light
                <Sun className="w-5 h-5" />
            )}
        </button>
    );
}