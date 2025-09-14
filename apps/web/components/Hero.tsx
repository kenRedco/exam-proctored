import Link from 'next/link';
import { BookingStepper } from './BookingStepper';

export default function Hero() {
  return (
    <section className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h2 className="text-4xl font-bold tracking-tight mb-3">Proctored exams and tutoring, done right</h2>
        <p className="text-slate-600 mb-5">Book ethically, pay 50% upfront, complete securely, then pay the rest. No cheating. Ever.</p>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="btn-primary">Go to Dashboard</Link>
          <Link href="#exams" className="text-primary-700 hover:underline">Browse exams ↓</Link>
        </div>
        <div className="mt-6"><BookingStepper step={0} /></div>
      </div>
      <div className="card p-5 bg-white/70 backdrop-blur">
        <h3 className="font-semibold mb-3">Popular Exams</h3>
        <p className="text-sm text-slate-600">Explore global exams and schedule in your timezone.</p>
      </div>
    </section>
  );
}

