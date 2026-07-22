import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '◉' },
  { to: '/services', label: 'Services', icon: '▣' },
  { to: '/reviews', label: 'Reviews', icon: '✦' },
  { to: '/contacts', label: 'Contacts', icon: '✉' },
  { to: '/users', label: 'Users', icon: '👤' },
  { to: '/user-tracker', label: 'User Tracker', icon: '◉' },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex">
        <aside className={`fixed inset-y-0 left-0 z-30 w-72 transform border-r border-white/10 bg-slate-900/90 p-6 backdrop-blur-xl transition ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">Admin Panel</p>
              <p className="text-sm text-slate-400">Operations hub</p>
            </div>
            <button className="lg:hidden" onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-2">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
              >
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold">{user?.name || 'Admin'}</p>
            <p className="text-xs text-slate-400">{user?.email || 'Signed in'}</p>
            <button onClick={logout} className="mt-4 w-full rounded-xl bg-rose-500/20 px-3 py-2 text-sm text-rose-300">Logout</button>
          </div>
        </aside>

        <div className="flex-1 lg:ml-72">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur-xl lg:px-8">
            <div className="flex items-center justify-between">
              <button className="rounded-xl border border-white/10 p-2 lg:hidden" onClick={() => setOpen(true)}>
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-xl font-semibold">Control Center</h1>
                <p className="text-sm text-slate-400">Modern dashboard for your business</p>
              </div>
            </div>
          </header>

          <motion.main initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 lg:p-8">
            <Outlet />
          </motion.main>
        </div>
      </div>
    </div>
  );
}
