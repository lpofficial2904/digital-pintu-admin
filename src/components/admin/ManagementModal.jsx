import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function ManagementModal({ open, title, children, onClose }) {
  return <AnimatePresence>{open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-slate-950/75 p-4 backdrop-blur-sm" onMouseDown={onClose}>
    <motion.div initial={{ opacity: 0, y: 18, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} onMouseDown={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
      <div className="mb-5 flex items-center justify-between"><h3 className="text-xl font-semibold text-white">{title}</h3><button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-white/10"><X size={18}/></button></div>{children}
    </motion.div>
  </motion.div>}</AnimatePresence>;
}
