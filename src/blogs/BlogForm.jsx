import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const defaults = { title: "", slug: "", category: "", excerpt: "", content: "", image: "", author: "Digital Pintu", metaTitle: "", metaKeywords: "", metaDescription: "", isActive: true };

export default function BlogForm({ initialValues, submitLabel, onSubmit, onCancel }) {
  const { register, handleSubmit, reset, setValue, watch } = useForm({ defaultValues: defaults });
  const [saving, setSaving] = useState(false);
  const image = watch("image");
  useEffect(() => { reset({ ...defaults, ...initialValues }); }, [initialValues, reset]);
  const chooseImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) { toast.error("Please choose an image of 2 MB or less"); event.target.value = ""; return; }
    const reader = new FileReader();
    reader.onloadend = () => setValue("image", reader.result);
    reader.readAsDataURL(file);
  };
  const submit = async (values) => { setSaving(true); try { await onSubmit(values); } finally { setSaving(false); } };
  const field = "w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none focus:border-cyan-400/60";
  return <form onSubmit={handleSubmit(submit)} className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2">
      <label className="text-sm text-slate-300">Title<input {...register("title", { required: true })} className={`mt-2 ${field}`} /></label>
      <label className="text-sm text-slate-300">Slug<input {...register("slug")} placeholder="blog-post-slug" className={`mt-2 ${field}`} /></label>
      <label className="text-sm text-slate-300">Category<input {...register("category")} className={`mt-2 ${field}`} /></label>
      <label className="text-sm text-slate-300">Author<input {...register("author")} className={`mt-2 ${field}`} /></label>
    </div>
    <label className="block text-sm text-slate-300">Short excerpt<textarea {...register("excerpt", { required: true })} rows="3" className={`mt-2 ${field}`} /></label>
    <label className="block text-sm text-slate-300">Blog content<textarea {...register("content", { required: true })} rows="12" className={`mt-2 ${field}`} /></label>
    <label className="block text-sm text-slate-300">Choose featured image from computer<input type="file" accept="image/*" onChange={chooseImage} className={`mt-2 ${field}`} /><span className="mt-1 block text-xs text-slate-500">Maximum 2 MB</span></label>
    {image && <img src={image} alt="Blog preview" className="h-44 w-full rounded-2xl object-cover sm:w-80" />}
    <section className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"><h3 className="mb-4 font-semibold text-white">SEO Settings</h3><div className="grid gap-4 md:grid-cols-2"><label className="text-sm text-slate-300">Meta Title<input {...register("metaTitle")} maxLength="70" className={`mt-2 ${field}`} /></label><label className="text-sm text-slate-300">Meta Keywords<input {...register("metaKeywords")} className={`mt-2 ${field}`} /></label></div><label className="mt-4 block text-sm text-slate-300">Meta Description<textarea {...register("metaDescription")} maxLength="180" rows="3" className={`mt-2 ${field}`} /></label></section>
    <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" {...register("isActive")} className="h-4 w-4" /> Active</label>
    <div className="flex flex-wrap gap-3"><button disabled={saving} className="rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 disabled:opacity-60">{saving ? "Saving..." : submitLabel}</button><button type="button" onClick={onCancel} className="rounded-2xl border border-white/10 px-5 py-3">Cancel</button></div>
  </form>;
}
