import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Eye, Search, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  deleteCareerApplication,
  downloadCareerAttachment,
  getCareerAttachmentViewUrl,
  getCareerApplications,
  getSiteSettings,
  updateCareerApplication,
  updateSiteSettings,
} from "../services/api";

const statuses = ["New", "Reviewing", "Shortlisted", "Interview", "Rejected", "Hired"];
const inputClass = "rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-cyan-400";
const formatDate = (value) => new Date(value).toLocaleString();
const defaultEmailTemplates = {
  adminSubject: "New job application: {{jobTitle}} — {{candidateName}}",
  adminBody: "A new application has been received for {{jobTitle}}.\n\n{{applicationDetails}}\n\nSubmitted: {{submittedAt}}",
  candidateSubject: "Application received — {{jobTitle}}",
  candidateBody: "Hi {{candidateName}},\n\nThank you for applying for {{jobTitle}} at Digital Pintu Solutions. We have received your application and our hiring team will review it shortly.\n\nRegards,\nDigital Pintu Solutions",
};
const normalizeEmailTemplates = (value) => ({ ...defaultEmailTemplates, ...(value || {}) });

export default function Hiring() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ totalOpenings: 0, totalApplications: 0, unreadApplications: 0 });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [job, setJob] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState("date-desc");
  const [selected, setSelected] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [templates, setTemplates] = useState(defaultEmailTemplates);
  const [savingTemplates, setSavingTemplates] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(
    "Notification" in window ? Notification.permission : "unsupported"
  );
  const previousUnread = useRef(null);

  const load = async ({ notify = false } = {}) => {
    try {
      const data = await getCareerApplications();
      const unread = data.stats?.unreadApplications || 0;
      if (notify && previousUnread.current !== null && unread > previousUnread.current) {
        const newCount = unread - previousUnread.current;
        toast.success(`${newCount} new hiring application received`, { icon: "🔔" });
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("New hiring application", {
            body: `${newCount} new application${newCount > 1 ? "s" : ""} received.`,
          });
        }
      }
      previousUnread.current = unread;
      setApplications(data.applications || []);
      setStats(data.stats || {});
    } catch (error) {
      if (!notify) toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    getSiteSettings().then(({ settings }) => {
      setSiteSettings(settings);
      setTemplates(normalizeEmailTemplates(settings.careerEmailTemplates));
    }).catch((error) => toast.error(error.message));
    const interval = window.setInterval(() => load({ notify: true }), 15000);
    return () => window.clearInterval(interval);
  }, []);

  const saveTemplates = async (event) => {
    event.preventDefault();
    if (!siteSettings) return;
    setSavingTemplates(true);
    try {
      const data = await updateSiteSettings({ ...siteSettings, careerEmailTemplates: templates });
      setSiteSettings(data.settings);
      setTemplates(normalizeEmailTemplates(data.settings?.careerEmailTemplates));
      toast.success("Career email templates saved");
    } catch (error) { toast.error(error.message); }
    finally { setSavingTemplates(false); }
  };

  const enableNotifications = async () => {
    if (!("Notification" in window)) {
      toast.error("Window notifications are not supported in this browser.");
      setNotificationPermission("unsupported");
      return;
    }
    if (!window.isSecureContext) {
      toast.error("Window notifications require HTTPS or localhost.");
      return;
    }
    if (Notification.permission === "denied") {
      toast.error("Notifications are blocked. Please allow them from the browser address-bar site settings.");
      setNotificationPermission("denied");
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === "granted") {
        new Notification("Hiring notifications enabled", { body: "You will be notified when a new application arrives." });
        toast.success("Window notifications enabled");
      } else {
        toast.error("Notification permission was not granted.");
      }
    } catch {
      toast.error("Unable to enable window notifications.");
    }
  };

  const jobs = useMemo(() => [...new Set(applications.map((item) => item.jobTitle))], [applications]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const from = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const to = dateTo ? new Date(`${dateTo}T23:59:59`) : null;
    const rows = applications.filter((item) => {
      const created = new Date(item.createdAt);
      const matchesQuery = !normalizedQuery || `${item.applicantName} ${item.email} ${item.phone} ${item.jobTitle}`.toLowerCase().includes(normalizedQuery);
      return matchesQuery && (status === "all" || item.status === status) && (job === "all" || item.jobTitle === job) && (!from || created >= from) && (!to || created <= to);
    });
    return rows.sort((a, b) => {
      if (sort === "name-asc") return a.applicantName.localeCompare(b.applicantName);
      if (sort === "name-desc") return b.applicantName.localeCompare(a.applicantName);
      if (sort === "date-asc") return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [applications, query, status, job, dateFrom, dateTo, sort]);

  const updateStatus = async (item, nextStatus) => {
    try {
      await updateCareerApplication(item._id, { status: nextStatus });
      await load();
      toast.success("Application status updated");
    } catch (error) { toast.error(error.message); }
  };

  const view = async (item) => {
    setSelected(item);
    if (!item.isRead) {
      try {
        await updateCareerApplication(item._id, { isRead: true });
        await load();
      } catch (error) { toast.error(error.message); }
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete ${item.applicantName}'s application?`)) return;
    try {
      await deleteCareerApplication(item._id);
      toast.success("Application deleted");
      await load();
    } catch (error) { toast.error(error.message); }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-xs uppercase tracking-[.3em] text-cyan-300">Hiring</p><h2 className="mt-1 text-2xl font-semibold">Applications and openings</h2></div>
        <div className="flex flex-wrap gap-2">
          {notificationPermission !== "granted" && notificationPermission !== "unsupported" && <button onClick={enableNotifications} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300">Enable window notifications</button>}
          {notificationPermission === "granted" && <span className="inline-flex items-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">Window notifications enabled</span>}
          <div className="relative inline-flex w-fit items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-cyan-200"><Bell size={17} /> New applications<span className="rounded-full bg-cyan-400 px-2 py-0.5 text-xs font-bold text-slate-950">{stats.unreadApplications || 0}</span></div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5"><p className="text-sm text-slate-400">Total open hiring</p><p className="mt-2 text-4xl font-bold text-cyan-300">{stats.totalOpenings || 0}</p></div>
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5"><p className="text-sm text-slate-400">Total applications</p><p className="mt-2 text-4xl font-bold text-violet-300">{stats.totalApplications || 0}</p></div>
      </section>

      <form onSubmit={saveTemplates} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
        <div className="mb-5"><p className="text-xs uppercase tracking-[.25em] text-cyan-300">Email templates</p><h3 className="mt-1 text-lg font-semibold">Application emails</h3><p className="mt-1 text-xs text-slate-400">Available variables: {"{{candidateName}}"}, {"{{candidateEmail}}"}, {"{{jobTitle}}"}, {"{{submittedAt}}"}, {"{{applicationDetails}}"}. Future form fields are automatically included in application details.</p></div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <h4 className="font-medium text-cyan-300">Admin notification</h4>
            <input className={`${inputClass} w-full`} value={templates.adminSubject} onChange={(event) => setTemplates((current) => ({ ...current, adminSubject: event.target.value }))} placeholder="Admin email subject" />
            <textarea rows="7" className={`${inputClass} w-full`} value={templates.adminBody} onChange={(event) => setTemplates((current) => ({ ...current, adminBody: event.target.value }))} placeholder="Admin email body" />
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-violet-300">Candidate confirmation</h4>
            <input className={`${inputClass} w-full`} value={templates.candidateSubject} onChange={(event) => setTemplates((current) => ({ ...current, candidateSubject: event.target.value }))} placeholder="Candidate email subject" />
            <textarea rows="7" className={`${inputClass} w-full`} value={templates.candidateBody} onChange={(event) => setTemplates((current) => ({ ...current, candidateBody: event.target.value }))} placeholder="Candidate email body" />
          </div>
        </div>
        <button disabled={savingTemplates || !siteSettings} className="mt-4 rounded-xl bg-cyan-400 px-4 py-2.5 font-semibold text-slate-950 disabled:opacity-60">{savingTemplates ? "Saving..." : "Save email templates"}</button>
      </form>

      <section className="grid gap-3 rounded-3xl border border-white/10 bg-slate-900/70 p-4 sm:grid-cols-2 xl:grid-cols-4">
        <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950 px-3"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, role" className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none" /></label>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className={inputClass}><option value="all">All statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select>
        <select value={job} onChange={(event) => setJob(event.target.value)} className={inputClass}><option value="all">All openings</option>{jobs.map((item) => <option key={item}>{item}</option>)}</select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className={inputClass}><option value="date-desc">Newest first</option><option value="date-asc">Oldest first</option><option value="name-asc">Name A–Z</option><option value="name-desc">Name Z–A</option></select>
        <label className="text-xs text-slate-400">From date<input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className={`${inputClass} mt-1 w-full`} /></label>
        <label className="text-xs text-slate-400">To date<input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className={`${inputClass} mt-1 w-full`} /></label>
      </section>

      <section className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-900/70">
        <table className="w-full min-w-[1180px] text-left text-sm">
          <thead className="border-b border-white/10 text-slate-400"><tr>{["Applicant", "Resume", "ID Proof", "Contact", "Opening", "Date", "Status", "Actions"].map((header) => <th key={header} className="px-5 py-4">{header}</th>)}</tr></thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item._id} className={`border-b border-white/5 ${!item.isRead ? "bg-cyan-500/[.05]" : ""}`}>
                <td className="px-5 py-4"><div className="flex items-center gap-2"><b>{item.applicantName}</b>{!item.isRead && <span className="h-2 w-2 rounded-full bg-cyan-400" />}</div></td>
                {["resume", "id-proof"].map((fieldName) => {
                  const attachment = item.attachments?.find((file) => file.fieldName === fieldName);
                  return (
                    <td key={fieldName} className="px-5 py-4">
                      {attachment ? (
                        <a href={getCareerAttachmentViewUrl(item._id, fieldName)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-300 hover:border-cyan-400/50">
                          <Eye size={14} /> View
                        </a>
                      ) : <span className="text-slate-600">—</span>}
                    </td>
                  );
                })}
                <td className="px-5 py-4 text-slate-400"><p>{item.email}</p><p>{item.phone || "—"}</p></td>
                <td className="px-5 py-4">{item.jobTitle}</td>
                <td className="px-5 py-4 text-slate-400">{formatDate(item.createdAt)}</td>
                <td className="px-5 py-4"><select value={item.status} onChange={(event) => updateStatus(item, event.target.value)} className={inputClass}>{statuses.map((statusItem) => <option key={statusItem}>{statusItem}</option>)}</select></td>
                <td className="px-5 py-4"><button onClick={() => view(item)} className="p-2 text-cyan-300"><Eye size={17} /></button><button onClick={() => remove(item)} className="p-2 text-rose-300"><Trash2 size={17} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="p-10 text-center text-slate-400">Loading applications...</p>}
        {!loading && !filtered.length && <p className="p-10 text-center text-slate-400">No hiring applications found.</p>}
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 p-4 backdrop-blur-sm">
          <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-white/10 bg-slate-900 p-6">
            <div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-[.25em] text-cyan-300">Application details</p><h3 className="mt-2 text-2xl font-bold">{selected.applicantName}</h3><p className="text-slate-400">{selected.jobTitle}</p></div><button onClick={() => setSelected(null)} className="rounded-xl border border-white/10 p-2"><X size={18} /></button></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">{Object.entries(selected.answers || {}).map(([key, value]) => <div key={key} className="rounded-xl bg-slate-950/70 p-4"><p className="text-xs uppercase text-slate-500">{key}</p><p className="mt-1 whitespace-pre-wrap text-sm">{String(value) || "—"}</p></div>)}</div>
            {selected.attachments?.length > 0 && (
              <div className="mt-6 border-t border-white/10 pt-5">
                <h4 className="font-semibold text-cyan-300">Uploaded documents</h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {selected.attachments.map((attachment) => (
                    <button
                      key={attachment._id || attachment.fieldName}
                      onClick={async () => {
                        try {
                          await downloadCareerAttachment(selected._id, attachment.fieldName, attachment.fileName);
                        } catch (error) { toast.error(error.message); }
                      }}
                      className="rounded-xl border border-white/10 bg-slate-950/70 p-4 text-left transition hover:border-cyan-400/40"
                    >
                      <p className="text-xs uppercase text-slate-500">{attachment.label}</p>
                      <p className="mt-1 truncate text-sm text-cyan-300">Download {attachment.fileName}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
