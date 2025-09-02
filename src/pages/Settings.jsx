import { Bolt } from "lucide-react";
import TitleBar from "../components/TitleBar";
import { useEffect, useState } from "react";
import { fetchUser } from "../services/authService";
import { getTags, deleteTag , updateTag} from "../services/tagService";
import CreateTagForm from "../components/CreatTagFrom";
import TagContainer from "../components/TagContainer";

export default function Settings() {
    const token = localStorage.getItem("jwt_token");

    const [user, setUser] = useState(null);
    const [tags, setTags] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem("jwt_token");
        window.location.href = "/login";
    };

    useEffect(() => {
        async function fetchTags() {
            try {
                const data = await getTags();
                setTags(data || []);
            } catch (err) {
                setError("Failed to fetch tags:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchTags();

        (async () => {
            try {
                const u = await fetchUser();
                setUser(u || null);
            } catch (err) {
                console.error("Failed to fetch user data:", err);
            }
        })();
    }, []);

    const handleTagDeleted = async (tagId) => {
        setTags((prevTags) => prevTags.filter((tag) => tag._id !== tagId));
        await deleteTag(tagId);
    }

    const handleTagEdited = async (tagId, updatedTag) => {
        setTags((prevTags) =>
            prevTags.map((tag) => (tag._id === tagId ? { ...tag, ...updatedTag } : tag))
        );
        await updateTag(tagId, updatedTag);
    }

    if (!token) {
        window.location.href = "/login";
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-6 pt-20">
            <TitleBar user={user} onLogout={handleLogout} />
            <h1 className="text-3xl font-bold mb-4 inline-flex items-center gap-2">
                <Bolt className="w-6 h-6" />
                Settings
            </h1>
            <div className="w-full flex flex-col gap-3 p-3 bg-[var(--panel)] border border-[var(--border)] rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-2">Cadastro de TAGs</h2>
                <p className="mb-4 text-[var(--muted)]">
                    Gerencie suas tags personalizadas para organizar melhor suas tarefas.
                </p>
                <div className="flex flex-col gap-4">
                    {/*<div className="flex flex-col md:flex-row md:items-center gap-2">
                        <input type="text" placeholder="Nome da tag" className="flex-1 p-2 border border-[var(--border)] rounded-md bg-[var(--bg)] text-[var(--text)]" />
                        <input type="color" className="w-12 h-12 p-0 border-0 rounded-md" />
                        <button className="px-4 py-2 bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-dark)] transition">Adicionar Tag</button>
                    </div>*/}
                    <CreateTagForm onTagCreated={(newTag) => setTags((prev) => [...prev, newTag])} />
                    {tags.length === 0 && <p className="text-[var(--muted)]">Nenhuma tag cadastrada.</p>}
                    {/*<div className="grid grid-cols-2 md:grid-cols-4 gap-4">*/}
                    {/*<TagList tags={tags} onDelete={handleTagDeleted}/>*/}
                    <TagContainer tags={tags} onDelete={handleTagDeleted} onEdit={handleTagEdited}/>
                    {/*</div>*/}
                </div>
            </div>

        </div>
    );
}