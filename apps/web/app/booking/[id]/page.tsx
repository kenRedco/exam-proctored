"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getToken } from '../../../lib/auth';
import StripePay from '../../../components/StripePay';

type Booking = {
  _id: string;
  status: string;
  examTypeId: string;
  preferredStartAt?: string;
  pricing: { currency: string; totalMinor: number; upfrontMinor: number; remainingMinor: number };
};

export default function BookingPage({ params }: { params: { id: string } }) {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) { setError('Please sign in to view your booking.'); return; }
    fetch(`${api}/bookings/${params.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async r => ({ ok: r.ok, data: await r.json() }))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(typeof data?.error === 'string' ? data.error : 'Failed to load booking');
        setBooking(data.booking);
      })
      .catch(e => setError(e.message));
  }, [api, params.id]);

  async function createUpfrontIntent() {
    setClientSecret(null); setError(null);
    const token = getToken();
    if (!token) return setError('Please sign in.');
    const res = await fetch(`${api}/payments/${params.id}/upfront`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok) return setError(data?.error || 'Failed to start payment');
    setClientSecret(data.clientSecret);
  }

  return (
    <main className="py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Booking</h1>
      {error && <div className="text-sm text-rose-600">{error}</div>}
      {!booking && !error && <div className="text-sm text-slate-600">Loading...</div>}
      {booking && (
        <div className="space-y-3">
          <div className="text-sm">ID: {booking._id}</div>
          <div className="text-sm">Status: {booking.status}</div>
          <div className="text-sm">Preferred start: {booking.preferredStartAt ? new Date(booking.preferredStartAt).toLocaleString() : '—'}</div>
          <div className="text-sm">Upfront: {(booking.pricing.upfrontMinor/100).toFixed(2)} {booking.pricing.currency}</div>
          {!clientSecret && (
            <button onClick={createUpfrontIntent} className="btn-primary">Pay 50% (start)</button>
          )}
          {clientSecret && (
            <div className="mt-4">
              <StripePay clientSecret={clientSecret} onSucceeded={() => { /* optionally refresh or navigate */ }} />
            </div>
          )}
        </div>
      )}
      <Link className="text-slate-600" href="/">← Back to home</Link>
    </main>
  );
}
