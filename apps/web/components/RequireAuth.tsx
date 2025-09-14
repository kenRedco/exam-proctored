"use client";
import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { getToken } from '../lib/auth';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  useEffect(() => { setAuthed(!!getToken()); }, []);
  if (authed === null) return null;
  if (!authed) {
    return (
      <div className="rounded-lg border p-4 bg-amber-50">
        <div className="font-medium mb-1">Please sign in to continue</div>
        <div className="text-sm text-slate-700">You need an account to book a session. <Link className="text-blue-600" href="/login">Sign in</Link> or <Link className="text-blue-600" href="/register">Create account</Link>.</div>
      </div>
    );
  }
  return <>{children}</>;
}

