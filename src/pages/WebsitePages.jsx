import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  createWebsitePage,
  deleteWebsitePage,
  getWebsitePages,
  updateWebsitePage,
} from "../services/api";

const emptyPage = {
  title: "",
  navLabel: "",
  slug: "",
  pageType: "content",
  intro: "",
  content: "",
  metaTitle: "",
  metaDescription: "",
  showInNavbar: true,
  isActive: true,
  displayOrder: 20,
  jobs: [],
  applicationFields: [],
};

const emptyJob = {
  title: "",
  location: "Jaipur / Remote",
  type: "Full-time",
  experience: "",
  department: "",
  description: "",
  applyEmail: "",
  showNewBadge: false,
  isActive: true,
};

const emptyApplicationField = {
  label: "",
  name: "",
  type: "text",
  placeholder: "",
  options: [],
  required: false,
  isActive: true,
  displayOrder: 1,
};

const fieldClass = "w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-cyan-400";
const builtInPageKeys = new Set(["home", "services", "process", "blogs", "reviews", "about", "careers", "contact"]);

export default function WebsitePages() {
  const [pages, setPages] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await getWebsitePages();
      setPages(data.pages || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const orderedPages = useMemo(
    () => [...pages].sort((a, b) => a.displayOrder - b.displayOrder),
    [pages]
  );

  const openNew = () => setEditing({ ...emptyPage });
  const openEdit = (page) => setEditing({
    ...page,
    jobs: (page.jobs || []).map((job) => ({ ...job })),
    applicationFields: (page.applicationFields || []).map((field) => ({ ...field })),
  });

  const updateField = (field, value) => setEditing((current) => ({ ...current, [field]: value }));
  const updateJob = (index, field, value) => setEditing((current) => ({
    ...current,
    jobs: current.jobs.map((job, jobIndex) => jobIndex === index ? { ...job, [field]: value } : job),
  }));
  const updateApplicationField = (index, field, value) => setEditing((current) => ({
    ...current,
    applicationFields: current.applicationFields.map((item, fieldIndex) =>
      fieldIndex === index ? { ...item, [field]: value } : item
    ),
  }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editing._id) await updateWebsitePage(editing._id, editing);
      else await createWebsitePage(editing);
      toast.success(editing._id ? "Page updated" : "Page created");
      setEditing(null);
      await load();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (page, field) => {
    try {
      await updateWebsitePage(page._id, { ...page, [field]: !page[field] });
      await load();
    } catch (error) { toast.error(error.message); }
  };

  const remove = async (page) => {
    if (!window.confirm(`Delete "${page.title}"?`)) return;
    try {
      await deleteWebsitePage(page._id);
      toast.success("Page deleted");
      await load();
    } catch (error) { toast.error(error.message); }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[.3em] text-cyan-300">Website pages</p>
          <h2 className="mt-1 text-2xl font-semibold">Navigation and page management</h2>
          <p className="mt-2 text-sm text-slate-400">Control visibility, order, page content, and careers openings.</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950">
          <Plus size={17} /> Add new page
        </button>
      </section>

      <section className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-900/70">
        <table className="min-w-[850px] w-full text-left text-sm">
          <thead className="border-b border-white/10 text-slate-400">
            <tr>{["Order", "Page", "Type", "Navbar", "Status", "Openings", "Actions"].map((item) => <th key={item} className="px-5 py-4">{item}</th>)}</tr>
          </thead>
          <tbody>
            {!loading && orderedPages.map((page) => (
              <tr key={page._id} className="border-b border-white/5">
                <td className="px-5 py-4">{page.displayOrder}</td>
                <td className="px-5 py-4"><b>{page.navLabel}</b><p className="text-xs text-slate-500">/{page.slug}</p></td>
                <td className="px-5 py-4 capitalize text-slate-300">{page.pageType}</td>
                <td className="px-5 py-4"><button onClick={() => toggle(page, "showInNavbar")} className={`rounded-full px-3 py-1 text-xs ${page.showInNavbar ? "bg-cyan-500/15 text-cyan-300" : "bg-slate-700 text-slate-400"}`}>{page.showInNavbar ? "Visible" : "Hidden"}</button></td>
                <td className="px-5 py-4"><button onClick={() => toggle(page, "isActive")} className={`rounded-full px-3 py-1 text-xs ${page.isActive ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"}`}>{page.isActive ? "Active" : "Inactive"}</button></td>
                <td className="px-5 py-4">{page.pageType === "careers" ? (page.jobs || []).filter((job) => job.isActive).length : "—"}</td>
                <td className="px-5 py-4">
                  <button onClick={() => openEdit(page)} className="p-2 text-cyan-300"><Pencil size={17} /></button>
                  {!builtInPageKeys.has(page.key) && <button onClick={() => remove(page)} className="p-2 text-rose-300"><Trash2 size={17} /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="p-8 text-center text-slate-400">Loading pages...</p>}
      </section>

      {editing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 p-3 backdrop-blur-sm sm:p-6">
          <form onSubmit={save} className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div><p className="text-xs uppercase tracking-[.25em] text-cyan-300">Page editor</p><h3 className="text-xl font-semibold">{editing._id ? "Edit page" : "Add page"}</h3></div>
              <button type="button" onClick={() => setEditing(null)} className="rounded-xl border border-white/10 p-2"><X size={18} /></button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-sm">Page title<input required className={fieldClass} value={editing.title} onChange={(e) => updateField("title", e.target.value)} /></label>
              <label className="space-y-1 text-sm">Navbar label<input required className={fieldClass} value={editing.navLabel} onChange={(e) => updateField("navLabel", e.target.value)} /></label>
              <label className="space-y-1 text-sm">Slug<input required className={fieldClass} value={editing.slug} disabled={editing.pageType !== "content"} onChange={(e) => updateField("slug", e.target.value)} /></label>
              <label className="space-y-1 text-sm">Display order<input type="number" className={fieldClass} value={editing.displayOrder} onChange={(e) => updateField("displayOrder", Number(e.target.value))} /></label>
              <label className="space-y-1 text-sm sm:col-span-2">Intro<textarea rows="2" className={fieldClass} value={editing.intro || ""} onChange={(e) => updateField("intro", e.target.value)} /></label>
              <label className="space-y-1 text-sm sm:col-span-2">Page content<textarea rows="6" className={fieldClass} value={editing.content || ""} onChange={(e) => updateField("content", e.target.value)} /></label>
              <label className="space-y-1 text-sm">Meta title<input className={fieldClass} value={editing.metaTitle || ""} onChange={(e) => updateField("metaTitle", e.target.value)} /></label>
              <label className="space-y-1 text-sm">Meta description<input className={fieldClass} value={editing.metaDescription || ""} onChange={(e) => updateField("metaDescription", e.target.value)} /></label>
            </div>

            <div className="mt-5 flex flex-wrap gap-5 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" checked={editing.showInNavbar} onChange={(e) => updateField("showInNavbar", e.target.checked)} /> Show in Navbar</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={editing.isActive} onChange={(e) => updateField("isActive", e.target.checked)} /> Active</label>
            </div>

            {editing.pageType === "careers" && (
              <section className="mt-8 space-y-4 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between"><h4 className="font-semibold">Hiring openings</h4><button type="button" onClick={() => updateField("jobs", [...editing.jobs, { ...emptyJob }])} className="rounded-xl bg-violet-500/20 px-3 py-2 text-violet-200">+ Add opening</button></div>
                {editing.jobs.map((job, index) => (
                  <div key={job._id || index} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input className={fieldClass} placeholder="Job title" value={job.title} onChange={(e) => updateJob(index, "title", e.target.value)} />
                      <input className={fieldClass} placeholder="Location" value={job.location} onChange={(e) => updateJob(index, "location", e.target.value)} />
                      <input className={fieldClass} placeholder="Employment type" value={job.type} onChange={(e) => updateJob(index, "type", e.target.value)} />
                      <input className={fieldClass} placeholder="Experience" value={job.experience} onChange={(e) => updateJob(index, "experience", e.target.value)} />
                      <input className={fieldClass} placeholder="Department / category" value={job.department || ""} onChange={(e) => updateJob(index, "department", e.target.value)} />
                      <input type="email" className={fieldClass} placeholder="Apply email" value={job.applyEmail} onChange={(e) => updateJob(index, "applyEmail", e.target.value)} />
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={job.isActive} onChange={(e) => updateJob(index, "isActive", e.target.checked)} /> Active opening</label>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(job.showNewBadge)} onChange={(e) => updateJob(index, "showNewBadge", e.target.checked)} /> Show animated New badge</label>
                      <textarea className={`${fieldClass} sm:col-span-2`} rows="3" placeholder="Job description" value={job.description} onChange={(e) => updateJob(index, "description", e.target.value)} />
                    </div>
                    <button type="button" onClick={() => updateField("jobs", editing.jobs.filter((_, jobIndex) => jobIndex !== index))} className="mt-3 text-sm text-rose-300">Remove opening</button>
                  </div>
                ))}

                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                  <div><h4 className="font-semibold">Application form fields</h4><p className="text-xs text-slate-400">Add, remove, order, and configure fields shown to applicants.</p></div>
                  <button type="button" onClick={() => updateField("applicationFields", [...editing.applicationFields, { ...emptyApplicationField, displayOrder: editing.applicationFields.length + 1 }])} className="rounded-xl bg-cyan-500/20 px-3 py-2 text-cyan-200">+ Add field</button>
                </div>
                {editing.applicationFields.map((field, index) => (
                  <div key={field._id || index} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <input className={fieldClass} placeholder="Field label" value={field.label} onChange={(e) => updateApplicationField(index, "label", e.target.value)} />
                      <input className={fieldClass} placeholder="Field name" value={field.name} onChange={(e) => updateApplicationField(index, "name", e.target.value)} />
                      <select className={fieldClass} value={field.type} onChange={(e) => updateApplicationField(index, "type", e.target.value)}>
                        <option value="text">Text</option><option value="email">Email</option><option value="tel">Phone</option><option value="textarea">Textarea</option><option value="select">Select</option><option value="file">File upload</option>
                      </select>
                      <input className={fieldClass} placeholder="Placeholder" value={field.placeholder || ""} onChange={(e) => updateApplicationField(index, "placeholder", e.target.value)} />
                      <input type="number" className={fieldClass} placeholder="Order" value={field.displayOrder} onChange={(e) => updateApplicationField(index, "displayOrder", Number(e.target.value))} />
                      {field.type === "select" && <input className={fieldClass} placeholder="Options, comma separated" value={(field.options || []).join(", ")} onChange={(e) => updateApplicationField(index, "options", e.target.value.split(",").map((item) => item.trim()).filter(Boolean))} />}
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={field.required} onChange={(e) => updateApplicationField(index, "required", e.target.checked)} /> Required</label>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={field.isActive} onChange={(e) => updateApplicationField(index, "isActive", e.target.checked)} /> Active</label>
                    </div>
                    <button type="button" onClick={() => updateField("applicationFields", editing.applicationFields.filter((_, fieldIndex) => fieldIndex !== index))} className="mt-3 text-sm text-rose-300">Delete field</button>
                  </div>
                ))}
              </section>
            )}

            <button disabled={saving} className="mt-7 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:opacity-60">{saving ? "Saving..." : "Save changes"}</button>
          </form>
        </div>
      )}
    </div>
  );
}
