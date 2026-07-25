export default function Pagination({ page, setPage, totalPages }) {
  return (
    <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
      <span>Page {page} of {totalPages}</span>
      <div className="flex w-full gap-2 sm:w-auto">
        <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="flex-1 rounded-xl border border-white/10 px-3 py-2 disabled:opacity-50 sm:flex-none">Prev</button>
        <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="flex-1 rounded-xl border border-white/10 px-3 py-2 disabled:opacity-50 sm:flex-none">Next</button>
      </div>
    </div>
  );
}
