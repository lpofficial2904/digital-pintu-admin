import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/admin/Loader';
import { getService, updateService } from '../services/api';

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { register, control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      title: '',
      slug: '',
      category: '',
      description: '',
      metaTitle: '',
      metaKeywords: '',
      metaDescription: '',
      focusKeyword: '', secondaryKeywords: '', ogTitle: '', ogDescription: '', noIndex: false,
      icon: '',
      image: '',
      imageThumbnail: '',
      imageAlt: '',
      canonicalUrl: '',
      ogImage: '',
      highlights: [{ title: '', desc: '' }],
      technologies: [{ name: '', icon: '' }],
      isActive: true,
    },
  });
  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({ control, name: 'highlights' });
  const { fields: techFields, append: appendTech, remove: removeTech } = useFieldArray({ control, name: 'technologies' });

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      event.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be 2 MB or less');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const source = String(reader.result); setValue('image', source);
      const preview = new Image(); preview.onload = () => { const canvas=document.createElement('canvas'); canvas.width=480; canvas.height=270; const context=canvas.getContext('2d'); const scale=Math.max(canvas.width/preview.width,canvas.height/preview.height); const width=preview.width*scale; const height=preview.height*scale; context.drawImage(preview,(canvas.width-width)/2,(canvas.height-height)/2,width,height); setValue('imageThumbnail',canvas.toDataURL('image/jpeg',.72)); }; preview.src=source;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getService(id);
        const service = data.service;
        if (!service) throw new Error('Service not found');
        reset({
          ...service,
          highlights: service.highlights?.length ? service.highlights : [{ title: '', desc: '' }],
          technologies: service.technologies?.length ? service.technologies : [{ name: '', icon: '' }],
        });
      } catch (error) {
        toast.error(error.message || 'Failed to load service');
        navigate('/services');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const onSubmit = async (data) => {
    try {
      await updateService(id, data);
      toast.success('Service updated');
      navigate('/services');
    } catch (error) {
      toast.error(error.message || 'Failed to update');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
      <h2 className="text-2xl font-semibold text-white">Edit Service</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="mb-2 block text-sm text-slate-300">Title</label><input {...register('title', { required: true })} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" /></div>
          <div><label className="mb-2 block text-sm text-slate-300">Slug</label><input {...register('slug')} placeholder="website-development" className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" /></div>
          <div><label className="mb-2 block text-sm text-slate-300">Category</label><input {...register('category')} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" /></div>
          <div><label className="mb-2 block text-sm text-slate-300">Icon</label><input {...register('icon')} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" /></div>
          <div><label className="mb-2 block text-sm text-slate-300">Choose replacement image from computer</label><input type="file" accept="image/*" onChange={handleImageChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" /><p className="mt-1 text-xs text-slate-500">Leave empty to keep the current image • Maximum 2 MB</p></div>
        </div>

        <div><label className="mb-2 block text-sm text-slate-300">Description</label><textarea {...register('description', { required: true })} rows="4" className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" /></div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <h3 className="mb-4 font-semibold text-white">SEO Settings</h3>
          <div className="mb-4 grid gap-4 md:grid-cols-2"><div><label className="mb-2 block text-sm text-slate-300">Image Alt Text</label><input {...register('imageAlt')} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" /></div><div><label className="mb-2 block text-sm text-slate-300">Canonical URL</label><input {...register('canonicalUrl')} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" /></div><div><label className="mb-2 block text-sm text-slate-300">Open Graph Title</label><input {...register('ogTitle')} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" /></div><div><label className="mb-2 block text-sm text-slate-300">Open Graph Image URL</label><input {...register('ogImage')} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" /></div><div className="md:col-span-2"><label className="mb-2 block text-sm text-slate-300">Open Graph Description</label><textarea {...register('ogDescription')} rows="2" className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" /></div></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="mb-2 block text-sm text-slate-300">Focus Keyword</label><input {...register('focusKeyword')} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" /></div><div><label className="mb-2 block text-sm text-slate-300">Secondary Keywords</label><input {...register('secondaryKeywords')} placeholder="comma separated" className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" /></div>
            <div><label className="mb-2 block text-sm text-slate-300">Meta Title</label><input {...register('metaTitle')} maxLength="70" className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" /></div>
            <div><label className="mb-2 block text-sm text-slate-300">Meta Keywords</label><input {...register('metaKeywords')} placeholder="web development, app development" className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" /></div>
          </div>
          <div className="mt-4"><label className="mb-2 block text-sm text-slate-300">Meta Description</label><textarea {...register('metaDescription')} maxLength="180" rows="3" className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" /></div>
          <label className="mt-4 flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" {...register('noIndex')} /> Noindex this service</label>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between"><label className="text-sm text-slate-300">Highlights</label><button type="button" onClick={() => appendHighlight({ title: '', desc: '' })} className="rounded-xl border border-cyan-400/20 px-3 py-2 text-sm text-cyan-300">Add Highlight</button></div>
          <div className="space-y-3">
            {highlightFields.map((field, index) => (
              <div key={field.id} className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3 md:grid-cols-[1fr_1fr_auto]">
                <input {...register(`highlights.${index}.title`, { required: true })} className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2" />
                <input {...register(`highlights.${index}.desc`, { required: true })} className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2" />
                <button type="button" onClick={() => removeHighlight(index)} className="rounded-xl border border-white/10 px-3 py-2 text-rose-300">Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between"><label className="text-sm text-slate-300">Technologies</label><button type="button" onClick={() => appendTech({ name: '', icon: '' })} className="rounded-xl border border-cyan-400/20 px-3 py-2 text-sm text-cyan-300">Add Technology</button></div>
          <div className="space-y-3">
            {techFields.map((field, index) => (
              <div key={field.id} className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3 md:grid-cols-[1fr_1fr_auto]">
                <input {...register(`technologies.${index}.name`, { required: true })} className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2" />
                <input {...register(`technologies.${index}.icon`)} placeholder="Icon name, e.g. FaReact" className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2" />
                <button type="button" onClick={() => removeTech(index)} className="rounded-xl border border-white/10 px-3 py-2 text-rose-300">Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3"><input type="checkbox" {...register('isActive')} className="h-4 w-4" /><label className="text-sm text-slate-300">Active</label></div>

        <div className="flex gap-3"><button type="submit" className="rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950">Save Changes</button><button type="button" onClick={() => navigate('/services')} className="rounded-2xl border border-white/10 px-4 py-3 text-sm">Cancel</button></div>
      </form>
    </div>
  );
}
