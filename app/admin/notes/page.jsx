'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { FileText, Trash2, ExternalLink } from 'lucide-react';

export default function AdminNotesPage() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const res = await api.get('/notes');
        if (res.data.success) setNotes(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchNotes();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Delete note?')) {
      try {
        await api.delete(`/notes/${id}`);
        setNotes(prev => prev.filter(n => n.id !== id));
      } catch (err) {
        alert('Failed to delete note');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-400" /> Markdown Notes
        </h1>
        <p className="text-xs text-slate-400">All markdown notes linked across topics</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-dark-900 shadow-glass overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/10 bg-dark-850 text-slate-400 font-semibold uppercase">
            <tr>
              <th className="p-4">Note Title</th>
              <th className="p-4">Topic</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {notes.map(n => (
              <tr key={n.id} className="hover:bg-white/5">
                <td className="p-4 font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>{n.title}</span>
                </td>
                <td className="p-4">
                  <Link href={`/topics/${n.topicId}`} className="text-cyan-400 hover:underline flex items-center gap-1">
                    <span>{n.topic?.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </Link>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(n.id)}
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
