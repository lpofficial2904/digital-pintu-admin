import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bot, Link2, Mail, MapPin, MessageCircle, Phone, Save } from "lucide-react";
import Loader from "../components/admin/Loader";
import { getSiteSettings, updateSiteSettings } from "../services/api";

export default function ContactButtons() {
  const [form, setForm] = useState({
    phoneNumber: "",
    contactEmail: "",
    address: "",
    whatsappNumber: "",
    whatsappMessage: "",
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    linkedinUrl: "",
    githubUrl: "",
    chatbotGreeting: "",
    chatbotServicesMessage: "",
    chatbotPricingMessage: "",
    chatbotContactMessage: "",
    chatbotThanksMessage: "",
    chatbotFallbackMessage: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    getSiteSettings().then((data) => setForm((current) => ({ ...current, ...data.settings }))).catch((error) => toast.error(error.message || "Unable to load settings")).finally(() => setLoading(false));
  }, []);
  const submit = async (event) => {
    event.preventDefault(); setSaving(true);
    try { const data = await updateSiteSettings(form); setForm((current) => ({ ...current, ...data.settings })); toast.success("Contact and chatbot settings saved"); }
    catch (error) { toast.error(error.message || "Unable to save settings"); }
    finally { setSaving(false); }
  };
  if (loading) return <Loader />;
  return <div className="max-w-3xl space-y-6">
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5"><p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Website settings</p><h2 className="mt-1 text-2xl font-semibold text-white">Contact & chatbot</h2><p className="mt-2 text-sm text-slate-400">Manage floating contact details and all chatbot responses.</p></div>
    <form onSubmit={submit} className="space-y-5 rounded-3xl border border-white/10 bg-slate-900/80 p-5">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-white"><Phone size={18} className="text-cyan-300" /> Contact information</h3>
      <label className="block text-sm text-slate-300">Phone number for call button<div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950 px-4"><Phone size={17} className="text-cyan-300" /><input value={form.phoneNumber} onChange={(e) => setForm((current) => ({ ...current, phoneNumber: e.target.value }))} placeholder="+91 98765 43210" className="w-full bg-transparent py-3 outline-none" /></div></label>
      <label className="block text-sm text-slate-300">Contact email<div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950 px-4"><Mail size={17} className="text-cyan-300" /><input type="email" value={form.contactEmail} onChange={(e) => setForm((current) => ({ ...current, contactEmail: e.target.value }))} placeholder="hello@example.com" className="w-full bg-transparent py-3 outline-none" /></div></label>
      <label className="block text-sm text-slate-300">Business address<div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950 px-4"><MapPin size={17} className="text-cyan-300" /><input value={form.address} onChange={(e) => setForm((current) => ({ ...current, address: e.target.value }))} placeholder="City, State, Country" className="w-full bg-transparent py-3 outline-none" /></div></label>
      <label className="block text-sm text-slate-300">WhatsApp number (with country code)<div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950 px-4"><MessageCircle size={17} className="text-emerald-400" /><input value={form.whatsappNumber} onChange={(e) => setForm((current) => ({ ...current, whatsappNumber: e.target.value }))} placeholder="919876543210" className="w-full bg-transparent py-3 outline-none" /></div></label>
      <label className="block text-sm text-slate-300">Prefilled WhatsApp message<textarea rows="4" value={form.whatsappMessage} onChange={(e) => setForm((current) => ({ ...current, whatsappMessage: e.target.value }))} placeholder="Hello, I would like to know more about your services." className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none" /></label>
      <div className="border-t border-white/10 pt-5">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white"><Link2 size={18} className="text-cyan-300" /> Social media links</h3>
        <div className="space-y-4">
          {[
            ["facebookUrl", "Facebook URL", "https://facebook.com/your-page"],
            ["instagramUrl", "Instagram URL", "https://instagram.com/your-profile"],
            ["twitterUrl", "X / Twitter URL", "https://x.com/your-profile"],
            ["linkedinUrl", "LinkedIn URL", "https://linkedin.com/company/your-company"],
            ["githubUrl", "GitHub URL", "https://github.com/your-profile"],
          ].map(([field, label, placeholder]) => (
            <label key={field} className="block text-sm text-slate-300">{label}<div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950 px-4"><Link2 size={16} className="shrink-0 text-cyan-300" /><input type="url" value={form[field]} onChange={(e) => setForm((current) => ({ ...current, [field]: e.target.value }))} placeholder={placeholder} className="w-full bg-transparent py-3 outline-none" /></div></label>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 pt-5">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white"><Bot size={18} className="text-cyan-300" /> Chatbot messages</h3>
        <div className="space-y-4">
          {[
            ["chatbotGreeting", "Welcome message"],
            ["chatbotServicesMessage", "Services message"],
            ["chatbotPricingMessage", "Pricing message"],
            ["chatbotContactMessage", "Contact message"],
            ["chatbotThanksMessage", "Thank-you message"],
            ["chatbotFallbackMessage", "Default message"],
          ].map(([field, label]) => (
            <label key={field} className="block text-sm text-slate-300">{label}<textarea rows="3" value={form[field]} onChange={(e) => setForm((current) => ({ ...current, [field]: e.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400/60" /></label>
          ))}
        </div>
      </div>
      <button disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 font-medium text-slate-950 disabled:opacity-60"><Save size={16} /> {saving ? "Saving..." : "Save settings"}</button>
    </form>
  </div>;
}
