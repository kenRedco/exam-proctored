"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authHeader, getUser } from '../../lib/auth';
import { BookingStatusBadge } from '../../components/BookingStatusBadge';

type Booking = {
  _id: string;
  status: string;
  examTypeId: string;
  preferredStartAt?: string;
  pricing: { currency: string; totalMinor: number; upfrontMinor: number; remainingMinor: number };
  createdAt: string;
};

type Payment = {
  _id: string; amountMinor: number; currency: string; status: string; createdAt: string; bookingId: string; type: 'upfront'|'remaining'
}

export default function DashboardPage() {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const user = getUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch(`${api}/me/bookings`, { headers: { ...authHeader() } }).then(r=>r.json()),
      fetch(`${api}/me/payments`, { headers: { ...authHeader() } }).then(r=>r.json())
    ]).then(([b, p]) => {
      setBookings(b.items || []);
      setPayments(p.items || []);
    }).catch((e)=> setError(e.message));
  }, [api, user?._id]);

  if (!user) return (
    <main className="py-10">
      <div className="text-slate-700">Please <Link href="/login" className="text-blue-600">sign in</Link> to view your dashboard.</div>
    </main>
  );

  return (
    <main className="py-8 space-y-8">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome, {user.name || user.email}</h1>
          <p className="text-slate-600">Track upcoming sessions, payments, and status.</p>
        </div>
        <Link className="text-sm text-blue-600" href="/">Browse exams →</Link>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Upcoming & Recent Bookings</h2>
            <span className="text-xs text-slate-500">{bookings.length} total</span>
          </div>
          <div className="space-y-2 max-h-[360px] overflow-auto pr-1">
            {bookings.map(b => (
              <Link key={b._id} href={`/booking/${b._id}`} className="block border rounded p-3 hover:bg-slate-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Booking #{b._id.slice(-6)}</div>
                  <BookingStatusBadge status={b.status} />
                </div>
                <div className="text-xs text-slate-600">Created {new Date(b.createdAt).toLocaleString()} • Preferred {b.preferredStartAt ? new Date(b.preferredStartAt).toLocaleString() : '—'}</div>
              </Link>
            ))}
            {bookings.length===0 && <div className="text-sm text-slate-500">No bookings yet. <Link href="/" className="text-blue-600">Book your first session →</Link></div>}
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Payments</h2>
            <span className="text-xs text-slate-500">{payments.length} total</span>
          </div>
          <div className="space-y-2 max-h-[360px] overflow-auto pr-1">
            {payments.map(p => (
              <div key={p._id} className="border rounded p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm">{(p.amountMinor/100).toFixed(2)} {p.currency} • {p.type}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.status==='succeeded'?'bg-emerald-100 text-emerald-700':p.status==='failed'?'bg-rose-100 text-rose-700':'bg-slate-100 text-slate-700'}`}>{p.status}</span>
                </div>
                <div className="text-xs text-slate-600">{new Date(p.createdAt).toLocaleString()} • Booking #{p.bookingId?.slice(-6)}</div>
              </div>
            ))}
            {payments.length===0 && <div className="text-sm text-slate-500">No payments yet.</div>}
          </div>
        </div>
      </section>

      {error && <div className="text-sm text-rose-600">{error}</div>}
    </main>
  );
}

