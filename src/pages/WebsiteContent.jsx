import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import Loader from "../components/admin/Loader";
import { getSiteSettings, updateSiteSettings } from "../services/api";

const defaults = {
  hero: {
    badge: "Digital Pintu IT Solutions • Est. 2014", titleAccent: "Architecting", titleMain: "The Next-Gen", titleGradient: "Digital Future.",
    description: "Digital Pintu is an IT company in Mansarovar, Jaipur helping businesses grow with website development, mobile apps, UI/UX, SEO, Google Ads and digital marketing solutions.",
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
    description: "Digital Pintu is an IT and web development company in Mansarovar, Jaipur creating scalable websites, mobile apps and digital growth solutions.",
    cards: [
      { title: "Why We Exist", description: "We turn complex ideas into reliable digital products.", note: "Technology built around real business goals." },
      { title: "Our Mission", description: "We deliver digital experiences that help brands grow.", note: "Focused on performance and results." },
      { title: "Our Vision", description: "We aim to be a trusted long-term technology partner.", note: "Future-ready products." },
      { title: "Our Work Culture", description: "We combine communication, creativity and engineering discipline.", note: "Transparent collaboration." },
    ],
  },
  process: { eyebrow:"How We Work", heading:"From Idea to", accentHeading:"Launch", interval:2200, isActive:true, steps:[{number:"01",title:"Discovery",description:"Understand goals and users."},{number:"02",title:"UI/UX Strategy",description:"Create and review prototypes."},{number:"03",title:"Build & Code",description:"Develop in agile sprints."},{number:"04",title:"Launch & Scale",description:"Launch, monitor and improve."}] },
  technologies: { isActive:true, speed:38, items:["MongoDB","Express.js","React.js","Next.js","Node.js","AWS","Figma","Google Analytics"] },
  contact: { eyebrow:"Contact Us", heading:"Let's Build Something Great", description:"Tell us about your requirements and our team will get back to you.", workingHours:"Mon - Sat | 9 AM - 8 PM", submitLabel:"Send Message", servicePlaceholder:"Choose Service", serviceOptions:["Web Development","App Development","UI / UX Design","SEO Optimization","Digital Marketing","E-Commerce"] },
  footer: { description:"We build fast, responsive and scalable digital solutions that help businesses grow.", quickLinksTitle:"Quick Links", servicesTitle:"Our Services", contactTitle:"Contact Us", copyrightText:"Digital Pintu. All Rights Reserved." },
  servicesSection: { eyebrow:"Our Services", heading:"We Build", accentHeading:"Digital Experiences", description:"From websites to mobile applications, branding, marketing and SEO — we create high-performance digital products that help businesses grow.", activeLabel:"Active", learnMoreLabel:"Learn More" },
  reviewsSection: { eyebrow:"Client Proof", heading:"Words from", accentHeading:"Happy Clients" },
  blogsPage: { eyebrow:"Our Blog", heading:"Insights for your", accentHeading:"digital growth", description:"Explore practical ideas, technology updates, and business insights from Digital Pintu.", readLabel:"Read article", emptyMessage:"No blogs are available yet." },
  serviceDetails: { featuresHeading:"Our Service Features & Process", featuresDescription:"We drive dynamic software operations using an engineered structure from conceptual designs to complete code architecture.", technologiesHeading:"Our Technologies", technologiesDescription:"We utilize a range of industry-leading cloud and engineering technologies tailored to deliver outstanding apps." },
  aboutCta: { eyebrow:"What we bring together", heading:"Strategy, design and technology—under one roof.", description:"From websites and mobile apps to SEO, automation and digital marketing, our team builds connected solutions for sustainable growth.", buttonLabel:"Explore Services", buttonUrl:"/services" },
  notFound: { eyebrow:"Error 404", heading:"Page not found", description:"The page you are looking for does not exist, may have moved, or the URL is incorrect.", backLabel:"Go back", homeLabel:"Home page" },
  sections: { tech:true, services:true, stats:true, whyChooseUs:true, process:true, reviews:true, contact:true },
};

const inputClass = "w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-cyan-400";
const mergeContent = (value = {}) => ({
  ...defaults, ...value,
  hero: { ...defaults.hero, ...(value.hero || {}), stats: value.hero?.stats?.length ? value.hero.stats : defaults.hero.stats },
  whyChooseUs: { ...defaults.whyChooseUs, ...(value.whyChooseUs || {}), features: value.whyChooseUs?.features?.length ? value.whyChooseUs.features : defaults.whyChooseUs.features },
  about: { ...defaults.about, ...(value.about || {}), cards: value.about?.cards?.length ? value.about.cards : defaults.about.cards },
  process: { ...defaults.process, ...(value.process || {}), steps: value.process?.steps?.length ? value.process.steps : defaults.process.steps },
  technologies: { ...defaults.technologies, ...(value.technologies || {}), items: value.technologies?.items?.length ? value.technologies.items : defaults.technologies.items },
  contact: { ...defaults.contact, ...(value.contact || {}) }, footer: { ...defaults.footer, ...(value.footer || {}) }, sections: { ...defaults.sections, ...(value.sections || {}) },
  servicesSection: { ...defaults.servicesSection, ...(value.servicesSection || {}) }, reviewsSection: { ...defaults.reviewsSection, ...(value.reviewsSection || {}) }, blogsPage: { ...defaults.blogsPage, ...(value.blogsPage || {}) }, serviceDetails: { ...defaults.serviceDetails, ...(value.serviceDetails || {}) }, aboutCta: { ...defaults.aboutCta, ...(value.aboutCta || {}) }, notFound: { ...defaults.notFound, ...(value.notFound || {}) },
  stats: value.stats?.length ? value.stats : defaults.stats,
});

export default function WebsiteContent() {
  const [allSettings, setAllSettings] = useState(null);
  const [content, setContent] = useState(defaults);
  const [saving, setSaving] = useState(false);
  const [savingBrand, setSavingBrand] = useState(false);

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

  const saveNavbarBrand = async (nextSettings) => {
    const navbarBrandText = String(nextSettings.navbarBrandText || "").trim();
    if (!navbarBrandText) {
      toast.error("Navbar brand text is required");
      return false;
    }
    setSavingBrand(true);
    try {
      const data = await updateSiteSettings({
        ...nextSettings,
        navbarBrandText,
        navbarBrandActive: nextSettings.navbarBrandActive !== false,
        contentSettings: {
          ...content,
          navbarBrandText,
          navbarBrandActive: nextSettings.navbarBrandActive !== false,
        },
      });
      setAllSettings((current) => ({ ...current, ...data.settings }));
      setContent((current) => ({
        ...current,
        navbarBrandText,
        navbarBrandActive: nextSettings.navbarBrandActive !== false,
      }));
      toast.success("Navbar brand updated");
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setSavingBrand(false);
    }
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
        <div className="grid max-w-xl gap-4 sm:grid-cols-2">
          <label className="text-sm text-slate-300">Logo width (px)<input type="number" min="24" max="500" className={`mt-2 ${inputClass}`} value={allSettings.logoWidth ?? 112} onChange={(event) => setAllSettings((current) => ({ ...current, logoWidth: Number(event.target.value) }))} /></label>
          <label className="text-sm text-slate-300">Logo height (px)<input type="number" min="24" max="300" className={`mt-2 ${inputClass}`} value={allSettings.logoHeight ?? 72} onChange={(event) => setAllSettings((current) => ({ ...current, logoHeight: Number(event.target.value) }))} /></label>
        </div>
        <p className="text-xs text-cyan-300">Uploaded logo automatically website favicon bhi banega.</p>
      </Section>
      <Section title="Navbar brand text">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="block text-sm text-slate-300">Text between logo and navigation
            <input maxLength="80" className={`mt-2 ${inputClass}`} value={allSettings.navbarBrandText ?? "Digital Pintu Solutions"} onChange={(event) => setAllSettings((current) => ({ ...current, navbarBrandText: event.target.value }))} onBlur={() => saveNavbarBrand(allSettings)} />
          </label>
          <button disabled={savingBrand} type="button" role="switch" aria-checked={allSettings.navbarBrandActive !== false} onMouseDown={(event) => event.preventDefault()} onClick={() => {
            const next = { ...allSettings, navbarBrandActive: allSettings.navbarBrandActive === false };
            setAllSettings(next);
            saveNavbarBrand(next);
          }} className={`min-w-28 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${allSettings.navbarBrandActive !== false ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"}`}>
            {allSettings.navbarBrandActive !== false ? "Active" : "Inactive"}
          </button>
        </div>
        <p className="text-xs text-slate-500">Text is saved when you leave the field. Status is saved immediately; the website refreshes automatically.</p>
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
      <Section title="Section visibility">
        <div className="grid gap-3 sm:grid-cols-3">{Object.keys(content.sections).map((key)=><label key={key} className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-3 capitalize"><input type="checkbox" checked={content.sections[key]} onChange={(e)=>field("sections",key,e.target.checked)}/>{key}</label>)}</div>
      </Section>
      <Section title="Work process">
        <Grid>{["eyebrow","heading","accentHeading","interval"].map(key=><Field key={key} label={key} value={content.process[key]} onChange={value=>field("process",key,key==="interval"?Number(value):value)}/>)}</Grid>
        <EditorList title="Process steps" items={content.process.steps} fields={["number","title","description"]} update={(i,key,value)=>listField("process","steps",i,key,value)}/>
      </Section>
      <Section title="Technology marquee">
        <Grid><Field label="Animation duration (seconds)" value={content.technologies.speed} onChange={v=>field("technologies","speed",Number(v))}/><Field label="Technologies (comma separated)" textarea value={content.technologies.items.join(", ")} onChange={v=>field("technologies","items",v.split(",").map(x=>x.trim()).filter(Boolean))}/></Grid>
      </Section>
      <Section title="Contact content"><Grid>{["eyebrow","heading","description","workingHours","submitLabel","servicePlaceholder"].map(key=><Field key={key} label={key} textarea={key==="description"} value={content.contact[key]} onChange={v=>field("contact",key,v)}/>) }<Field label="Service options (comma separated)" textarea value={(content.contact.serviceOptions||[]).join(", ")} onChange={v=>field("contact","serviceOptions",v.split(",").map(x=>x.trim()).filter(Boolean))}/></Grid></Section>
      <Section title="Footer content"><Grid>{["description","quickLinksTitle","servicesTitle","contactTitle","copyrightText"].map(key=><Field key={key} label={key} textarea={key==="description"} value={content.footer[key]} onChange={v=>field("footer",key,v)}/>)}</Grid></Section>
      <Section title="Services section"><Grid>{["eyebrow","heading","accentHeading","description","activeLabel","learnMoreLabel"].map(key=><Field key={key} label={key} textarea={key==="description"} value={content.servicesSection[key]} onChange={v=>field("servicesSection",key,v)}/>)}</Grid></Section>
      <Section title="Reviews section"><Grid>{["eyebrow","heading","accentHeading"].map(key=><Field key={key} label={key} value={content.reviewsSection[key]} onChange={v=>field("reviewsSection",key,v)}/>)}</Grid></Section>
      <Section title="Blogs listing page"><Grid>{["eyebrow","heading","accentHeading","description","readLabel","emptyMessage"].map(key=><Field key={key} label={key} textarea={["description","emptyMessage"].includes(key)} value={content.blogsPage[key]} onChange={v=>field("blogsPage",key,v)}/>)}</Grid></Section>
      <Section title="Service detail common content"><Grid>{["featuresHeading","featuresDescription","technologiesHeading","technologiesDescription"].map(key=><Field key={key} label={key} textarea={key.includes("Description")} value={content.serviceDetails[key]} onChange={v=>field("serviceDetails",key,v)}/>)}</Grid></Section>
      <Section title="About page CTA"><Grid>{["eyebrow","heading","description","buttonLabel","buttonUrl"].map(key=><Field key={key} label={key} textarea={key==="description"} value={content.aboutCta[key]} onChange={v=>field("aboutCta",key,v)}/>)}</Grid></Section>
      <Section title="404 page"><Grid>{["eyebrow","heading","description","backLabel","homeLabel"].map(key=><Field key={key} label={key} textarea={key==="description"} value={content.notFound[key]} onChange={v=>field("notFound",key,v)}/>)}</Grid></Section>
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
