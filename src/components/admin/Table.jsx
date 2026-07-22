export default function Table({ headers, children }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-sm">
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
