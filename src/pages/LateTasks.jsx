import React, { useEffect, useState } from 'react';
import TitleBar from "../components/TitleBar";
import CreateTaskForm from "../components/CreatTaskForm";
import { getTasks, deleteTask, updateTask, toggleComplete, toggleImportant } from "../services/taskService";
import { fetchUser } from "../services/authService";
import { getTags  } from "../services/tagService";
import { ClockAlert } from 'lucide-react';
import TaskFilter from '../components/TaskFilter';
import TaskContainer from '../components/TaskContainer';

export default function LateTasks() {
    const token = localStorage.getItem("jwt_token");

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    const [availableTags, setAvailableTags] = useState([]);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        async function fetchTasks() {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const formatedDate = `${year}-${month}-${day}`;

            try {
                const data = await getTasks({ done: false, starDate: "1900-01-01", endDate: formatedDate, sort: "date", order: "asc" });
                setTasks(data || []);
            } catch (err) {
                setError(err.message || "Failed to fetch tasks.");
            } finally {
                setLoading(false);
            }
        }
        fetchTasks();

        (async () => {
            try {
                const u = await fetchUser();
                setUser(u || null);
            } catch (err) {
                console.error("Failed to fetch user data:", err);
            }
        })();

        (async () => {
            try {
                const tags = await getTags();
                setAvailableTags(tags || []);
            } catch (err) {
                console.error("Failed to fetch tags:", err);
            }
        })();

    }, []);

    if (!token) {
        window.location.href = "/login";
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem("jwt_token");
        window.location.href = "/login";
    };

    const handleTaskCreated = (newTask) => {
        setTasks((prevTasks) => [newTask, ...prevTasks]);
    };

    const handleTaskDeleted = async (taskId) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        await deleteTask(taskId);
    };

    const handleTaskUpdated = async (updatedTask) => {
        if (!updatedTask || !updatedTask._id) return;
        let previous = null;
        setTasks((prev) => {
            previous = prev;
            return prev.map((task) => (task._id === updatedTask._id ? updatedTask : task));
        });

        try {
            const saved = await updateTask(updatedTask._id, updatedTask);
            setTasks((prev) => prev.map((t) => (t._id === saved._id ? saved : t)));
        } catch (err) {
            setTasks(previous);
            setError(err.message || "Failed to update task");
            console.error("updateTask failed:", err);
        }
    };

    const handleToggleComplete = async (taskId, completed) => {
        let previous = null;
        setTasks(prev => {
            previous = prev;
            return prev.map(t => (t._id === taskId ? { ...t, done: completed } : t));
        });

        try {
            const saved = await toggleComplete(taskId, { done: completed });
            setTasks(prev => prev.map(t => (t._id === saved._id ? saved : t)));
        } catch (err) {
            setTasks(previous);
            setError(err.message || "Failed to update task completion");
            console.error("updateTask (complete) failed:", err);
        }
    }

    const handleToggleImportant = async (taskId, importanted) => {
        let previous = null;
        setTasks(prev => {
            previous = prev;
            return prev.map(t => (t._id === taskId ? { ...t, important: importanted} : t));
        });

        try {
            const saved = await toggleImportant(taskId, {important: importanted});
            setTasks(prev => prev.map(t => (t._id === saved._id ? saved : t)));
        } catch (err) {
            setTasks(previous);
            setError(err.message || "Failed to update task imprtance");
            console.error("updateTask (important) failed:", err);
        }
    }

    const filteredTasks = filter === "all" ? tasks : tasks.filter(t => {
        if (["high", "medium", "low"].includes(filter)) {
            return t.priority === filter;
        }
        if (filter === "today") {
            const today = new Date();
            const taskDate = new Date(t.dueDate);
            return taskDate.toDateString() === today.toDateString();
        }
        return t.tags && t.tags.includes(filter);
    });

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-6 pt-20">
            <TitleBar user={user} onLogout={handleLogout} />
            <div className="space-y-4">
                <h1 className="text-3xl font-bold mb-4 inline-flex items-center gap-2">
                    <ClockAlert className="w-6 h-6" />
                    Late Tasks
                </h1>
                {error && <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">{error}</div>}
                <CreateTaskForm onTaskCreated={handleTaskCreated} />
                <TaskFilter tags={availableTags.map(t => t.name)} onFilterChange={setFilter} />
                <TaskContainer
                    tasks={filteredTasks}
                    onDelete={handleTaskDeleted}
                    onUpdate={handleTaskUpdated}
                    onToggleComplete={handleToggleComplete}
                    onToggleImportant={handleToggleImportant}
                />
            </div>
        </div>
    );
}