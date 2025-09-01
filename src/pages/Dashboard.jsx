import { useEffect, useState } from "react";
import { getTasks, deleteTask, updateTask, toggleComplete } from "../services/taskService";
import { fetchUser } from "../services/authService";
import CreateTaskForm from "../components/CreatTaskForm";
import TaskContainer from "../components/TaskContainer";
import TitleBar from "../components/TitleBar";
import { LayoutDashboard } from "lucide-react";

export default function Dashboard() {
    const token = localStorage.getItem("jwt_token");

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);

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

    const handleLogout = () => {
        localStorage.removeItem("jwt_token");
        window.location.href = "/login";
    };

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
                <CreateTaskForm onTaskCreated={handleTaskCreated} />
                <TaskContainer
                    tasks={tasks}
                    onDelete={handleTaskDeleted}
                    onUpdate={handleTaskUpdated}
                    onToggleComplete={handleToggleComplete}
                />
            </div>
        </div>
    );
}