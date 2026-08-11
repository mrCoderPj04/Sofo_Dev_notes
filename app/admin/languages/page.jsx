'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Code2, Plus, Edit2, Trash2, X, Sparkles } from 'lucide-react';

export default function AdminLanguagesPage() {
  const [languages, setLanguages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLang, setEditingLang] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchLanguages = async () => {
    try {
      const res = await api.get('/languages');
      if (res.data.success) setLanguages(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const handleOpenModal = (lang = null) => {
    if (lang) {
      setEditingLang(lang);
      setName(lang.name);
      setDescription(lang.description || '');
    } else {
      setEditingLang(null);
      setName('');
      setDescription('');
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    setSubmitting(true);
    try {
      if (editingLang) {
        await api.put(`/languages/${editingLang.id}`, { name, description });
      } else {
        await api.post('/languages', { name, description });
      }
      setShowModal(false);
      fetchLanguages();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save language');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this language and associated knowledge topics?')) {
      try {
        await api.delete(`/languages/${id}`);
        fetchLanguages();
      } catch (err) {
        alert('Failed to delete language');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Code2 className="w-6 h-6 text-cyan-400" /> Language Management
          </h1>
          <p className="text-xs text-slate-400">Add, edit, or delete programming languages</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-cyan-glow hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Language
        </button>
      </div>

      {/* Languages Table */}
      <div className="rounded-2xl border border-white/10 bg-dark-900 shadow-glass overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/10 bg-dark-850 text-slate-400 font-semibold uppercase tracking-wider">
            <tr>
              <th className="p-4">Language</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-center">Topics</th>
              <th className="p-4 text-center">Code Snippets</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {languages.map(lang => (
              <tr key={lang.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-bold text-white flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-extrabold">
                    {lang.name[0]}
                  </div>
                  <span>{lang.name}</span>
                </td>
                <td className="p-4 text-slate-400 line-clamp-1">{lang.description || '-'}</td>
                <td className="p-4 text-center font-mono text-cyan-400">{lang.topicCount || 0}</td>
                <td className="p-4 text-center font-mono text-purple-400">{lang.codeCount || 0}</td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenModal(lang)}
                    className="p-1.5 rounded bg-dark-800 text-slate-300 hover:text-cyan-400 hover:bg-white/10"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(lang.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl border border-cyan-500/30 bg-dark-900 shadow-glass">
            <h3 className="text-base font-bold text-white mb-4">
              {editingLang ? 'Edit Language' : 'Create New Language'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Language Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rust, Go, Flutter"
                  className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description..."
                  className="w-full h-20 px-3 py-2 rounded-lg bg-dark-800 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-cyan-glow"
                >
                  {submitting ? 'Saving...' : 'Save Language'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
