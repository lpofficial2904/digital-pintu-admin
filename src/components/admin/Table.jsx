export default function Table({ headers, children }) {
  return (
    <div className="max-w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 sm:rounded-3xl">
      <div className="max-w-full overflow-x-auto overscroll-x-contain">
        <table className="min-w-full whitespace-nowrap divide-y divide-white/10 text-sm">
          <thead className="bg-white/5">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 text-left font-medium text-slate-300">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">{children}</tbody>
        </table>
      </div>
    </div>
  );
}
