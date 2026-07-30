import { useEffect, useState } from "react";
import { Activity, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import DeleteModal from "../components/admin/DeleteModal";
import Loader from "../components/admin/Loader";
import StatsCard from "../components/admin/StatsCard";
import Table from "../components/admin/Table";
import { deleteTrackedVisitor, getVisitorTracker } from "../services/api";

const emptyData = {
  stats: { total: 0, online: 0, today: 0 },
  visitors: [],
};

const date = (value) => value ? new Date(value).toLocaleString() : "—";

export default function UserTracker() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadTracker = async () => {
    try {
      setData(await getVisitorTracker());
    } catch (error) {
      setData(emptyData);
      toast.error(error.message || "Unable to load visitor activity");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTracker();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await deleteTrackedVisitor(deleteTarget._id);
      setDeleteTarget(null);
      await loadTracker();
      toast.success("Visitor record deleted");
    } catch (error) {
      toast.error(error.message || "Unable to delete visitor record");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[.25em] text-cyan-300 sm:text-sm sm:tracking-[.3em]">User Tracker</p>
        <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">Visitor activity</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Total Visitors" value={data?.stats?.total || 0} subtitle="Recorded visitors" icon={<Users size={18} />} />
        <StatsCard title="Online Visitors" value={data?.stats?.online || 0} subtitle="Active in last 5 minutes" icon={<Activity size={18} />} />
        <StatsCard title="Today's Visitors" value={data?.stats?.today || 0} subtitle="First visits today" icon={<Users size={18} />} />
      </div>

      <Table headers={["Name", "Email", "Guest/User", "IP", "Browser", "Device", "Current Page", "Last Activity", "Visit Time", "Actions"]}>
        {(data?.visitors || []).map((visitor) => (
          <tr key={visitor._id}>
            <td className="px-4 py-3 font-medium">{visitor.userName || "Guest"}</td>
            <td className="px-4 py-3 text-slate-400">{visitor.email || "—"}</td>
            <td className="px-4 py-3">{visitor.loggedIn ? "User" : "Guest"}</td>
            <td className="px-4 py-3 text-slate-400">{visitor.ipAddress}</td>
            <td className="px-4 py-3">{visitor.browser}</td>
            <td className="px-4 py-3">{visitor.device}</td>
            <td className="max-w-48 truncate px-4 py-3">{visitor.currentPage}</td>
            <td className="px-4 py-3 text-slate-400">{date(visitor.lastActivity)}</td>
            <td className="px-4 py-3 text-slate-400">{date(visitor.visitTime)}</td>
            <td className="px-4 py-3">
              <button
                type="button"
                aria-label={`Delete ${visitor.userName || "visitor"} record`}
                onClick={() => setDeleteTarget(visitor)}
                className="rounded-xl border border-rose-400/20 p-2 text-rose-300 transition hover:bg-rose-500/10"
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </Table>

      {!data?.visitors?.length && (
        <p className="rounded-3xl border border-dashed border-white/15 p-8 text-center text-slate-400 sm:p-10">No visitors tracked yet.</p>
      )}

      <DeleteModal
        open={Boolean(deleteTarget)}
        title="visitor record"
        onCancel={() => !deleting && setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
