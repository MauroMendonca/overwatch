import { useState, useEffect } from 'react';
import TitleBar from "../components/TitleBar";
import TaskList from "../components/TaskList";
import { getTasks, deleteTask, updateTask, toggleComplete, toggleImportant } from "../services/taskService";
import { fetchUser } from "../services/authService";
import { getTags } from "../services/tagService";
import CreateTaskForm from "../components/CreatTaskForm";
import { Inbox } from 'lucide-react';
import TaskFilter from '../components/TaskFilter';
import TaskContainer from '../components/TaskContainer';

export default function InboxPage() {
    const token = localStorage.getItem("jwt_token");
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    const [availableTags, setAvailableTags] = useState([]);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        async function fetchTasks() {
            try {
                const data = await getTasks({ done: false, sort: "date", order: "desc" });
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

    const filteredTasks = filter === "all" ? tasks.filter(t => { return !t.date; }) : tasks.filter(t => {
        return t.tags && t.tags.includes(filter) && !t.date;
    });

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
            await updateTask(updatedTask._id, updatedTask);
        } catch (err) {
            console.error("Failed to update task:", err);
            if (previous) setTasks(previous);
        }
    };

    const handleToggleComplete = async (taskId, completed) => {
        let previous = null;
        setTasks(prev => {
            previous = prev;
            return prev.map(t => t._id === taskId ? { ...t, done: completed } : t);
        });

        try {
            await toggleComplete(taskId, { done: completed });
        } catch (err) {
            console.error("Failed to toggle task completion:", err);
            if (previous) setTasks(previous);
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

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-6 pt-20">
            <TitleBar user={user} onLogout={handleLogout} />
            <div className="space-y-4">
                <h1 className="text-3xl font-bold mb-4 inline-flex items-center gap-2">
                    <Inbox className="w-6 h-6" />
                    Inbox
                </h1>
                <CreateTaskForm onTaskCreated={handleTaskCreated} availableTags={availableTags} />
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