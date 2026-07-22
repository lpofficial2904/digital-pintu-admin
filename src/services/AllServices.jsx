import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Table from '../components/admin/Table';
import Loader from '../components/admin/Loader';
import DeleteModal from '../components/admin/DeleteModal';
import Pagination from '../components/admin/Pagination';
import { deleteService, getServices, updateServiceStatus } from '../services/api';

export default function AllServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const perPage = 6;

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(Array.isArray(data.services) ? data.services : []);
    } catch (error) {
      toast.error(error.message || 'Unable to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const totalPages = Math.max(1, Math.ceil(services.length / perPage));
  const paginated = services.slice((page - 1) * perPage, page * perPage);

  const handleDelete = async () => {
    try {
      await deleteService(deleteTarget._id);
      toast.success('Service deleted');
      setDeleteTarget(null);
      loadServices();
    } catch (error) {
      toast.error(error.message || 'Delete failed');
    }
  };
  const toggle = async (service) => { try { await updateServiceStatus(service._id, !service.isActive); toast.success('Service status updated'); loadServices(); } catch (error) { toast.error(error.message); } };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-900/80 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Services</p>
          <h2 className="text-2xl font-semibold text-white">Manage service catalogue</h2>
        </div>
        <Link to="/services/add" className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 font-medium text-slate-950">
          <Plus size={16} /> Add Service
        </Link>
      </div>

      {loading ? <Loader /> : (
        <>
          <Table headers={['Image', 'Icon', 'Title', 'Category', 'Slug', 'Status', 'Created', 'Actions']}>
            {paginated.map((service) => (
              <tr key={service._id} className="bg-transparent">
                <td className="px-4 py-3">{service.image ? <img src={service.image} alt="" className="h-10 w-12 rounded-lg object-cover" /> : <span className="text-slate-500">—</span>}</td><td className="px-4 py-3 text-cyan-300">{service.icon || '—'}</td><td className="px-4 py-3 font-medium text-white">{service.title}</td>
                <td className="px-4 py-3 text-slate-400">{service.category || 'General'}</td>
                <td className="px-4 py-3 text-slate-400">{service.slug}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggle(service)} className={`rounded-full px-2.5 py-1 text-xs ${service.isActive ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3 text-slate-400">{service.createdAt ? new Date(service.createdAt).toLocaleDateString() : '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link to={`/services/edit/${service._id}`} className="rounded-xl border border-white/10 p-2 text-slate-300"><Eye size={16} /></Link>
                    <Link to={`/services/edit/${service._id}`} className="rounded-xl border border-white/10 p-2 text-cyan-300"><Pencil size={16} /></Link>
                    <button onClick={() => setDeleteTarget(service)} className="rounded-xl border border-white/10 p-2 text-rose-300"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </>
      )}

      <DeleteModal open={Boolean(deleteTarget)} title="service" onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} />
    </div>
  );
}
