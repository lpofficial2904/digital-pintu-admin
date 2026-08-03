import { useEffect, useState } from "react";
import { Mail, Save, Send } from "lucide-react";
import { toast } from "sonner";
import Loader from "../components/admin/Loader";
import { getSiteSettings, testSmtpSettings, updateSmtpSettings } from "../services/api";

const initial = { enabled: true, host: "smtp.gmail.com", port: 465, secure: true, username: "", password: "", fromName: "Digital Pintu Contact", fromEmail: "", recipientEmail: "", passwordConfigured: false };
const inputClass = "mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 pl-11 outline-none focus:border-cyan-400/60";

export default function SmtpSettings() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  useEffect(() => { getSiteSettings().then(({ settings }) => setForm({ ...initial, ...(settings.smtpSettings || {}), password: "" })).catch((e) => toast.error(e.message)).finally(() => setLoading(false)); }, []);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const save = async (event) => { event.preventDefault(); setBusy("save"); try { const data = await updateSmtpSettings(form); setForm((current) => ({ ...current, ...data.smtpSettings, password: "" })); toast.success("SMTP settings saved"); } catch (e) { toast.error(e.message); } finally { setBusy(""); } };
  const test = async () => { setBusy("test"); try { const data = await testSmtpSettings(form); toast.success(data.message); } catch (e) { toast.error(e.message); } finally { setBusy(""); } };
  if (loading) return <Loader />;
  return <div className="max-w-3xl space-y-6">
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5"><p className="text-xs uppercase tracking-[.3em] text-cyan-300">Email delivery</p><h2 className="mt-1 text-2xl font-semibold">Contact form SMTP</h2><p className="mt-2 text-sm text-slate-400">Change the account used for contact-form notifications.</p></div>
    <form onSubmit={save} className="space-y-5 rounded-3xl border border-white/10 bg-slate-900/80 p-5">
      <label className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950 p-4"><span><span className="block font-medium">Email notifications</span><span className="text-xs text-slate-400">Send email for every contact submission</span></span><input type="checkbox" checked={form.enabled} onChange={(e) => set("enabled", e.target.checked)} className="h-5 w-5 accent-cyan-400" /></label>
      <div className="grid gap-4 sm:grid-cols-[1fr_140px]"><Field label="SMTP host" value={form.host} onChange={(v) => set("host", v)} placeholder="smtp.gmail.com" /><Field label="Port" type="number" value={form.port} onChange={(v) => set("port", Number(v))} /></div>
      <label className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={form.secure} onChange={(e) => set("secure", e.target.checked)} className="h-4 w-4 accent-cyan-400" />Use SSL/TLS (normally enabled for port 465)</label>
      <Field label="SMTP username / email" type="email" value={form.username} onChange={(v) => set("username", v)} placeholder="you@example.com" />
      <Field label={`SMTP password${form.passwordConfigured ? " (blank = keep saved password)" : ""}`} type="password" value={form.password} onChange={(v) => set("password", v)} placeholder={form.passwordConfigured ? "Saved — enter only to replace" : "App password"} />
      <div className="grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-2"><Field label="Sender name" value={form.fromName} onChange={(v) => set("fromName", v)} /><Field label="Sender email" type="email" value={form.fromEmail} onChange={(v) => set("fromEmail", v)} placeholder="you@example.com" /></div>
      <Field label="Receive contact submissions at" type="email" value={form.recipientEmail} onChange={(v) => set("recipientEmail", v)} placeholder="contact@example.com" />
      <p className="text-xs text-amber-300/80">For Gmail, use a Google App Password instead of the normal account password.</p>
      <div className="flex flex-wrap gap-3"><button disabled={Boolean(busy)} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:opacity-60"><Save size={17} />{busy === "save" ? "Saving..." : "Save SMTP"}</button><button type="button" disabled={Boolean(busy)} onClick={test} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 disabled:opacity-60"><Send size={17} />{busy === "test" ? "Testing..." : "Test connection"}</button></div>
    </form>
  </div>;
}

function Field({ label, onChange, ...props }) { return <label className="block text-sm text-slate-300">{label}<div className="relative"><Mail size={16} className="absolute left-4 top-1/2 mt-1 -translate-y-1/2 text-cyan-300" /><input {...props} onChange={(e) => onChange(e.target.value)} className={inputClass} /></div></label>; }
