'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Activity, Clock, ShieldCheck } from 'lucide-react';

export default function AdminActivityPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await api.get('/activity?limit=100');
        if (res.data.success) setLogs(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-cyan-400" /> Administrative Audit Trail
        </h1>
        <p className="text-xs text-slate-400">Track all CRUD, login, logout, and file upload activities</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-dark-900 shadow-glass overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/10 bg-dark-850 text-slate-400 font-semibold uppercase">
            <tr>
              <th className="p-4">Action</th>
              <th className="p-4">Entity</th>
              <th className="p-4">Audit Details</th>
              <th className="p-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-white/5">
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                    log.action === 'CREATE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    log.action === 'UPDATE' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    log.action === 'DELETE' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    log.action === 'LOGIN' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                    'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="p-4 font-bold text-white">{log.entityType}</td>
                <td className="p-4 text-slate-300">{log.details || '-'}</td>
                <td className="p-4 text-slate-500 font-mono text-[11px]">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
