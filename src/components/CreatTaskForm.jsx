import { useState } from "react";
import { createTask } from "../services/taskService";

export default function CreateTaskForm({ onTaskCreated }) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [priority, setPriority] = useState("medium");
    const [tagsInput, setTagsInput] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        if (!title.trim()) {
            alert("Title is required");
            return;
        }

        const parsedTags = tagsInput
            ? tagsInput.split(",").map(tag => tag.trim()).filter(Boolean)
            : null;

        const taskData = {
            title,
            date: date ? new Date(date).toISOString() : null,
            priority,
            tags: parsedTags,
            userId: localStorage.getItem("user_id") || null,
        };

        try {
            const data = await createTask(taskData);
            onTaskCreated(data);
            setTitle("");
            setDate("");
            setPriority("medium");
            setTagsInput("");
        } catch (error) {
            console.error("Error creating task:", error?.message || error);
            alert("Failed to create task. Please try again.");
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-3 p-3 bg-[var(--panel)] border border-[var(--border)] rounded-lg shadow-md"
        >
            {/* Title input full-width (mobile-first) */}
            <label className="sr-only" htmlFor="task-title">Task title</label>
            <input
                id="task-title"
                type="text"
                aria-label="Task title"
                placeholder="Enter a new task..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent outline-none text-[var(--text)] placeholder-[var(--muted)] px-3 py-3 rounded-md border border-transparent focus:border-[var(--accent)] transition"
                required
            />

            {/* compact controls: date + priority + tags */}
            <div className="w-full grid grid-cols-1 gap-2 md:grid-cols-4 md:items-center">
                <div className="md:col-span-1">
                    <label className="sr-only" htmlFor="task-date">Data</label>
                    <input
                        id="task-date"
                        type="date"
                        aria-label="Date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-[var(--card)] border border-[var(--border)] text-[var(--text)]"
                    />
                </div>

                <div className="md:col-span-1">
                    <label className="sr-only" htmlFor="task-priority">Priority</label>
                    <select
                        id="task-priority"
                        aria-label="Priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-[var(--card)] border border-[var(--border)] text-[var(--text)]"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="sr-only" htmlFor="task-tags">TAGs</label>
                    <input
                        id="task-tags"
                        type="text"
                        aria-label="Tags"
                        placeholder="Tags (comma separated)"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-[var(--card)] border border-[var(--border)] text-[var(--text)]"
                    />
                </div>
            </div>

            {/* actions */}
            <div className="w-full flex flex-col-reverse gap-2 md:flex-row md:justify-end md:items-center">
                <button
                    type="button"
                    onClick={() => { setTitle(""); setDate(""); setPriority("medium"); setTagsInput(""); }}
                    className="w-full md:w-auto px-4 py-3 rounded-md border border-[var(--border)] text-[var(--text)] hover:bg-[var(--panel)] transition"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    aria-label="Add task"
                    className="w-full md:w-auto flex items-center justify-center gap-2 font-semibold px-4 py-3 rounded-md transition"
                    style={{ backgroundColor: "var(--accent)", color: "var(--btn-text)" }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ color: "inherit" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                    </svg>
                    <span>Task</span>
                </button>
            </div>
        </form>
    );
}