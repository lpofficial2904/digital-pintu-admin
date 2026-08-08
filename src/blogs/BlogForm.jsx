import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const defaults = { title: "", slug: "", category: "", tags: "", excerpt: "", content: "", image: "", imageThumbnail: "", imageAlt: "", canonicalUrl: "", ogImage: "", ogTitle: "", ogDescription: "", author: "Digital Pintu", metaTitle: "", metaKeywords: "", metaDescription: "", focusKeyword: "", secondaryKeywords: "", status: "published", publishedAt: "", noIndex: false, isActive: true };

export default function BlogForm({ initialValues, submitLabel, onSubmit, onCancel }) {
  const { register, handleSubmit, reset, setValue, watch } = useForm({ defaultValues: defaults });
  const [saving, setSaving] = useState(false);
  const image = watch("image");
  useEffect(() => { reset({ ...defaults, ...initialValues, tags:Array.isArray(initialValues?.tags)?initialValues.tags.join(", "):initialValues?.tags||"", secondaryKeywords:Array.isArray(initialValues?.secondaryKeywords)?initialValues.secondaryKeywords.join(", "):initialValues?.secondaryKeywords||"", publishedAt:initialValues?.publishedAt?new Date(initialValues.publishedAt).toISOString().slice(0,16):"" }); }, [initialValues, reset]);
  const chooseImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) { toast.error("Please choose an image of 2 MB or less"); event.target.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => {
      const source = String(reader.result); setValue("image", source, { shouldDirty:true });
      const preview = new Image(); preview.onload = () => { const canvas=document.createElement("canvas"); canvas.width=480; canvas.height=270; const context=canvas.getContext("2d"); const scale=Math.max(canvas.width/preview.width,canvas.height/preview.height); const width=preview.width*scale; const height=preview.height*scale; context.drawImage(preview,(canvas.width-width)/2,(canvas.height-height)/2,width,height); setValue("imageThumbnail",canvas.toDataURL("image/jpeg",.72),{shouldDirty:true}); }; preview.src=source;
    };
    reader.readAsDataURL(file);
  };
  const submit = async (values) => { setSaving(true); try { await onSubmit({ ...values, tags:String(values.tags||"").split(",").map(x=>x.trim()).filter(Boolean), secondaryKeywords:String(values.secondaryKeywords||"").split(",").map(x=>x.trim()).filter(Boolean), publishedAt:values.publishedAt?new Date(values.publishedAt).toISOString():null }); } finally { setSaving(false); } };
  const field = "w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none focus:border-cyan-400/60";
  return <form onSubmit={handleSubmit(submit)} className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2">
      <label className="text-sm text-slate-300">Title<input {...register("title", { required: true })} className={`mt-2 ${field}`} /></label>
      <label className="text-sm text-slate-300">Slug<input {...register("slug")} placeholder="blog-post-slug" className={`mt-2 ${field}`} /></label>
      <label className="text-sm text-slate-300">Category<input {...register("category")} className={`mt-2 ${field}`} /></label><label className="text-sm text-slate-300">Tags (comma separated)<input {...register("tags")} className={`mt-2 ${field}`} /></label>
      <label className="text-sm text-slate-300">Author<input {...register("author")} className={`mt-2 ${field}`} /></label>
    </div>
    <label className="block text-sm text-slate-300">Short excerpt<textarea {...register("excerpt", { required: true })} rows="3" className={`mt-2 ${field}`} /></label>
    <label className="block text-sm text-slate-300">Blog content<textarea {...register("content", { required: true })} rows="12" className={`mt-2 ${field}`} /></label>
    <label className="block text-sm text-slate-300">Choose featured image from computer<input type="file" accept="image/*" onChange={chooseImage} className={`mt-2 ${field}`} /><span className="mt-1 block text-xs text-slate-500">Maximum 2 MB</span></label>
    {image && <img src={image} alt="Blog preview" className="h-44 w-full rounded-2xl object-cover sm:w-80" />}
    <section className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"><h3 className="mb-4 font-semibold text-white">SEO Settings</h3><div className="grid gap-4 md:grid-cols-2"><label className="text-sm text-slate-300">Focus Keyword<input {...register("focusKeyword")} className={`mt-2 ${field}`} /></label><label className="text-sm text-slate-300">Secondary Keywords<input {...register("secondaryKeywords")} className={`mt-2 ${field}`} /></label><label className="text-sm text-slate-300">Meta Title<input {...register("metaTitle")} maxLength="70" className={`mt-2 ${field}`} /></label><label className="text-sm text-slate-300">Meta Keywords<input {...register("metaKeywords")} className={`mt-2 ${field}`} /></label><label className="text-sm text-slate-300">Featured Image Alt Text<input {...register("imageAlt")} className={`mt-2 ${field}`} /></label><label className="text-sm text-slate-300">Canonical URL<input {...register("canonicalUrl")} className={`mt-2 ${field}`} /></label><label className="text-sm text-slate-300">Open Graph Title<input {...register("ogTitle")} className={`mt-2 ${field}`} /></label><label className="text-sm text-slate-300">Open Graph Image URL<input {...register("ogImage")} className={`mt-2 ${field}`} /></label><label className="text-sm text-slate-300 md:col-span-2">Open Graph Description<textarea {...register("ogDescription")} rows="2" className={`mt-2 ${field}`} /></label><label className="text-sm text-slate-300">Publish status<select {...register("status")} className={`mt-2 ${field}`}><option value="published">Published</option><option value="draft">Draft</option></select></label><label className="text-sm text-slate-300">Publish date<input type="datetime-local" {...register("publishedAt")} className={`mt-2 ${field}`} /></label></div><label className="mt-4 block text-sm text-slate-300">Meta Description<textarea {...register("metaDescription")} maxLength="180" rows="3" className={`mt-2 ${field}`} /></label><label className="mt-4 flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" {...register("noIndex")}/> Noindex this blog</label></section>
    <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" {...register("isActive")} className="h-4 w-4" /> Active</label>
    <div className="flex flex-wrap gap-3"><button disabled={saving} className="rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 disabled:opacity-60">{saving ? "Saving..." : submitLabel}</button><button type="button" onClick={onCancel} className="rounded-2xl border border-white/10 px-5 py-3">Cancel</button></div>
  </form>;
}
