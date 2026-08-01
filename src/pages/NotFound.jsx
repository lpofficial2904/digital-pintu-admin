import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[.4em] text-cyan-300">Error 404</p>
        <h1 className="mt-5 text-8xl font-black">404</h1>
        <h2 className="mt-3 text-2xl font-semibold">Admin page not found</h2>
        <p className="mt-3 text-slate-400">This admin route does not exist or has been moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3"><ArrowLeft size={17} /> Go back</button>
          <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950"><LayoutDashboard size={17} /> Dashboard</Link>
        </div>
      </div>
    </main>
  );
}
