import { useState, useEffect } from "react";

export default function TagList({ tags = [], onDelete, onEdit }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState(null);
    const [form, setForm] = useState({ name: "", emoji: "", color: "#ffffffff" });

    useEffect(() => {
        const map = {};
        tags.forEach(tag => {
            if (tag.name && !map[tag.name]) {
                map[tag.name] = {
                    ...tag,
                    emoji: tag.name.charAt(0).toUpperCase()
                };
            }
        });

        if (selectedTag) {
            setForm({
                name: selectedTag.name,
                emoji: selectedTag.emoji,
                color: selectedTag.color
            });
        }
    }, [selectedTag, tags]);

    const openModal = (tag) => {
        setSelectedTag(tag);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedTag(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onEdit && selectedTag) {
            onEdit(selectedTag._id, form);
        }
        closeModal();
    }

    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tags.map((tag, index) => (
                    <div
                        key={index}
                        style={{
                            border: `2px solid ${tag.color}`
                        }}
                        className="flex items-center justify-between p-2 border border-[var(--border)] rounded-md bg-[var(--bg)]"
                        onClick={() => openModal(tag)}
                    >
                        <span>{tag.emoji}</span>
                        <span className="text-[var(--text)]">{tag.name}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete && onDelete(tag._id);
                            }}
                            className="text-red-500 hover:text-red-700 transition">
                            Remover
                        </button>
                    </div>
                ))}
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[var(--panel)] p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-bold mb-4">Editar Tag</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Nome da tag"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="p-2 border border-[var(--border)] rounded-md bg-[var(--bg)] text-[var(--text)]"
                            />
                            <input
                                type="text"
                                placeholder="Emoji da tag"
                                value={form.emoji}
                                onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                                className="p-2 border border-[var(--border)] rounded-md bg-[var(--bg)] text-[var(--text)]"
                            />
                            <input
                                type="color"
                                value={form.color}
                                onChange={(e) => setForm({ ...form, color: e.target.value })}
                                className="w-12 h-12 p-0 border-0 rounded-md"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                                >Cancelar</button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-dark)] transition"
                                >Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}