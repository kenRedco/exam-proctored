"use client";
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '../lib/auth';

type Exam = {
  _id: string;
  slug: string;
  name: string;
  basePrice: number;
  currency: string;
};

export default function BookingForm({ exam }: { exam: Exam }) {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const router = useRouter();
  const [date, setDate] = useState<string>('');
  const [tz, setTz] = useState<string>(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authed = useMemo(() => !!getToken(), []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!authed) return router.push('/login');
    if (!date) { setError('Please select a date and time'); return; }
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${api}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ examTypeId: exam._id, preferredStartAt: new Date(date).toISOString(), timezone: tz })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ? JSON.stringify(data.error) : 'Booking failed');
      const id = data?.booking?._id;
      if (id) router.push(`/booking/${id}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div>
        <label className="block text-sm font-medium">Preferred date & time</label>
        <input type="datetime-local" className="mt-1 w-full border rounded px-3 py-2" value={date} onChange={e=>setDate(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium">Timezone</label>
        <input className="mt-1 w-full border rounded px-3 py-2" value={tz} onChange={e=>setTz(e.target.value)} />
      </div>
      {error && <div className="text-sm text-rose-600">{error}</div>}
      <button disabled={loading} className="bg-blue-600 text-white text-sm px-4 py-2 rounded disabled:opacity-50">
        {loading ? 'Creating...' : 'Create booking'}
      </button>
    </form>
  );
}

