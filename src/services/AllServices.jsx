import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
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
  const [search, setSearch] = useState('');
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

  const filteredServices = services.filter((service) => {
    const query = search.trim().toLowerCase();
    return !query || [service.title, service.category, service.slug].some((value) => value?.toLowerCase().includes(query));
  });
  const totalPages = Math.max(1, Math.ceil(filteredServices.length / perPage));
  const paginated = filteredServices.slice((page - 1) * perPage, page * perPage);
  const activeServices = services.filter((service) => service.isActive).length;

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

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
  const toggle = async (service) => {
    try {
      const data = await updateServiceStatus(service._id, !service.isActive);
      const updatedService = data.service;

      setServices((currentServices) =>
        currentServices.map((currentService) =>
          currentService._id === updatedService._id ? updatedService : currentService
        )
      );
      toast.success('Service status updated');
    } catch (error) {
      toast.error(error.message || 'Unable to update service status');
    }
  };

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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5"><p className="text-sm text-slate-400">Total services</p><p className="mt-2 text-3xl font-semibold text-white">{services.length}</p></div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5"><p className="text-sm text-slate-400">Active services</p><p className="mt-2 text-3xl font-semibold text-emerald-300">{activeServices}</p></div>
      </div>

      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={handleSearch} placeholder="Search by title, category or slug" className="w-full rounded-2xl border border-white/10 bg-slate-900/80 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400" />
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
            {!paginated.length && <tr><td colSpan="8" className="px-4 py-8 text-center text-slate-400">No services found.</td></tr>}
          </Table>
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </>
      )}

      <DeleteModal open={Boolean(deleteTarget)} title="service" onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} />
    </div>
  );
}
