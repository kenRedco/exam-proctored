import './globals.css';
import { ReactNode } from 'react';
import NavBar from '../components/NavBar';
import SiteFooter from '../components/SiteFooter';

export const metadata = {
  title: 'TopProctor',
  description: 'Ethical proctored/tutoring sessions platform'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-slate-800 bg-gradient-to-br from-white to-slate-50 bg-brand-pattern">
        <div className="border-b bg-white/70 backdrop-blur">
          <div className="max-w-6xl mx-auto px-6">
            <NavBar />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-6">
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}
