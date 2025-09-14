import Link from 'next/link';
import BookingForm from '../../../components/BookingForm';
import RequireAuth from '../../../components/RequireAuth';

type Exam = {
  _id: string;
  slug: string;
  name: string;
  provider?: string;
  durationMinutes?: number;
  basePrice: number;
  currency: string;
};

export default async function BookExamPage({ params }: { params: { slug: string } }) {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const res = await fetch(`${api}/exams/${params.slug}`, { cache: 'no-store' });
  if (!res.ok) {
    return (
      <main className="py-8">
        <div className="text-slate-700">Exam not found.</div>
        <Link className="text-blue-600" href="/">Back home</Link>
      </main>
    );
  }
  const { exam } = (await res.json()) as { exam: Exam };

  return (
    <main className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Book {exam.name}</h1>
          <p className="text-slate-600">Provider: {exam.provider || '—'} • Duration: {exam.durationMinutes || '—'} min</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-medium">{(exam.basePrice/100).toFixed(2)} {exam.currency}</div>
          <div className="text-sm text-slate-500">Pay 50% upfront, 50% after</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Step 1 — Choose date & time</h2>
          <RequireAuth>
            <BookingForm exam={exam} />
          </RequireAuth>
        </section>
        <section className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Overview</h2>
          <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
            <li>Pre‑check: ID verification, room scan, tech check</li>
            <li>50% deposit to confirm booking</li>
            <li>Remaining 50% after completion</li>
          </ul>
        </section>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/" className="text-slate-600">← Back</Link>
      </div>
    </main>
  );
}
