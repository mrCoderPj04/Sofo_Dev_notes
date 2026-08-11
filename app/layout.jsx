import './globals.css';
import { AuthProvider } from '@/lib/authContext';
import Navbar from '@/components/Navbar';
import { Heart } from 'lucide-react';

export const metadata = {
  title: 'SOFO DevNotes | Learn • Code • Store • Build',
  description: 'Personal Developer Knowledge Management System (Personal Developer Knowledge OS)',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0b0f19'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark overflow-x-hidden">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#0b0f19" />
      </head>
      <body className="antialiased selection:bg-cyan-500/30 selection:text-cyan-300 w-full overflow-x-hidden min-h-screen flex flex-col">
        <AuthProvider>
          <div className="flex flex-col min-h-screen w-full">
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">{children}</main>
            <footer className="border-t border-white/10 py-6 bg-dark-950/80 backdrop-blur-md w-full">
              <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <div className="text-center sm:text-left">
                  <p>SOFO DevNotes © {new Date().getFullYear()} — Personal Developer Knowledge OS</p>
                  <p className="text-[10px] text-cyan-400/80 tracking-wider uppercase mt-0.5">Learn • Code • Store • Build</p>
                </div>

                <div className="flex items-center gap-1.5 font-medium text-slate-300">
                  <span>Developed with</span>
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
                  <span>by</span>
                  <a
                    href="https://Rajkamal-singh.netlify.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 shadow-cyan-glow"
                  >
                    mrcoder
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
