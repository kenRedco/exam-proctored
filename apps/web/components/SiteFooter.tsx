import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t">
      <div className="max-w-6xl mx-auto px-6 py-8 grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <div>
          <div className="font-semibold mb-2">TopProctor</div>
          <p className="text-slate-600">Legitimate. Secure. Global.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Company</div>
          <ul className="space-y-1 text-slate-600">
            <li><Link href="/" className="hover:underline">About</Link></li>
            <li><Link href="/" className="hover:underline">How it works</Link></li>
            <li><Link href="/" className="hover:underline">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Policies</div>
          <ul className="space-y-1 text-slate-600">
            <li><Link href="/" className="hover:underline">Terms of Service</Link></li>
            <li><Link href="/" className="hover:underline">Honor Code</Link></li>
            <li><Link href="/" className="hover:underline">Privacy</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Support</div>
          <ul className="space-y-1 text-slate-600">
            <li><Link href="/dashboard" className="hover:underline">My Dashboard</Link></li>
            <li><Link href="/login" className="hover:underline">Sign in</Link></li>
            <li><Link href="/register" className="hover:underline">Create account</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-xs text-slate-500 px-6 py-6 border-t bg-white/60">© {new Date().getFullYear()} TopProctor — All rights reserved.</div>
    </footer>
  );
}

