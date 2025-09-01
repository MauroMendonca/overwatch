import TaskList from "./TaskList";

export default function TaskContainer({ tasks = [], onDelete, onUpdate, onToggleComplete }) {
    if (!tasks || tasks.length === 0) {
        return <p className="text-[var(--muted)]">No tasks available.</p>;
    }

    return (
        <section className="w-full">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--text)]">Tasks ({tasks.length})</h2>
            </div>

            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
                <TaskList
                    tasks={tasks}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    onToggleComplete={onToggleComplete}
                />
            </div>
        </section>
    );
}