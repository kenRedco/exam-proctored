"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import FeatureGrid from '../components/FeatureGrid';

type Exam = { _id: string; slug: string; name: string; basePrice: number; currency: string };

export default function HomePage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  useEffect(() => {
    axios.get(`${api}/exams`).then(r => setExams(r.data.items || [])).catch(() => {});
  }, [api]);

  return (
    <main className="space-y-10">
      <Hero />
      <TrustBar />
      <FeatureGrid />
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="card p-5" id="exams">
        <h3 className="font-semibold mb-4">Upcoming Exams</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {exams.map((ex) => (
            <div key={ex._id} className="border rounded-md p-3 hover:shadow-sm transition bg-white">
              <div className="font-medium">{ex.name}</div>
              <div className="text-sm text-slate-600">{(ex.basePrice/100).toFixed(2)} {ex.currency}</div>
              <Link className="text-primary-700 text-sm" href={`/book/${ex.slug}`}>Book now →</Link>
            </div>
          ))}
          {exams.length === 0 && <div className="text-sm text-slate-500">No exams yet. Seed via API.</div>}
        </div>
      </motion.section>
    </main>
  );
}
