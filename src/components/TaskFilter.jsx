import { useState } from "react";

export default function TaskFilter({ tags = [], onFilterChange }) {
    const [filter, setFilter] = useState("all");

    function handleFilterChange(e) {
        const newFilter = e.target.value;
        setFilter(newFilter);
        onFilterChange(newFilter);
    }

    return (
        <div className="mb-4">
            {/*<label className="mr-2 text-[var(--text)]">Filter by Priority:</label>
            <select
                value={filter}
                onChange={handleFilterChange}
                className="px-3 py-2 rounded-md bg-[var(--panel)] border border-[var(--border)] text-[var(--text)]"
            >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
            </select>*/}
            <label className="mr-2 text-[var(--text)]">Filter by Tag:</label>
            <select
                value={filter}
                onChange={handleFilterChange}
                className="px-3 py-2 rounded-md bg-[var(--panel)] border border-[var(--border)] text-[var(--text)]"
            >
                <option value="all">All Tags</option>
                {console.log("Available FilterTags:", tags)}
                {tags.map((tag) => (
                    <option key={tag} value={tag}>
                        {tag}
                    </option>
                ))}
            </select>
        </div>
    );
}