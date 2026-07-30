import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../services/api";
import BlogForm from "./BlogForm";
export default function AddBlog() { const navigate = useNavigate(); return <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 sm:p-6"><h2 className="text-2xl font-semibold">Add Blog</h2><p className="mb-6 mt-2 text-sm text-slate-400">Create a new website blog post.</p><BlogForm submitLabel="Create Blog" onCancel={() => navigate("/blogs")} onSubmit={async (values) => { try { await createBlog(values); toast.success("Blog created"); navigate("/blogs"); } catch (error) { toast.error(error.message); throw error; } }} /></div>; }
