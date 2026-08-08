import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/admin/Loader";
import { getBlog, updateBlog } from "../services/api";
import BlogForm from "./BlogForm";

export default function EditBlog() {
  const { id } = useParams(); const navigate = useNavigate(); const [blog, setBlog] = useState(null);
  useEffect(() => { let active=true; getBlog(id).then((data) => { if(active)setBlog(data.blog); }).catch((error) => { toast.error(error.message); navigate("/blogs"); }); return()=>{active=false}; }, [id, navigate]);
  if (!blog) return <Loader />;
  return <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 sm:p-6"><h2 className="mb-6 text-2xl font-semibold">Edit Blog</h2><BlogForm initialValues={blog} submitLabel="Save Changes" onCancel={() => navigate("/blogs")} onSubmit={async (values) => { try { const data=await updateBlog(id, values); toast.success("Blog and image updated"); setBlog(data.blog); navigate("/blogs"); } catch (error) { toast.error(error.message); throw error; } }} /></div>;
}
