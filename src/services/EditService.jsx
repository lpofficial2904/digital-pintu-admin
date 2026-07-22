import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/admin/Loader';
import { getServices, updateService } from '../services/api';

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { register, control, handleSubmit, reset } = useForm({
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

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getServices();
        // Admin services response includes inactive records, unlike the public catalogue endpoint.
        const service = Array.isArray(data.services) ? data.services.find((item) => item._id === id) : null;
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
      await updateService(id, { ...data, slug: data.title.toLowerCase().replace(/\s+/g, '-') });
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
          <div><label className="mb-2 block text-sm text-slate-300">Category</label><input {...register('category')} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" /></div>
          <div><label className="mb-2 block text-sm text-slate-300">Icon</label><input {...register('icon')} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" /></div>
          <div><label className="mb-2 block text-sm text-slate-300">Image URL</label><input {...register('image')} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" /></div>
        </div>

        <div><label className="mb-2 block text-sm text-slate-300">Description</label><textarea {...register('description', { required: true })} rows="4" className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3" /></div>

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
                <input {...register(`technologies.${index}.icon`, { required: true })} className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2" />
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
