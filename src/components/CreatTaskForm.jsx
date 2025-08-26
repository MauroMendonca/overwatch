import React, { useState } from "react";
import { createTask } from "../services/taskService";
// ...existing code...

export default function CreateTaskForm({ onTaskCreated }) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [priority, setPriority] = useState("medium");
    const [tags, setTags] = useState([]);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!title.trim()) {
            alert("Title is required");
            return;
        }

        const taskData = {
            title,
            date: date ? new Date(date).toISOString() : null,
            priority,
            tags: tags.length > 0 ? tags : null,
            userId: localStorage.getItem("user_id") || null,
        };

        try {
            const data = await createTask(taskData);
            onTaskCreated(data);
            setTitle("");
            setDate("");
            setPriority("medium");
            setTags([]);
        } catch (error) {
            console.error("Error creating task:", error.message);
            alert("Failed to create task. Please try again.");
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 w-full bg-[var(--panel)] border border-[var(--border)] rounded-lg px-4 py-2 shadow-md"
        >
            <input
                type="text"
                aria-label="Título da tarefa"
                placeholder="Digite uma nova tarefa..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[var(--text)] placeholder-[var(--muted)] px-2 py-2"
                required
            />

            <input
                type="date"
                aria-label="Data"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-2 py-2 rounded-md bg-[var(--card)] border border-[var(--border)] text-[var(--text)]"
            />

            <select
                aria-label="Prioridade"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="px-2 py-2 rounded-md bg-[var(--card)] border border-[var(--border)] text-[var(--text)]"
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>

            <input
                type="text"
                aria-label="Categorias"
                placeholder="Tags (separadas por vírgula)"
                value={tags.join(", ")}
                onChange={(e) => setTags(e.target.value.split(",").map(tag => tag.trim()))}
                className="px-2 py-2 rounded-md bg-[var(--card)] border border-[var(--border)] text-[var(--text)]"
            />

            <button
                type="submit"
                aria-label="Adicionar tarefa"
                className="flex items-center gap-2 font-semibold px-4 py-2 rounded-lg transition"
                style={{ backgroundColor: "var(--accent)", color: "var(--btn-text)" }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ color: "inherit" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                </svg>
                Add
            </button>
        </form>
    );
}