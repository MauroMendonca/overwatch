import TagList from "./TagList";

export default function TagContainer({ tags = [], onDelete }) {
    if (!tags || tags.length === 0) {
        return <p className="text-[var(--muted)]">No tags available.</p>;
    }

    return (
        <section className="w-full">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--text)]">Tags ({tags.length})</h2>
            </div>

            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
                <TagList 
                    tags={tags}
                    onDelete={onDelete}
                />
            </div>
        </section>
    );
}   