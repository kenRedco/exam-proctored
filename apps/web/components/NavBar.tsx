"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { clearAuth, getUser } from '../lib/auth';

export default function NavBar() {
  const [user, setUser] = useState(getUser());
  useEffect(() => {
    const handler = () => setUser(getUser());
    window.addEventListener('tp_auth_change', handler);
    return () => window.removeEventListener('tp_auth_change', handler);
  }, []);

  return (
    <header className="py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">TopProctor</Link>
        <nav className="text-sm text-slate-600 flex items-center gap-4">
          <Link className="hover:underline" href="/">Home</Link>
          <Link className="hover:underline" href="/dashboard">Dashboard</Link>
          {user?.role === 'admin' && (
            <Link className="hover:underline" href="/admin">Admin</Link>
          )}
          {!user && (
            <>
              <Link className="hover:underline" href="/login">Sign in</Link>
              <Link className="hover:underline" href="/register">Register</Link>
            </>
          )}
          {user && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white grid place-items-center text-xs font-semibold">
                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:inline">{user.name || user.email}</span>
              <button onClick={clearAuth} className="text-slate-500 hover:underline">Sign out</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
