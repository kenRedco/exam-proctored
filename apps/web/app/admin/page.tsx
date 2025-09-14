"use client";
import { useEffect, useMemo, useState } from 'react';
import { authHeader, getToken } from '../../lib/auth';

type Booking = {
  _id: string;
  userId: string;
  examTypeId: string;
  status: string;
  preferredStartAt?: string;
  assignedProctorId?: string;
};

const statuses = ['pending','approved','scheduled','in_progress','completed','cancelled','no_show','disputed'];

export default function AdminPage() {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const [items, setItems] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [proctorId, setProctorId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const authed = useMemo(() => !!getToken(), []);

  useEffect(() => {
    if (!authed) return;
    const u = getUser();
    if (u?.role !== 'admin') {
      setIsAdmin(false);
      return;
    }
    setIsAdmin(true);
    const params = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : '';
    fetch(`${api}/admin/bookings${params}`, { headers: { ...authHeader() } })
      .then(async r => ({ ok: r.ok, data: await r.json() }))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(typeof data?.error === 'string' ? data.error : 'Failed to load');
        setItems(data.items || []);
      })
      .catch(e => setError(e.message));
  }, [api, statusFilter, authed]);

  async function assignProctor() {
    if (!selected || !proctorId) return;
    setError(null);
    const res = await fetch(`${api}/bookings/${selected._id}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ proctorId })
    });
    const data = await res.json();
    if (!res.ok) return setError(data?.error || 'Assign failed');
    setSelected(data.booking);
  }

  async function updateStatus(next: string) {
    if (!selected) return;
    setError(null);
    const res = await fetch(`${api}/bookings/${selected._id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ status: next })
    });
    const data = await res.json();
    if (!res.ok) return setError(data?.error || 'Update failed');
    setSelected(data.booking);
  }

  if (!authed) return <main className="py-10"><div className="text-slate-700">Sign in first to access admin.</div></main>;
  if (!isAdmin) return <main className="py-10"><div className="text-slate-700">You are not authorized to access admin. <a href="/admin/login" className="text-blue-600">Admin sign in →</a></div></main>;

  return (
    <main className="py-8 space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Admin — Bookings</h1>
        <select className="border rounded px-2 py-1" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {statuses.map(s=> <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {error && <div className="text-sm text-rose-600">{error}</div>}
      <div className="grid md:grid-cols-2 gap-4">
        <section className="border rounded p-3">
          <h2 className="font-medium mb-2">Bookings</h2>
          <div className="space-y-2 max-h-[60vh] overflow-auto">
            {items.map(b => (
              <div key={b._id} className={`border rounded p-2 cursor-pointer ${selected?._id===b._id?'border-blue-500':'border-slate-200'}`} onClick={()=>setSelected(b)}>
                <div className="text-sm">{b._id}</div>
                <div className="text-xs text-slate-600">status: {b.status} • user: {String(b.userId)} • proctor: {b.assignedProctorId||'—'}</div>
              </div>
            ))}
            {items.length===0 && <div className="text-sm text-slate-500">No bookings found.</div>}
          </div>
        </section>
        <section className="border rounded p-3">
          <h2 className="font-medium mb-2">Selected</h2>
          {!selected && <div className="text-sm text-slate-500">Select a booking to manage.</div>}
          {selected && (
            <div className="space-y-3">
              <div className="text-sm">ID: {selected._id}</div>
              <div className="text-sm">Status: <span className="font-medium">{selected.status}</span></div>
              <div className="flex items-center gap-2">
                <input placeholder="Proctor user id" className="border rounded px-2 py-1 text-sm" value={proctorId} onChange={e=>setProctorId(e.target.value)} />
                <button onClick={assignProctor} className="text-sm bg-slate-800 text-white px-3 py-1 rounded">Assign</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {statuses.map(s => (
                  <button key={s} className="text-xs bg-blue-600 text-white px-2 py-1 rounded" onClick={()=>updateStatus(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
