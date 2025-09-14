export function BookingStepper({ step }: { step: number }) {
  const steps = ['Exam', 'Date & Time', 'Pre‑check', 'Pay 50%', 'Confirm'];
  return (
    <div className="flex items-center gap-3">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`h-8 w-8 rounded-full grid place-items-center text-sm font-medium ${i<=step? 'bg-blue-600 text-white':'bg-slate-200 text-slate-600'}`}>{i+1}</div>
          <span className={`text-sm ${i<=step? 'text-slate-900':'text-slate-500'}`}>{label}</span>
          {i<steps.length-1 && <div className="w-8 h-[2px] bg-slate-200"/>}
        </div>
      ))}
    </div>
  );
}

