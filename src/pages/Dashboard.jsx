import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MessageSquareText, MailOpen, Users, Layers3, Sparkles } from 'lucide-react';
import StatsCard from '../components/admin/StatsCard';
import Loader from '../components/admin/Loader';
import { getAdminStats } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await getAdminStats();
        if (mounted) setStats(data);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const statItems = useMemo(() => [
    { title: 'Total Services', value: stats?.stats?.services ?? 0, subtitle: 'Live offerings', icon: <Briefcase size={18} /> },
    { title: 'Total Reviews', value: stats?.stats?.reviews ?? 0, subtitle: 'Customer feedback', icon: <MessageSquareText size={18} /> },
    { title: 'Total Contacts', value: stats?.stats?.contacts ?? 0, subtitle: 'Leads received', icon: <MailOpen size={18} /> },
    { title: 'Total Users', value: stats?.stats?.users ?? 0, subtitle: 'Registered accounts', icon: <Users size={18} /> },
  ], [stats]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Dashboard</p>
          <h2 className="text-2xl font-semibold text-white">Your command center</h2>
        </div>
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
          <div className="flex items-center gap-2"><Sparkles size={16} /> Live business overview</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item) => (
          <StatsCard key={item.title} {...item} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-4 flex items-center gap-2 text-cyan-300"><Layers3 size={18} /> <h3 className="font-semibold">Latest Services</h3></div>
          <div className="space-y-3">
            {stats?.latestServices?.length ? stats.latestServices.map((service) => (
              <div key={service._id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="font-medium text-white">{service.title}</p>
                <p className="text-sm text-slate-400">{service.category || 'General'}</p>
              </div>
            )) : <p className="text-sm text-slate-400">No services yet.</p>}
          </div>
        </motion.div>

        <motion.div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-4 flex items-center gap-2 text-cyan-300"><MessageSquareText size={18} /> <h3 className="font-semibold">Latest Reviews</h3></div>
          <div className="space-y-3">
            {stats?.latestReviews?.length ? stats.latestReviews.map((review) => (
              <div key={review._id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="font-medium text-white">{review.name}</p>
                <p className="text-sm text-slate-400">{review.review}</p>
              </div>
            )) : <p className="text-sm text-slate-400">No reviews yet.</p>}
          </div>
        </motion.div>

        <motion.div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-4 flex items-center gap-2 text-cyan-300"><MailOpen size={18} /> <h3 className="font-semibold">Latest Contacts</h3></div>
          <div className="space-y-3">
            {stats?.latestContacts?.length ? stats.latestContacts.map((contact) => (
              <div key={contact._id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="font-medium text-white">{contact.name}</p>
                <p className="text-sm text-slate-400">{contact.email}</p>
              </div>
            )) : <p className="text-sm text-slate-400">No contacts yet.</p>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
