'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { File, Download, Trash2, ExternalLink } from 'lucide-react';

export default function AdminFilesPage() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await api.get('/files');
        if (res.data.success) setFiles(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchFiles();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Delete file attachment?')) {
      try {
        await api.delete(`/files/${id}`);
        setFiles(prev => prev.filter(f => f.id !== id));
      } catch (err) {
        alert('Failed to delete file');
      }
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <File className="w-6 h-6 text-emerald-400" /> File Storage Manager
        </h1>
        <p className="text-xs text-slate-400">Manage object storage file attachments and metadata</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-dark-900 shadow-glass overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/10 bg-dark-850 text-slate-400 font-semibold uppercase">
            <tr>
              <th className="p-4">File Name</th>
              <th className="p-4">Size</th>
              <th className="p-4">Topic</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {files.map(f => (
              <tr key={f.id} className="hover:bg-white/5">
                <td className="p-4 font-bold text-white flex items-center gap-2">
                  <File className="w-4 h-4 text-emerald-400" />
                  <span>{f.originalName}</span>
                </td>
                <td className="p-4 font-mono text-slate-400">{formatBytes(f.size)}</td>
                <td className="p-4">
                  <Link href={`/topics/${f.topicId}`} className="text-cyan-400 hover:underline flex items-center gap-1">
                    <span>{f.topic?.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </Link>
                </td>
                <td className="p-4 text-right space-x-2">
                  <a
                    href={f.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="p-1.5 rounded inline-block bg-dark-800 text-slate-300 hover:text-cyan-400 hover:bg-white/10"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleDelete(f.id)}
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
