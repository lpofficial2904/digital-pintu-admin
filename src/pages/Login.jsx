import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_45%)] px-4">
      <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-500/15 p-3 text-cyan-300"><ShieldCheck size={24} /></div>
          <div>
            <h2 className="text-xl font-semibold">Admin Access</h2>
            <p className="text-sm text-slate-400">Sign in to manage your platform</p>
          </div>
        </div>

        <label className="mb-3 block text-sm text-slate-300">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none ring-0" placeholder="admin@example.com" />

        <label className="mb-3 block text-sm text-slate-300">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-6 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none ring-0" placeholder="••••••••" />

        <button disabled={loading} className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-70">
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </motion.form>
    </div>
  );
}
