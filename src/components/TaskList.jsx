import { useState, useEffect } from "react";
import { getTags } from "../services/tagService";
import { Star, StarOff } from "lucide-react";

export default function TaskList({ tasks = [], onDelete, onUpdate, onToggleComplete, onToggleImportant }) {
    const [selectedTask, setSelectedTask] = useState(null);
    const [completedMap, setCompletedMap] = useState({});
    const [importMap, setImportantMap] = useState({});
    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        const map = {};
        (tasks || []).forEach(t => {
            map[t._id] = !!t.done;
        });
        setCompletedMap(map);

        (async () => {
            try {
                const tags = await getTags();
                setAvailableTags(tags || []);
            } catch (err) {
                console.error("Failed to fetch tags:", err);
            }
        })();

    }, [tasks]);

    function enrichTags(taskTags) {
        if (!taskTags || taskTags.length === 0) return [];
        return taskTags.map(tagName => {
            const tag = availableTags.find(t => t.name === tagName);
            return tag ? { ...tag } : { name: tagName, color: "#cccccc", emoji: '' };
        });
    }

    function toggleComplete(taskId, value) {
        setCompletedMap(prev => ({ ...prev, [taskId]: value }));

        const task = (tasks || []).find(t => t._id === taskId);

        if (onToggleComplete) {
            try {
                onToggleComplete(taskId, value, { title: task?.title || "" });
            } catch (err) {
                setCompletedMap(prev => ({ ...prev, [taskId]: !value }));
                console.error("onToggleComplete failed:", err);
            }
        }
    }

    function toggleImportant(taskId, value) {
        setImportantMap(prev => ({ ...prev, [taskId]: value }));

        const task = (tasks || []).find(t => t._id === taskId);

        if (onToggleImportant) {
            try {
                onToggleImportant(taskId, value);
            } catch (err) {
                setImportantMap(prev => ({ ...prev, [taskId]: !value }));
                console.error("onToggleImportant failed:", err);
            }
        }
    }

    const priorityClasses = {
        high: "bg-red-500 text-white",
        medium: "bg-yellow-400 text-black",
        low: "bg-blue-500 text-white",
    };

    function formatDateForInput(date) {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'UTC'
        };

        const formattedDate = date
            ? new Date(date).toLocaleDateString('en-CA', options)
            : "";

        if (!date) return "";
        return formattedDate;
    }

    async function handleSaveEdited(e) {
        e.preventDefault();
        if (!selectedTask) return;

        const updated = {
            ...selectedTask,
            tags: typeof selectedTask.tags === "string"
                ? selectedTask.tags.split(",").map(t => t.trim()).filter(Boolean)
                : selectedTask.tags,
        };

        if (onUpdate) await onUpdate(updated);
        setSelectedTask(null);
    }

    return (
        <div className="w-full">
            {tasks.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">No tasks available.</p>
            ) : (<ul className="space-y-3">
                {tasks.map((task) => {
                    const completed = completedMap.hasOwnProperty(task._id)
                        ? completedMap[task._id]
                        : !!task.done;

                    const formattedDate = task.date
                        ? new Date(task.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                        : "No date";

                    return (
                        <li
                            key={task._id}
                            onClick={() => setSelectedTask({ ...task, tags: Array.isArray(task.tags) ? task.tags.join(", ") : (task.tags || "") })}
                            className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-3 rounded-lg border p-4 hover:shadow-md"
                        >
                            {/* Left col checkbox + star */}
                            <div className="flex flex-row md:flex-col items-center gap-2 h-full" onClick={(e) => e.stopPropagation()}>
                                {/* checkbox */}
                                <input
                                    type="checkbox"
                                    checked={completed}
                                    onChange={(e) => { e.stopPropagation(); toggleComplete(task._id, e.target.checked); }}
                                    className="h-6 w-6 rounded focus:ring-2 focus:ring-[var(--accent)] border-gray-300 text-indigo-600"
                                    style={{ accentColor: "var(--accent)" }}
                                    aria-label={`Marcar ${task.title} como concluída`}
                                />

                                {/* star */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleImportant(task._id, !task.important);
                                    }}
                                    className="text-yellow-500 hover:text-yellow-600"
                                    aria-label="Marcar como importante"
                                >
                                    {task.important ? (
                                        <Star className="w-6 h-6 fill-yellow-500" />
                                    ) : (
                                        <StarOff className="w-6 h-6" />
                                    )}
                                </button>

                            </div>

                            {/* midle col task title priority and tags */}
                            <div className="flex-1 min-w-0">
                                {/* title*/}
                                <h3
                                    className={`text-sm font-medium break-words whitespace-normal ${completed ? "line-through opacity-60" : ""}`}
                                    style={{ color: "var(--text)" }}
                                >
                                    {task.title}
                                </h3>
                                <div className="mt-1 text-xs text-[var(--muted)]">{task.description || ""}</div>

                                {/* priority + tags*/}
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <span
                                        className={`text-xs font-semibold px-2 py-1 rounded-full ${priorityClasses[task.priority || "medium"]}`}
                                    >
                                        {task.priority ? task.priority.toUpperCase() : "MEDIUM"}
                                    </span>
                                    {enrichTags(task.tags).length > 0 ? (
                                        enrichTags(task.tags).map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="text-xs px-2 py-1 rounded-full bg-[var(--card)] text-[var(--text)]"
                                                style={{ border: `1px solid ${tag.color || "#cccccc"}` }}
                                            >
                                                {tag.emoji ? `${tag.emoji} ` : ""}{tag.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs px-2 py-1 rounded-full bg-transparent text-[var(--muted)]">
                                            sem categorias
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* right: date + actions (stacked on mobile, inline on md) */}
                            <div className="w-full md:w-auto flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3 mt-2 md:mt-0">
                                <div className="text-xs text-[var(--muted)] md:text-right">{formattedDate}</div>

                                <div className="flex md:flex-col items-center gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete && onDelete(task._id); }}
                                        className="w-full md:w-auto text-sm px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition"
                                        aria-label={`Deletar ${task.title}`}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
            )}

            {/* edit modal/drawer (non blocking) */}
            {selectedTask && (
                <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50 p-4">
                    <div
                        className="absolute inset-0 bg-black bg-opacity-40"
                        onClick={() => setSelectedTask(null)}
                    />
                    <form
                        onSubmit={handleSaveEdited}
                        className="relative pointer-events-auto bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 w-full max-w-lg shadow-lg z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Edit task</h3>
                            <button type="button" onClick={() => setSelectedTask(null)} className="text-[var(--text)] hover:text-red-400">✕</button>
                        </div>

                        <label className="block text-xs mb-1" style={{ color: "var(--text)" }}>Title</label>
                        <input
                            className="w-full px-3 py-2 rounded-md bg-[var(--panel)] border border-[var(--border)] text-[var(--text)] mb-3"
                            value={selectedTask.title}
                            onChange={(e) => setSelectedTask((s) => ({ ...s, title: e.target.value }))}
                            required
                        />

                        <label className="block text-xs mb-1 mt-3" style={{ color: "var(--text)" }}>Description</label>
                        <textarea
                            className="w-full px-3 py-2 rounded-md bg-[var(--panel)] border border-[var(--border)] text-[var(--text)] mb-3"
                            rows={3}
                            value={selectedTask.description || ""}
                            onChange={(e) =>
                                setSelectedTask((s) => ({ ...s, description: e.target.value }))
                            }
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs mb-1" style={{ color: "var(--text)" }}>priority</label>
                                <select
                                    className="w-full px-2 py-2 rounded-md bg-[var(--panel)] border border-[var(--border)] text-[var(--text)]"
                                    value={selectedTask.priority || "medium"}
                                    onChange={(e) => setSelectedTask((s) => ({ ...s, priority: e.target.value }))}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs mb-1" style={{ color: "var(--text)" }}>Date</label>
                                <input
                                    type="date"
                                    className="w-full px-2 py-2 rounded-md bg-[var(--panel)] border border-[var(--border)] text-[var(--text)]"
                                    value={formatDateForInput(selectedTask.date)}
                                    onChange={(e) => setSelectedTask((s) => ({ ...s, date: e.target.value ? new Date(e.target.value).toISOString() : null }))}
                                />
                            </div>
                        </div>

                        <label className="block text-xs mt-3 mb-1" style={{ color: "var(--text)" }}>TAGs (comma separated)</label>
                        <input
                            className="w-full px-3 py-2 rounded-md bg-[var(--panel)] border border-[var(--border)] text-[var(--text)]"
                            value={selectedTask.tags}
                            onChange={(e) => setSelectedTask((s) => ({ ...s, tags: e.target.value }))}
                        />

                        <div className="flex flex-col-reverse md:flex-row justify-end mt-4 gap-2">
                            <button
                                type="button"
                                onClick={() => setSelectedTask(null)}
                                className="w-full md:w-auto px-4 py-2 rounded-md border border-[var(--border)] text-[var(--text)] hover:bg-[var(--panel)] transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full md:w-auto px-4 py-2 rounded-md text-black font-semibold transition"
                                style={{ backgroundColor: "var(--accent)" }}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}