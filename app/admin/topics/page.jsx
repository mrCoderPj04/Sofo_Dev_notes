'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Tag, Plus, Copy, Edit2, Trash2, ExternalLink, Sparkles } from 'lucide-react';

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [folders, setFolders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [languageId, setLanguageId] = useState('');
  const [folderId, setFolderId] = useState('');
  const [difficulty, setDifficulty] = useState('INTERMEDIATE');
  const [tagsInput, setTagsInput] = useState('');

  const fetchData = async () => {
    try {
      const [topRes, langRes, foldRes] = await Promise.all([
        api.get('/topics'),
        api.get('/languages'),
        api.get('/folders')
      ]);
      if (topRes.data.success) setTopics(topRes.data.data);
      if (langRes.data.success) setLanguages(langRes.data.data);
      if (foldRes.data.success) setFolders(foldRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (topic = null) => {
    if (topic) {
      setEditingTopic(topic);
      setTitle(topic.title);
      setDescription(topic.description || '');
      setLanguageId(topic.languageId);
      setFolderId(topic.folderId || '');
      setDifficulty(topic.difficulty);
      setTagsInput(topic.topicTags ? topic.topicTags.map(tt => `#${tt.tag?.name}`).join(', ') : '');
    } else {
      setEditingTopic(null);
      setTitle('');
      setDescription('');
      setLanguageId(languages[0]?.id || '');
      setFolderId('');
      setDifficulty('INTERMEDIATE');
      setTagsInput('#python, #backend');
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !languageId) return;

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    try {
      if (editingTopic) {
        await api.put(`/topics/${editingTopic.id}`, {
          title,
          description,
          languageId,
          folderId,
          difficulty
        });
      } else {
        await api.post('/topics', {
          title,
          description,
          languageId,
          folderId,
          difficulty,
          tags
        });
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert('Failed to save topic');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await api.post(`/topics/${id}/duplicate`);
      fetchData();
    } catch (err) {
      alert('Failed to duplicate topic');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete topic and all associated notes/code/files?')) {
      try {
        await api.delete(`/topics/${id}`);
        fetchData();
      } catch (err) {
        alert('Failed to delete topic');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-purple-400" /> Topic Management
          </h1>
          <p className="text-xs text-slate-400">Create, edit, duplicate, or move topics in workspace hierarchy</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-cyan-glow"
        >
          <Plus className="w-4 h-4" /> Create Topic
        </button>
      </div>

      {/* Topics Table */}
      <div className="rounded-2xl border border-white/10 bg-dark-900 shadow-glass overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/10 bg-dark-850 text-slate-400 font-semibold uppercase">
            <tr>
              <th className="p-4">Topic Title</th>
              <th className="p-4">Language</th>
              <th className="p-4">Folder</th>
              <th className="p-4">Difficulty</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {topics.map(t => (
              <tr key={t.id} className="hover:bg-white/5">
                <td className="p-4">
                  <Link href={`/topics/${t.id}`} className="font-bold text-white hover:text-cyan-400 flex items-center gap-1.5">
                    <span>{t.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </Link>
                  <div className="text-[10px] text-slate-400 line-clamp-1">{t.description}</div>
                </td>
                <td className="p-4 text-cyan-400 font-semibold">{t.language?.name}</td>
                <td className="p-4 text-slate-400">{t.folder?.name || '-'}</td>
                <td className="p-4 font-mono uppercase font-bold text-purple-400">{t.difficulty}</td>
                <td className="p-4 text-right space-x-1.5">
                  <button
                    onClick={() => handleDuplicate(t.id)}
                    className="p-1.5 rounded bg-dark-800 text-slate-300 hover:text-purple-400 hover:bg-white/10"
                    title="Duplicate topic"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenModal(t)}
                    className="p-1.5 rounded bg-dark-800 text-slate-300 hover:text-cyan-400 hover:bg-white/10"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
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
          <div className="w-full max-w-lg p-6 rounded-2xl border border-cyan-500/30 bg-dark-900 shadow-glass">
            <h3 className="text-base font-bold text-white mb-4">
              {editingTopic ? 'Edit Topic' : 'Create New Knowledge Topic'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Topic Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Python Decorators & Generators"
                  className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Language</label>
                  <select
                    value={languageId}
                    onChange={(e) => setLanguageId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-white/10 text-xs text-white"
                    required
                  >
                    <option value="">Select Language</option>
                    {languages.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-white/10 text-xs text-white"
                  >
                    <option value="BEGINNER">BEGINNER</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Folder (Optional)</label>
                <select
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-white/10 text-xs text-white"
                >
                  <option value="">No Folder (Root level)</option>
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of what this topic covers..."
                  className="w-full h-16 px-3 py-2 rounded-lg bg-dark-800 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="#python, #oop, #backend"
                  className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-white/10 text-xs text-white focus:outline-none"
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
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-cyan-glow"
                >
                  Save Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
