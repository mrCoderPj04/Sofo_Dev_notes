'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Code2, Trash2, ExternalLink } from 'lucide-react';

export default function AdminCodePage() {
  const [snippets, setSnippets] = useState([]);

  useEffect(() => {
    async function fetchSnippets() {
      try {
        const res = await api.get('/code');
        if (res.data.success) setSnippets(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchSnippets();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Delete code snippet?')) {
      try {
        await api.delete(`/code/${id}`);
        setSnippets(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        alert('Failed to delete code snippet');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Code2 className="w-6 h-6 text-purple-400" /> Code Snippets Repository
        </h1>
        <p className="text-xs text-slate-400">All Monaco code snippets across topics</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-dark-900 shadow-glass overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/10 bg-dark-850 text-slate-400 font-semibold uppercase">
            <tr>
              <th className="p-4">Snippet Title</th>
              <th className="p-4">Language</th>
              <th className="p-4">Topic</th>
              <th className="p-4 text-center">Version</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {snippets.map(c => (
              <tr key={c.id} className="hover:bg-white/5">
                <td className="p-4 font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-400" />
                  <span>{c.title}</span>
                </td>
                <td className="p-4 text-purple-400 uppercase font-mono font-semibold">{c.language}</td>
                <td className="p-4">
                  <Link href={`/topics/${c.topicId}`} className="text-cyan-400 hover:underline flex items-center gap-1">
                    <span>{c.topic?.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </Link>
                </td>
                <td className="p-4 text-center font-mono text-cyan-400">v{c.version}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(c.id)}
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
