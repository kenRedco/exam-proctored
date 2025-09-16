import './globals.css';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/auth-context';
import ErrorBoundary from '@/components/error-boundary';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';
import { Toaster } from '@/components/ui/toaster';
import { FullPageLoading } from '@/components/loading';

export const metadata = {
  title: 'TopProctor',
  description: 'Ethical proctored/tutoring sessions platform',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ErrorBoundary
          fallback={
            <div className="container flex h-screen items-center justify-center p-4">
              <div className="max-w-md text-center">
                <h1 className="mb-4 text-2xl font-bold">Something went wrong</h1>
                <p className="mb-6 text-muted-foreground">
                  We're sorry, but an unexpected error occurred. Please try refreshing the page.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          }
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
              <div className="relative flex min-h-screen flex-col">
                <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className="container flex h-16 items-center">
                    <NavBar />
                  </div>
                </header>
                <main className="flex-1">
                  <div className="container py-6">
                    {children}
                  </div>
                </main>
                <SiteFooter />
              </div>
              <Toaster />
              <FullPageLoading />
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
