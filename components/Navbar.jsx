'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { useAuth } from '@/lib/authContext';
import SearchModal from './SearchModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Command,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  X,
  ChevronRight,
  BookOpen,
  Heart,
  Code2,
  FolderTree,
  FileText,
  Code,
  HardDrive,
  Terminal,
  Activity,
  Settings,
  Layers,
  ShieldCheck,
  Home
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  // Public Links for everyone
  const publicLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Languages', href: '/languages', icon: Code2 },
    { name: 'Favorites', href: '/favorites', icon: Heart }
  ];

  // Admin Knowledge OS Links (Shown ONLY after successful login)
  const adminLinks = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Languages', href: '/admin/languages', icon: Code2 },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Folders', href: '/admin/folders', icon: FolderTree },
    { name: 'Topics', href: '/admin/topics', icon: BookOpen },
    { name: 'Notes', href: '/admin/notes', icon: FileText },
    { name: 'Code Snippets', href: '/admin/code', icon: Code },
    { name: 'File Storage', href: '/admin/files', icon: HardDrive },
    { name: 'Outputs', href: '/admin/outputs', icon: Terminal },
    { name: 'Favorites', href: '/favorites', icon: Heart },
    { name: 'Activity Log', href: '/admin/activity', icon: Activity },
    { name: 'Settings', href: '/admin/settings', icon: Settings }
  ];

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-dark-900/80 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Logo size="medium" />
          </Link>

          {/* Desktop Nav Links (Visible ONLY on Desktop lg:flex) */}
          <nav className="hidden lg:flex items-center space-x-1">
            {publicLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-cyan-glow' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            {isAuthenticated && (
              <Link
                href="/admin"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-cyan-glow hover:opacity-90 transition-all`}
              >
                Admin OS
              </Link>
            )}
          </nav>

          {/* Search Trigger & Auth Controls & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-white/10 bg-dark-850/80 text-xs text-slate-400 hover:text-white hover:border-cyan-500/30 transition-all shadow-inner"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline font-medium">Search docs...</span>
              <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-dark-800 text-[10px] text-slate-400 border border-white/5 font-mono">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </button>

            {/* Desktop Auth Buttons (Visible ONLY on Desktop lg:flex) */}
            <div className="hidden lg:flex items-center gap-2">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-dark-850 border border-white/10">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs border border-cyan-500/30 shadow-cyan-glow">
                      R
                    </div>
                    <span className="text-xs font-semibold text-white">Rajkamal singh</span>
                    <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                      OWNER
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>EMS Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Hamburger / Fullscreen Drawer Toggle Button (Visible ONLY on Mobile < lg) */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="p-2 rounded-xl border border-white/10 bg-dark-850 text-slate-300 hover:text-white hover:border-cyan-500/30 transition-all lg:hidden"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5 text-cyan-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Sidebar Drawer (Mobile & Tablet ONLY < lg) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 lg:hidden"
            />

            {/* Full Screen Mobile Sidebar Drawer */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed inset-0 w-full h-full bg-dark-950/98 border-l border-cyan-500/20 shadow-[0_0_80px_rgba(0,240,255,0.25)] z-50 flex flex-col p-6 overflow-y-auto lg:hidden"
            >
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
                <Logo size="medium" showTagline={true} />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl border border-white/10 bg-dark-850 text-slate-300 hover:text-white transition-all"
                >
                  <X className="w-6 h-6 text-cyan-400" />
                </button>
              </div>

              {/* User Profile Card (Shown ONLY when logged in) */}
              {isAuthenticated && (
                <div className="my-4 p-3.5 rounded-2xl border border-cyan-500/30 bg-dark-900/90 shadow-glass flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 text-white font-extrabold flex items-center justify-center text-lg shadow-cyan-glow">
                      R
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Rajkamal singh</div>
                      <div className="text-[10px] text-cyan-400 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" /> Full Stack Developer
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/40">
                    OWNER
                  </span>
                </div>
              )}

              {/* Navigation Elements List */}
              <div className="py-2 space-y-1.5 flex-1 overflow-y-auto">
                <div className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase mb-2 px-1">
                  {isAuthenticated ? 'Personal Developer Knowledge OS' : 'Navigation Menu'}
                </div>

                {/* Show Admin Links if Logged In, otherwise Public Links */}
                {(isAuthenticated ? adminLinks : publicLinks).map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow'
                          : 'text-slate-300 hover:text-white hover:bg-white/5 border border-white/5 bg-dark-900/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-cyan-400" />
                        <span>{link.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </Link>
                  );
                })}
              </div>

              {/* Drawer Bottom Actions */}
              <div className="pt-4 border-t border-white/10 space-y-3 shrink-0">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-dark-850 text-xs font-semibold text-slate-300 hover:text-white transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-cyan-400" />
                    <span>Search Knowledge OS</span>
                  </div>
                  <kbd className="px-2 py-0.5 rounded bg-dark-800 text-[10px] text-slate-400 border border-white/5 font-mono">
                    ⌘K
                  </kbd>
                </button>

                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/30 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs border border-cyan-500/30 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>EMS Sign In (Team Leader)</span>
                  </Link>
                )}

                <div className="text-center text-[11px] text-slate-500 pt-1">
                  Developed with ❤️ by{' '}
                  <a
                    href="https://Rajkamal-singh.netlify.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 font-bold hover:underline"
                  >
                    mrcoder
                  </a>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
