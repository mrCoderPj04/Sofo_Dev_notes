'use client';

import React from 'react';
import Logo from '@/components/Logo';
import { Settings, ShieldCheck, Database, HardDrive, Lock } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" /> System Settings & Architecture
        </h1>
        <p className="text-xs text-slate-400">Environment status, storage configuration, and security settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Environment & Database Status */}
        <div className="p-6 rounded-2xl border border-white/10 bg-dark-900 shadow-glass space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" /> Database & ORM
          </h2>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-dark-850 border border-white/5">
              <span className="text-slate-400">Provider</span>
              <span className="font-mono text-cyan-400 font-bold">SQLite / PostgreSQL Ready</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-dark-850 border border-white/5">
              <span className="text-slate-400">ORM Engine</span>
              <span className="font-mono text-purple-400 font-bold">Prisma ORM v5.10</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-dark-850 border border-white/5">
              <span className="text-slate-400">Multi-User Architecture</span>
              <span className="font-mono text-emerald-400 font-bold">Enabled in User & Session Models</span>
            </div>
          </div>
        </div>

        {/* Object Storage Architecture */}
        <div className="p-6 rounded-2xl border border-white/10 bg-dark-900 shadow-glass space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-purple-400" /> Storage Architecture
          </h2>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-dark-850 border border-white/5">
              <span className="text-slate-400">Storage Provider</span>
              <span className="font-mono text-purple-400 font-bold">Local Disk / S3 Adapter</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-dark-850 border border-white/5">
              <span className="text-slate-400">Supported MIME Validation</span>
              <span className="font-mono text-emerald-400 font-bold">PDF, Images, Zip, Code files</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-dark-850 border border-white/5">
              <span className="text-slate-400">Max File Size</span>
              <span className="font-mono text-cyan-400 font-bold">50 MB</span>
            </div>
          </div>
        </div>

        {/* Security & Authentication */}
        <div className="p-6 rounded-2xl border border-white/10 bg-dark-900 shadow-glass space-y-4 md:col-span-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Security & Session Management
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-dark-850 border border-white/5 space-y-1">
              <div className="font-semibold text-white">Password Hashing</div>
              <div className="text-slate-400">Bcrypt / Argon2 encrypted hashes stored in DB.</div>
            </div>
            <div className="p-3 rounded-xl bg-dark-850 border border-white/5 space-y-1">
              <div className="font-semibold text-white">Session Security</div>
              <div className="text-slate-400">HTTP-Only secure cookies with 30-day expiration.</div>
            </div>
            <div className="p-3 rounded-xl bg-dark-850 border border-white/5 space-y-1">
              <div className="font-semibold text-white">Rate Limiting</div>
              <div className="text-slate-400">Express rate limiting on auth & API endpoints.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
