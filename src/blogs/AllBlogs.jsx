import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import DeleteModal from "../components/admin/DeleteModal";
import Loader from "../components/admin/Loader";
import Table from "../components/admin/Table";
import { deleteBlog, getBlogs, updateBlogStatus } from "../services/api";
export default function AllBlogs() {
  const [blogs, setBlogs] = useState([]), [loading, setLoading] = useState(true), [remove, setRemove] = useState(null);
  const load = () => getBlogs().then((data) => setBlogs(data.blogs || [])).catch((error) => toast.error(error.message)).finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);
  const toggle = async (blog) => { try { const data = await updateBlogStatus(blog._id, !blog.isActive); setBlogs((current) => current.map((item) => item._id === blog._id ? data.blog : item)); toast.success("Blog status updated"); } catch (error) { toast.error(error.message); } };
  return <div className="space-y-6"><div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm uppercase tracking-[.3em] text-cyan-300">Blogs</p><h2 className="text-2xl font-semibold">Manage blog posts</h2></div><Link to="/blogs/add" className="inline-flex w-fit items-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950"><Plus size={16} /> Add Blog</Link></div>{loading ? <Loader /> : <Table headers={["Image", "Title", "Category", "Status", "Created", "Actions"]}>{blogs.map((blog) => <tr key={blog._id}><td className="px-4 py-3">{blog.image ? <img src={blog.image} alt="" className="h-10 w-14 rounded-lg object-cover" /> : "—"}</td><td className="px-4 py-3"><p className="font-medium">{blog.title}</p><p className="text-xs text-slate-500">{blog.slug}</p></td><td className="px-4 py-3 text-slate-400">{blog.category}</td><td className="px-4 py-3"><button onClick={() => toggle(blog)} className={`rounded-full px-3 py-1 text-xs ${blog.isActive ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"}`}>{blog.isActive ? "Active" : "Inactive"}</button></td><td className="px-4 py-3 text-slate-400">{new Date(blog.createdAt).toLocaleDateString()}</td><td className="px-4 py-3"><Link to={`/blogs/edit/${blog._id}`} className="inline-flex p-2 text-cyan-300"><Pencil size={16} /></Link><button onClick={() => setRemove(blog)} className="p-2 text-rose-300"><Trash2 size={16} /></button></td></tr>)}</Table>}{!loading && !blogs.length && <p className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-slate-400">No blogs added yet.</p>}<DeleteModal open={Boolean(remove)} title="blog" onCancel={() => setRemove(null)} onConfirm={async () => { try { await deleteBlog(remove._id); setRemove(null); await load(); toast.success("Blog deleted"); } catch (error) { toast.error(error.message); } }} /></div>;
}
