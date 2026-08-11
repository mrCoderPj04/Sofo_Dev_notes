'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import {
  Code2,
  FolderTree,
  Tag,
  FileText,
  File,
  Terminal,
  Activity,
  Plus,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ languages: 0, folders: 0, topics: 0, notes: 0, code: 0, files: 0 });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const [langRes, topicRes, activityRes] = await Promise.all([
          api.get('/languages'),
          api.get('/topics'),
          api.get('/activity?limit=10')
        ]);

        if (langRes.data.success) {
          const langs = langRes.data.data;
          let topicCount = 0, codeCount = 0, fileCount = 0;
          langs.forEach(l => {
            topicCount += l.topicCount || 0;
            codeCount += l.codeCount || 0;
            fileCount += l.fileCount || 0;
          });
          setStats({
            languages: langs.length,
            topics: topicCount,
            code: codeCount,
            files: fileCount
          });
        }

        if (activityRes.data.success) {
          setActivities(activityRes.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchAdminData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-cyan-500/20 bg-dark-900 shadow-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">Owner Authenticated</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Developer Knowledge Control OS</h1>
          <p className="text-xs text-slate-400">Manage languages, folders, topics, notes, code snippets, files, and outputs</p>
        </div>

        <Link
          href="/admin/topics"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-cyan-glow hover:opacity-90 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Create New Topic
        </Link>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link href="/admin/languages" className="p-5 rounded-2xl border border-white/10 bg-dark-900/60 hover:border-cyan-500/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Languages</span>
            <Code2 className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{stats.languages}</div>
        </Link>

        <Link href="/admin/topics" className="p-5 rounded-2xl border border-white/10 bg-dark-900/60 hover:border-purple-500/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Topics</span>
            <Tag className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{stats.topics}</div>
        </Link>

        <Link href="/admin/code" className="p-5 rounded-2xl border border-white/10 bg-dark-900/60 hover:border-blue-500/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Code Snippets</span>
            <Terminal className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{stats.code}</div>
        </Link>

        <Link href="/admin/files" className="p-5 rounded-2xl border border-white/10 bg-dark-900/60 hover:border-emerald-500/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Files Stored</span>
            <File className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{stats.files}</div>
        </Link>
      </div>

      {/* Activity Log Feed */}
      <div className="p-6 rounded-2xl border border-white/10 bg-dark-900/60 shadow-glass space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" /> Recent Administrative Activity
          </h2>
          <Link href="/admin/activity" className="text-xs text-cyan-400 hover:underline">
            View All Audit Logs
          </Link>
        </div>

        {activities.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">No activity recorded yet.</div>
        ) : (
          <div className="space-y-2">
            {activities.map(act => (
              <div
                key={act.id}
                className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-dark-850 text-xs text-slate-300 flex-wrap gap-2"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                    act.action === 'CREATE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    act.action === 'UPDATE' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    act.action === 'DELETE' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  }`}>
                    {act.action}
                  </span>
                  <span className="font-semibold text-white">{act.entityType}</span>
                  <span className="text-slate-400">{act.details}</span>
                </div>
                <span className="text-[10px] text-slate-500">
                  {new Date(act.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
