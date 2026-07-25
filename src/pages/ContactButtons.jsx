import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MessageCircle, Phone, Save } from "lucide-react";
import Loader from "../components/admin/Loader";
import { getSiteSettings, updateSiteSettings } from "../services/api";

export default function ContactButtons() {
  const [form, setForm] = useState({ phoneNumber: "", whatsappNumber: "", whatsappMessage: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    getSiteSettings().then((data) => setForm({ phoneNumber: data.settings?.phoneNumber || "", whatsappNumber: data.settings?.whatsappNumber || "", whatsappMessage: data.settings?.whatsappMessage || "" })).catch((error) => toast.error(error.message || "Unable to load settings")).finally(() => setLoading(false));
  }, []);
  const submit = async (event) => {
    event.preventDefault(); setSaving(true);
    try { const data = await updateSiteSettings(form); setForm({ phoneNumber: data.settings.phoneNumber || "", whatsappNumber: data.settings.whatsappNumber || "", whatsappMessage: data.settings.whatsappMessage || "" }); toast.success("Contact button settings saved"); }
    catch (error) { toast.error(error.message || "Unable to save settings"); }
    finally { setSaving(false); }
  };
  if (loading) return <Loader />;
  return <div className="max-w-3xl space-y-6">
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5"><p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Website settings</p><h2 className="mt-1 text-2xl font-semibold text-white">Floating contact buttons</h2><p className="mt-2 text-sm text-slate-400">Controls the fixed WhatsApp and call buttons on the website.</p></div>
    <form onSubmit={submit} className="space-y-5 rounded-3xl border border-white/10 bg-slate-900/80 p-5">
      <label className="block text-sm text-slate-300">Phone number for call button<div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950 px-4"><Phone size={17} className="text-cyan-300" /><input value={form.phoneNumber} onChange={(e) => setForm((current) => ({ ...current, phoneNumber: e.target.value }))} placeholder="+91 98765 43210" className="w-full bg-transparent py-3 outline-none" /></div></label>
      <label className="block text-sm text-slate-300">WhatsApp number (with country code)<div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950 px-4"><MessageCircle size={17} className="text-emerald-400" /><input value={form.whatsappNumber} onChange={(e) => setForm((current) => ({ ...current, whatsappNumber: e.target.value }))} placeholder="919876543210" className="w-full bg-transparent py-3 outline-none" /></div></label>
      <label className="block text-sm text-slate-300">Prefilled WhatsApp message<textarea rows="4" value={form.whatsappMessage} onChange={(e) => setForm((current) => ({ ...current, whatsappMessage: e.target.value }))} placeholder="Hello, I would like to know more about your services." className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none" /></label>
      <button disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 font-medium text-slate-950 disabled:opacity-60"><Save size={16} /> {saving ? "Saving..." : "Save settings"}</button>
    </form>
  </div>;
}
