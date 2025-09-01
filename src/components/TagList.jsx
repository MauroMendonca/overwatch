import {  useEffect } from "react";

export default function TagList({ tags = [] }) {
    useEffect(() => {
        const map = {};
        tags.forEach(tag => {
            if (tag.name && !map[tag.name]) {
                map[tag.name] = {
                    ...tag,
                    emoji: tag.name.charAt(0).toUpperCase()
                };
            }
        });    
    }, [tags]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tags.map((tag, index) => (
                <div key={index} className="flex items-center justify-between p-2 border border-[var(--border)] rounded-md bg-[var(--bg)]">
                    <span>{tag.emoji}</span>
                    <span className="text-[var(--text)]">{tag.name}</span>
                    <button className="text-red-500 hover:text-red-700 transition">Remover</button>
                </div>
            ))}
        </div>
    );
}

