import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createService } from '../services/api';

export default function AddService() {
  const navigate = useNavigate();
  const { register, control, handleSubmit, setValue } = useForm({
    defaultValues: {
      title: '',
      category: '',
      description: '',
      icon: '',
      image: '',
      highlights: [{ title: '', desc: '' }],
      technologies: [{ name: '', icon: '' }],
      isActive: true,
    },
  });
  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({ control, name: 'highlights' });
  const { fields: techFields, append: appendTech, remove: removeTech } = useFieldArray({ control, name: 'technologies' });
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setValue('image', reader.result);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await createService({ ...data, slug: data.title.toLowerCase().replace(/\s+/g, '-') });
      toast.success('Service created');
      navigate('/services');
    } catch (error) {
      toast.error(error.message || 'Failed to create');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
      <h2 className="text-2xl font-semibold text-white">Add Service</h2>
      <p className="mt-2 text-sm text-slate-400">Create a new offering for the website.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Title</label>
            <input {...register('title', { required: true })} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Category</label>
            <input {...register('category')} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Icon</label>
            <input {...register('icon')} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Description</label>
          <textarea {...register('description', { required: true })} rows="4" className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm text-slate-300">Highlights</label>
            <button type="button" onClick={() => appendHighlight({ title: '', desc: '' })} className="rounded-xl border border-cyan-400/20 px-3 py-2 text-sm text-cyan-300">Add Highlight</button>
          </div>
          <div className="space-y-3">
            {highlightFields.map((field, index) => (
              <div key={field.id} className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3 md:grid-cols-[1fr_1fr_auto]">
                <input {...register(`highlights.${index}.title`, { required: true })} placeholder="Title" className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2" />
                <input {...register(`highlights.${index}.desc`, { required: true })} placeholder="Description" className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2" />
                <button type="button" onClick={() => removeHighlight(index)} className="rounded-xl border border-white/10 px-3 py-2 text-rose-300">Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm text-slate-300">Technologies</label>
            <button type="button" onClick={() => appendTech({ name: '' })} className="rounded-xl border border-cyan-400/20 px-3 py-2 text-sm text-cyan-300">Add Technology</button>
          </div>
          <div className="space-y-3">
            {techFields.map((field, index) => (
              <div key={field.id} className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3 md:grid-cols-[1fr_auto]">
                <input {...register(`technologies.${index}.name`, { required: true })} placeholder="Name" className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2" />
                <button type="button" onClick={() => removeTech(index)} className="rounded-xl border border-white/10 px-3 py-2 text-rose-300">Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" {...register('isActive')} className="h-4 w-4" />
          <label className="text-sm text-slate-300">Active</label>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950">{submitting ? 'Creating...' : 'Create Service'}</button>
          <button type="button" onClick={() => navigate('/services')} className="rounded-2xl border border-white/10 px-4 py-3 text-sm">Cancel</button>
        </div>
      </form>
    </div>
  );
}
