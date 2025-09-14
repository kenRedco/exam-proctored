export default function TrustBar() {
  const items = [
    { title: 'Secure payments', desc: 'PCI-compliant via providers' },
    { title: 'Verified proctors', desc: 'Identity and training checks' },
    { title: 'Global scheduling', desc: 'Timezone-aware, reminders included' },
    { title: 'Privacy-first', desc: 'Minimal PII, encrypted at rest' },
  ];
  return (
    <section className="card p-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.title} className="">
            <div className="font-medium text-slate-800">{it.title}</div>
            <div className="text-sm text-slate-600">{it.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

