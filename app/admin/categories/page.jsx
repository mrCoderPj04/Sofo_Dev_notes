'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Layers, Plus, Trash2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [name, setName] = useState('');
  const [languageId, setLanguageId] = useState('');

  const fetchData = async () => {
    try {
      const [catRes, langRes] = await Promise.all([
        api.get('/categories'),
        api.get('/languages')
      ]);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (langRes.data.success) setLanguages(langRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !languageId) return;

    try {
      await api.post('/categories', { name, languageId });
      setName('');
      fetchData();
    } catch (err) {
      alert('Failed to create category');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete category?')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchData();
      } catch (err) {
        alert('Failed to delete category');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-purple-400" /> Category Management
        </h1>
        <p className="text-xs text-slate-400">Organize topics into logical categories per language</p>
      </div>

      {/* Create Form */}
      <form onSubmit={handleCreate} className="p-4 rounded-2xl border border-white/10 bg-dark-900 shadow-glass flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category Name (e.g. Web Development, Algorithms)"
          className="flex-1 min-w-[200px] px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
          required
        />
        <select
          value={languageId}
          onChange={(e) => setLanguageId(e.target.value)}
          className="px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white focus:outline-none"
          required
        >
          <option value="">Select Language</option>
          {languages.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 rounded-xl font-bold text-xs bg-purple-600 text-white shadow-purple-glow hover:opacity-90 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </form>

      {/* List Table */}
      <div className="rounded-2xl border border-white/10 bg-dark-900 shadow-glass overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/10 bg-dark-850 text-slate-400 font-semibold uppercase">
            <tr>
              <th className="p-4">Category</th>
              <th className="p-4">Language</th>
              <th className="p-4 text-center">Topics</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {categories.map(c => (
              <tr key={c.id} className="hover:bg-white/5">
                <td className="p-4 font-bold text-white">{c.name}</td>
                <td className="p-4 text-cyan-400">{c.language?.name}</td>
                <td className="p-4 text-center font-mono text-purple-400">{c._count?.topics || 0}</td>
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
