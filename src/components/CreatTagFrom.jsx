import { useState } from "react";
import { createTag } from "../services/tagService";

export default function CreateTagForm({ onTagCreated }) {
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("");
    const [color, setColor] = useState("#ffffffff");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!name.trim()) {
            setError("Tag name is required");
            return;
        }
        setLoading(true);
        setError("");

        const tagData = { name: name.trim(), emoji: emoji, color };

        try {
            const newTag = await createTag(tagData);
            onTagCreated(newTag);
            setName("");
            setColor("#ffffffff");
            setEmoji("");
        } catch (err) {
            console.error("Failed to create tag. Please try again.", err?.message || err);
            setError("Failed to create tag. Please try again.", err?.message || err);
        } finally {
            setLoading(false);
        }
    }
    return (
        <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-4 p-4 bg-[var(--panel)] border border-[var(--border)] rounded-lg shadow-md"
        >
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex flex-col md:flex-row md:items-center gap-3">
                {/* TAG name */}
                <input
                    tabIndex={1}
                    type="text"
                    placeholder="TAG name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />

                {/* Emoji + color + button */}
                <div className="flex items-center gap-2">
                    <input
                        tabIndex={2}
                        type="text"
                        placeholder="😀"
                        value={emoji}
                        onChange={(e) => setEmoji(e.target.value)}
                        maxLength={2}
                        className="w-12 h-12 text-lg text-center border border-[var(--border)] rounded-md bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />

                    <input
                        tabIndex={3}
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-16 h-12 rounded-md cursor-pointer border border-[var(--border)]"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-2 bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-dark)] transition disabled:opacity-50"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                        </svg>
                        <span>TAG</span>
                    </button>
                </div>
            </div>
        </form>

    );
}