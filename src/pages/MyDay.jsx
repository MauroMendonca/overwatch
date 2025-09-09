import React, { useEffect, useState } from 'react';
import { getTasks, deleteTask, updateTask, toggleComplete, toggleImportant } from "../services/taskService";
import TitleBar from "../components/TitleBar";
import { fetchUser } from "../services/authService";
import CreateTaskForm from "../components/CreatTaskForm";
import TaskContainer from "../components/TaskContainer";
import { SunMedium } from "lucide-react";

export default function MyDay() {
    const token = localStorage.getItem("jwt_token");

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchTasks() {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const tYear = tomorrow.getFullYear();
            const tMonth = String(tomorrow.getMonth() + 1).padStart(2, '0');
            const tDay = String(tomorrow.getDate()).padStart(2, '0');

            const formatedDate = `${year}-${month}-${day}`;
            const formatedTomorow = `${tYear}-${tMonth}-${tDay}`;

            try {
                const data = await getTasks({ starDate: formatedDate, endDate: formatedTomorow, sort: "date", order: "desc" });
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

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-6 pt-20">
            <TitleBar user={user} onLogout={handleLogout} />
            <div className="space-y-4">
                <h1 className="text-3xl font-bold mb-4 inline-flex items-center gap-2">
                    <SunMedium className="w-6 h-6" />
                    My Day
                </h1>
                {error && <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">{error}</div>}
                <CreateTaskForm onTaskCreated={handleTaskCreated} />
                <TaskContainer
                    tasks={tasks}
                    onDelete={handleTaskDeleted}
                    onUpdate={handleTaskUpdated}
                    onToggleComplete={handleToggleComplete}
                    onToggleImportant={handleToggleImportant}
                />
            </div>
        </div>
    );
}