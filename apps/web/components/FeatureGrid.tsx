export default function FeatureGrid() {
  const steps = [
    { k: '1', t: 'Choose exam', d: 'Pick your exam type and see requirements.' },
    { k: '2', t: 'Select time', d: 'Pick a slot in your timezone.' },
    { k: '3', t: 'Pre‑check', d: 'ID verification, room and tech checks.' },
    { k: '4', t: 'Pay 50%', d: 'Secure deposit to confirm booking.' },
    { k: '5', t: 'Complete', d: 'Finish session, then pay the remaining 50%.' },
  ];
  return (
    <section className="grid md:grid-cols-5 gap-4">
      {steps.map(s => (
        <div key={s.k} className="card p-4">
          <div className="h-8 w-8 rounded-full grid place-items-center bg-primary-100 text-primary-800 font-semibold mb-2">{s.k}</div>
          <div className="font-semibold mb-1">{s.t}</div>
          <div className="text-sm text-slate-600">{s.d}</div>
        </div>
      ))}
    </section>
  );
}

