'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Terminal, Trash2, ExternalLink } from 'lucide-react';

export default function AdminOutputsPage() {
  const [outputs, setOutputs] = useState([]);

  useEffect(() => {
    async function fetchOutputs() {
      try {
        const res = await api.get('/outputs');
        if (res.data.success) setOutputs(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchOutputs();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Delete output entry?')) {
      try {
        await api.delete(`/outputs/${id}`);
        setOutputs(prev => prev.filter(o => o.id !== id));
      } catch (err) {
        alert('Failed to delete output');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Terminal className="w-6 h-6 text-purple-400" /> Output Repository
        </h1>
        <p className="text-xs text-slate-400">All console logs, screenshots, and test execution results</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-dark-900 shadow-glass overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/10 bg-dark-850 text-slate-400 font-semibold uppercase">
            <tr>
              <th className="p-4">Output Title</th>
              <th className="p-4">Type</th>
              <th className="p-4">Topic</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {outputs.map(o => (
              <tr key={o.id} className="hover:bg-white/5">
                <td className="p-4 font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span>{o.title}</span>
                </td>
                <td className="p-4 font-mono uppercase text-purple-400">{o.type}</td>
                <td className="p-4">
                  <Link href={`/topics/${o.topicId}`} className="text-cyan-400 hover:underline flex items-center gap-1">
                    <span>{o.topic?.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </Link>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(o.id)}
                    className="p-1.5 rounded bg-dark-800 text-slate-300 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
