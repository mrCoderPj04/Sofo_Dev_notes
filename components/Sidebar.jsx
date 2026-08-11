'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { useAuth } from '@/lib/authContext';
import {
  LayoutDashboard,
  Code2,
  FolderTree,
  FileText,
  File,
  Terminal,
  Tag,
  Heart,
  Activity,
  Settings,
  Layers,
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Languages', href: '/admin/languages', icon: Code2 },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Folders', href: '/admin/folders', icon: FolderTree },
    { name: 'Topics', href: '/admin/topics', icon: Tag },
    { name: 'Notes', href: '/admin/notes', icon: FileText },
    { name: 'Code Snippets', href: '/admin/code', icon: Code2 },
    { name: 'File Storage', href: '/admin/files', icon: File },
    { name: 'Outputs', href: '/admin/outputs', icon: Terminal },
    { name: 'Favorites', href: '/admin/favorites', icon: Heart },
    { name: 'Activity Log', href: '/admin/activity', icon: Activity },
    { name: 'Settings', href: '/admin/settings', icon: Settings }
  ];

  return (
    /* Hidden on mobile (hidden), visible ONLY on desktop (lg:flex) */
    <aside className="hidden lg:flex w-64 shrink-0 min-h-[calc(100vh-4rem)] border-r border-white/10 bg-dark-950/80 backdrop-blur-xl flex-col justify-between p-4">
      <div className="space-y-6">
        
        {/* Workspace Title */}
        <div className="px-2 py-1">
          <div className="text-[10px] font-bold tracking-widest text-cyan-400/80 uppercase">
            Personal Developer Knowledge OS
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 text-cyan-300 border border-cyan-500/30 shadow-cyan-glow'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-all ${isActive ? 'text-cyan-400 scale-110' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile */}
      {user && (
        <div className="pt-4 border-t border-white/10 flex items-center justify-between px-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-cyan-glow shrink-0">
              {user.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">{user.username}</div>
              <div className="text-[10px] text-cyan-400/80 truncate">{user.role}</div>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
}
