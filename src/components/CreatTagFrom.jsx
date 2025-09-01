import { useState } from "react";
import { createTag } from "../services/tagService";

export default function CreateTagForm({ onTagCreated }) {
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("");
    const [color, setColor] = useState("#ffffffff");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    // Placeholder function for creating a tag
    /*async function createTag(tagData) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => resolve({ id: Date.now(), ...tagData }), 1000);
        });
    }*/
    async function handleSubmit(e) {
        e.preventDefault();
        if (!name.trim()) {
            setError("Tag name is required");
            return;
        }
        setLoading(true);
        setError("");

        const tagData = { name: name.trim(), emoji: emoji, color };
        console.log("Creating tag with data:", tagData);
        try {
            const newTag = await createTag(tagData);
            onTagCreated(newTag);
            setName("");
            setColor("#ffffffff");
        } catch (err) {
            console.error("Failed to create tag. Please try again.", err?.message || err);
            setError("Failed to create tag. Please try again.", err?.message || err);
        } finally {
            setLoading(false);
        }
    }
    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 p-3 bg-[var(--panel)] border border-[var(--border)] rounded-lg shadow-md">
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex flex-col md:flex-row md:items-center gap-2">
                <input tabIndex={1} type="text" placeholder="Nome da tag" value={name} onChange={(e) => setName(e.target.value)} className="flex-1 p-2 border border-[var(--border)] rounded-md bg-[var(--bg)] text-[var(--text)]" />
                <input tabIndex={2} type="text" placeholder="Emoji da tag" className="w-12 h-12 p-2 border border-[var(--border)] rounded-md text-center bg-[var(--bg)] text-[var(--text)] cursor-not-allowed" value={emoji} onChange={(e) => setEmoji(e.target.value)}/>
                <input tabIndex={3} type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-12 p-0 border-0 rounded-md" />
                <button type="submit" disabled={loading} className="px-4 py-2 bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-dark)] transition disabled:opacity-50">   {loading ? "Adicionando..." : "Adicionar Tag"}</button>
            </div>
        </form>
    );
}