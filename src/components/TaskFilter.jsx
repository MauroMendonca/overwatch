import { useState } from "react";

export default function TaskFilter({ onFilterChange }) {
    const [filter, setFilter] = useState("all");

    function handleFilterChange(e) {
        const newFilter = e.target.value;
        setFilter(newFilter);
        onFilterChange(newFilter);
    }

    return (
        <div className="mb-4">
            <select
                value={filter}
                onChange={handleFilterChange}
                className="px-3 py-2 rounded-md bg-[var(--panel)] border border-[var(--border)] text-[var(--text)]"
            >
                <option value="all">All Tasks</option>
                <option value="today">Today's Tasks</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
                <option value="done">Completed Tasks</option>
            </select>
        </div>
    );
}