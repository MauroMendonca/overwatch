import { CheckCircle, Clock, ListTodo, CalendarCheck2, AlertCircle } from "lucide-react";

export default function InfoPanel({ stats }) {
    const panels = [
        { title: "Total de Tarefas", value: stats.total, icon: <ListTodo className="w-6 h-6 text-blue-500" /> },
        { title: "Pendentes", value: stats.pending, icon: <Clock className="w-6 h-6 text-yellow-500" /> },
        { title: "Concluídas", value: stats.completed, icon: <CheckCircle className="w-6 h-6 text-green-500" /> },
        { title: "Concluídas Hoje", value: stats.completedToday, icon: <CalendarCheck2 className="w-6 h-6 text-purple-500" /> },
        { title: "Atrasadas", value: stats.overdue, icon: <AlertCircle className="w-6 h-6 text-red-500" /> },
    ];

    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {panels.map((panel, index) => (
                <div
                    key={index}
                    className="bg-[var(--card)] rounded-xl p-4 shadow-md hover:shadow-lg transition flex flex-col items-center"
                >
                    <div className="mb-2">{panel.icon}</div>
                    <p className="text-sm font-medium text-[var(--muted)]">{panel.title}</p>
                    <h2 className="text-2xl font-bold text-[var(--text)]">{panel.value}</h2>
                </div>
            ))}
        </div>
    );
}
