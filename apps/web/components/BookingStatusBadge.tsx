export function BookingStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-slate-200 text-slate-700',
    approved: 'bg-blue-100 text-blue-700',
    scheduled: 'bg-indigo-100 text-indigo-700',
    in_progress: 'bg-amber-100 text-amber-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-rose-100 text-rose-700',
    no_show: 'bg-rose-100 text-rose-700',
    disputed: 'bg-orange-100 text-orange-700',
  };
  const cls = map[status] || 'bg-slate-100 text-slate-700';
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>{status.replace('_',' ')}</span>
}

