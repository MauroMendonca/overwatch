import { useEffect, useState } from "react";
import { getTasks, deleteTask, updateTask, toggleComplete, toggleImportant, getStats } from "../services/taskService";
import { fetchUser } from "../services/authService";
import { getTags } from "../services/tagService";
import CreateTaskForm from "../components/CreatTaskForm";
import TaskContainer from "../components/TaskContainer";
import TitleBar from "../components/TitleBar";
import { LayoutDashboard } from "lucide-react";
import TaskFilter from "../components/TaskFilter";
import InfoPanel from "../components/InfoPanel";

export default function Dashboard() {
    const token = localStorage.getItem("jwt_token");

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    const [availableTags, setAvailableTags] = useState([]);
    const [filter, setFilter] = useState("all");

    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        completed: 0,
        completedToday: 0,
        overdue: 0,
    });


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

        (async () => {
            try {
                const sts = await getStats();
                setStats(sts || []);

            } catch (error) {
                console.error("Failed to fetch stats:", error);
            }
        })();

    }, []);

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
            return prev.map(t => (t._id === taskId ? { ...t, important: importanted } : t));
        });

        try {
            const saved = await toggleImportant(taskId, { important: importanted });
            setTasks(prev => prev.map(t => (t._id === saved._id ? saved : t)));
        } catch (err) {
            setTasks(previous);
            setError(err.message || "Failed to update task imprtance");
            console.error("updateTask (important) failed:", err);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("jwt_token");
        window.location.href = "/login";
    };

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

    if (!token) {
        window.location.href = "/login";
        return null;
    }

    if (loading) return <p className="text-[var(--muted)]">Loading tasks...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-6 pt-20">
            <TitleBar user={user} onLogout={handleLogout} />
            <div className="space-y-4">
                <h1 className="text-3xl font-bold mb-4 inline-flex items-center gap-2">
                    <LayoutDashboard className="w-6 h-6" />
                    Dashboard
                </h1>
                <InfoPanel stats={stats} />
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