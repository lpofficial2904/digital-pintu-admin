import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import Loader from "../components/admin/Loader";
import { getSiteSettings, updateSiteSettings } from "../services/api";

const defaults = {
  hero: {
    badge: "Digital Pintu IT Solutions • Est. 2014", titleAccent: "Architecting", titleMain: "The Next-Gen", titleGradient: "Digital Future.",
    description: "Transforming ideas into powerful digital experiences with innovative websites, mobile apps, UI/UX design, SEO, and result-driven marketing solutions that fuel business success.",
    primaryButtonLabel: "Start Your Project", primaryButtonUrl: "/contact/", secondaryButtonLabel: "Explore Services", secondaryButtonUrl: "/services",
    stats: [{ value: "500+", label: "Projects" }, { value: "99.9%", label: "Uptime" }, { value: "150+", label: "Clients" }],
  },
  stats: [
    { value: 500, decimals: 0, suffix: "+", title: "Projects Delivered" },
    { value: 99.9, decimals: 1, suffix: "%", title: "Uptime SLA" },
    { value: 150, decimals: 0, suffix: "+", title: "Enterprise Clients" },
    { value: 12, decimals: 0, suffix: "yrs", title: "Industry Experience" },
  ],
  whyChooseUs: {
    eyebrow: "// WHY DIGITAL PINTU SOLUTIONS", heading: "Built for enterprises that can't afford failure.",
    description: "We architect resilient systems engineered for the demands of modern business.",
    features: [
      { title: "Delivery in 2–4 weeks", description: "Sprint-based, milestone-driven execution with weekly demos." },
      { title: "Security-first architecture", description: "Every system built with secure defaults." },
      { title: "24/7 monitoring & support", description: "Fast support for critical incidents." },
      { title: "Global delivery, local care", description: "Responsive collaboration across time zones." },
    ],
  },
  about: {
    eyebrow: "Who we are", heading: "Empowering Businesses with", accentHeading: "Modern Technology",
    description: "Digital Pintu is an IT solutions company helping businesses build powerful digital products.",
    cards: [
      { title: "Why We Exist", description: "We turn complex ideas into reliable digital products.", note: "Technology built around real business goals." },
      { title: "Our Mission", description: "We deliver digital experiences that help brands grow.", note: "Focused on performance and results." },
      { title: "Our Vision", description: "We aim to be a trusted long-term technology partner.", note: "Future-ready products." },
      { title: "Our Work Culture", description: "We combine communication, creativity and engineering discipline.", note: "Transparent collaboration." },
    ],
  },
};

const inputClass = "w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-cyan-400";
const mergeContent = (value = {}) => ({
  ...defaults, ...value,
  hero: { ...defaults.hero, ...(value.hero || {}), stats: value.hero?.stats?.length ? value.hero.stats : defaults.hero.stats },
  whyChooseUs: { ...defaults.whyChooseUs, ...(value.whyChooseUs || {}), features: value.whyChooseUs?.features?.length ? value.whyChooseUs.features : defaults.whyChooseUs.features },
  about: { ...defaults.about, ...(value.about || {}), cards: value.about?.cards?.length ? value.about.cards : defaults.about.cards },
  stats: value.stats?.length ? value.stats : defaults.stats,
});

export default function WebsiteContent() {
  const [allSettings, setAllSettings] = useState(null);
  const [content, setContent] = useState(defaults);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSiteSettings().then(({ settings }) => {
      setAllSettings(settings);
      setContent(mergeContent(settings.contentSettings));
    }).catch((error) => toast.error(error.message)).finally(() => {});
  }, []);

  const field = (section, key, value) => setContent((current) => ({ ...current, [section]: { ...current[section], [key]: value } }));
  const listField = (section, list, index, key, value) => setContent((current) => ({
    ...current,
    [section]: { ...current[section], [list]: current[section][list].map((item, i) => i === index ? { ...item, [key]: value } : item) },
  }));
  const rootListField = (index, key, value) => setContent((current) => ({
    ...current, stats: current.stats.map((item, i) => i === index ? { ...item, [key]: value } : item),
  }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const data = await updateSiteSettings({ ...allSettings, contentSettings: content });
      setAllSettings(data.settings);
      setContent(mergeContent(data.settings.contentSettings));
      toast.success("Website content updated");
    } catch (error) { toast.error(error.message); }
    finally { setSaving(false); }
  };

  const selectLogo = (file) => {
    if (!file) return;
    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Logo must be a PNG, JPG, WEBP, or SVG image");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be smaller than 2 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAllSettings((current) => ({ ...current, logoData: reader.result }));
    reader.readAsDataURL(file);
  };

  if (!allSettings) return <Loader />;
  return <div className="max-w-5xl space-y-6">
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
      <p className="text-xs uppercase tracking-[.3em] text-cyan-300">Website content</p>
      <h2 className="mt-1 text-2xl font-semibold">Main website sections</h2>
      <p className="mt-2 text-sm text-slate-400">Manage the Hero, business statistics, Why Choose Us and About page from one screen.</p>
    </div>
    <form onSubmit={save} className="space-y-6">
      <Section title="Website logo">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-24 w-48 items-center justify-center rounded-2xl border border-white/10 bg-slate-950 p-4">
            {allSettings.logoData ? <img src={allSettings.logoData} alt="Website logo preview" className="max-h-full max-w-full object-contain" /> : <span className="text-sm text-slate-500">Default logo active</span>}
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="cursor-pointer rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950">
              Upload logo
              <input type="file" accept=".png,.jpg,.jpeg,.webp,.svg" className="sr-only" onChange={(event) => selectLogo(event.target.files?.[0])} />
            </label>
            {allSettings.logoData && <button type="button" onClick={() => setAllSettings((current) => ({ ...current, logoData: "" }))} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300">Use default logo</button>}
          </div>
        </div>
        <p className="text-xs text-slate-500">PNG, JPG, WEBP or SVG · Maximum 2 MB. This logo is used in the Navbar and Footer.</p>
      </Section>
      <Section title="Hero section">
        <Grid>
          {["badge", "titleAccent", "titleMain", "titleGradient", "primaryButtonLabel", "primaryButtonUrl", "secondaryButtonLabel", "secondaryButtonUrl"].map((key) =>
            <Field key={key} label={key} value={content.hero[key]} onChange={(value) => field("hero", key, value)} />)}
          <Field label="Description" textarea value={content.hero.description} onChange={(value) => field("hero", "description", value)} />
        </Grid>
        <EditorList title="Hero mini statistics" items={content.hero.stats} fields={["value", "label"]} update={(i, key, value) => listField("hero", "stats", i, key, value)} />
      </Section>
      <Section title="Homepage statistics">
        <EditorList items={content.stats} fields={["value", "suffix", "title"]} update={(i, key, value) => rootListField(i, key, key === "value" ? Number(value) : value)} />
      </Section>
      <Section title="Why Choose Us">
        <Grid>
          <Field label="Eyebrow" value={content.whyChooseUs.eyebrow} onChange={(value) => field("whyChooseUs", "eyebrow", value)} />
          <Field label="Heading" value={content.whyChooseUs.heading} onChange={(value) => field("whyChooseUs", "heading", value)} />
          <Field label="Description" textarea value={content.whyChooseUs.description} onChange={(value) => field("whyChooseUs", "description", value)} />
        </Grid>
        <EditorList title="Feature cards" items={content.whyChooseUs.features} fields={["title", "description"]} update={(i, key, value) => listField("whyChooseUs", "features", i, key, value)} />
      </Section>
      <Section title="About page">
        <Grid>
          {["eyebrow", "heading", "accentHeading"].map((key) => <Field key={key} label={key} value={content.about[key]} onChange={(value) => field("about", key, value)} />)}
          <Field label="Description" textarea value={content.about.description} onChange={(value) => field("about", "description", value)} />
        </Grid>
        <EditorList title="About cards" items={content.about.cards} fields={["title", "description", "note"]} update={(i, key, value) => listField("about", "cards", i, key, value)} />
      </Section>
      <button disabled={saving} className="sticky bottom-5 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 shadow-xl disabled:opacity-60"><Save size={17} />{saving ? "Saving..." : "Save all content"}</button>
    </form>
  </div>;
}

function Section({ title, children }) {
  return <section className="space-y-5 rounded-3xl border border-white/10 bg-slate-900/80 p-5"><h3 className="text-lg font-semibold text-white">{title}</h3>{children}</section>;
}
function Grid({ children }) { return <div className="grid gap-4 sm:grid-cols-2">{children}</div>; }
function Field({ label, value, onChange, textarea }) {
  return <label className={`block text-sm capitalize text-slate-300 ${textarea ? "sm:col-span-2" : ""}`}>{label.replace(/([A-Z])/g, " $1")}
    {textarea ? <textarea rows="3" className={`mt-2 ${inputClass}`} value={value || ""} onChange={(e) => onChange(e.target.value)} /> : <input className={`mt-2 ${inputClass}`} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />}
  </label>;
}
function EditorList({ title, items, fields, update }) {
  return <div><h4 className="mb-3 text-sm font-medium text-cyan-300">{title}</h4><div className="grid gap-3 md:grid-cols-2">{items.map((item, index) =>
    <div key={index} className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">{fields.map((key) =>
      <Field key={key} label={key} value={item[key]} onChange={(value) => update(index, key, value)} />)}</div>)}</div></div>;
}
