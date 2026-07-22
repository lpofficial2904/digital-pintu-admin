import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Search, Trash2, ShieldCheck, ShieldOff, Pencil } from 'lucide-react';
import ManagementModal from '../components/admin/ManagementModal';
import Table from '../components/admin/Table';
import Loader from '../components/admin/Loader';
import Pagination from '../components/admin/Pagination';
import DeleteModal from '../components/admin/DeleteModal';
import { deleteUser, getAdminUsers, toggleUserStatus, updateAdminUser } from '../services/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editing, setEditing] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const perPage = 6;

  const loadUsers = async () => {
    try {
      const data = await getAdminUsers();
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (error) {
      toast.error(error.message || 'Unable to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const filtered = useMemo(() => users.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase()) && (roleFilter === 'all' || user.role === roleFilter)), [users, query, roleFilter]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const saveUser = async (event) => { event.preventDefault(); try { await updateAdminUser(editing._id, Object.fromEntries(new FormData(event.currentTarget))); toast.success('User updated'); setEditing(null); loadUsers(); } catch (error) { toast.error(error.message || 'Update failed'); } };

  const handleStatusToggle = async (user) => {
    try {
      await toggleUserStatus(user._id);
      toast.success('User status updated');
      loadUsers();
    } catch (error) {
      toast.error(error.message || 'Update failed');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(deleteTarget._id);
      toast.success('User deleted');
      setDeleteTarget(null);
      loadUsers();
    } catch (error) {
      toast.error(error.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Users</p>
            <h2 className="text-2xl font-semibold text-white">Manage user access</h2>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2">
            <Search size={16} className="text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users" className="bg-transparent outline-none" />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm"><option value="all">All roles</option>{['admin','manager','editor','user'].map((role) => <option key={role} value={role}>{role}</option>)}</select>
        </div>
      </div>

      {loading ? <Loader /> : (
        <>
          <Table headers={['Avatar', 'Name', 'Email', 'Role', 'Status', 'Created', 'Actions']}>
            {paginated.map((user) => (
              <tr key={user._id}>
                <td className="px-4 py-3"><img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} className="h-9 w-9 rounded-full" /></td><td className="px-4 py-3 font-medium text-white">{user.name}</td>
                <td className="px-4 py-3 text-slate-400">{user.email}</td>
                <td className="px-4 py-3 text-slate-400">{user.role}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs ${(user.status === 'Blocked' || user.isBlocked) ? 'bg-rose-500/15 text-rose-300' : 'bg-emerald-500/15 text-emerald-300'}`}>{user.status || (user.isBlocked ? 'Blocked' : 'Active')}</span>
                </td>
                <td className="px-4 py-3 text-slate-400">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(user)} className="rounded-xl border border-white/10 p-2 text-cyan-300"><Pencil size={16} /></button>
                    <button onClick={() => handleStatusToggle(user)} className="rounded-xl border border-white/10 p-2 text-amber-300"><ShieldOff size={16} /></button>
                    <button onClick={() => setDeleteTarget(user)} className="rounded-xl border border-white/10 p-2 text-rose-300"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </>
      )}

      <DeleteModal open={Boolean(deleteTarget)} title="user" onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} />
      <ManagementModal open={Boolean(editing)} title="Edit user" onClose={() => setEditing(null)}>{editing && <form onSubmit={saveUser} className="space-y-4"><input name="name" defaultValue={editing.name} className="w-full rounded-xl border border-white/10 bg-slate-950 p-3" /><input name="avatar" defaultValue={editing.avatar || ''} placeholder="Avatar URL" className="w-full rounded-xl border border-white/10 bg-slate-950 p-3" /><div className="grid grid-cols-2 gap-3"><select name="role" defaultValue={editing.role} className="rounded-xl border border-white/10 bg-slate-950 p-3">{['admin','manager','editor','user'].map(role=><option key={role}>{role}</option>)}</select><select name="status" defaultValue={editing.status || (editing.isBlocked ? 'Blocked' : 'Active')} className="rounded-xl border border-white/10 bg-slate-950 p-3">{['Active','Blocked','Suspended'].map(status=><option key={status}>{status}</option>)}</select></div><button className="rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950">Save user</button></form>}</ManagementModal>
    </div>
  );
}
