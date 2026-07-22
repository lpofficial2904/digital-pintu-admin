export default function Pagination({ page, setPage, totalPages }) {
  return (
    <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-400">
      <span>Page {page} of {totalPages}</span>
      <div className="flex gap-2">
        <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-xl border border-white/10 px-3 py-2 disabled:opacity-50">Prev</button>
        <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-xl border border-white/10 px-3 py-2 disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}
