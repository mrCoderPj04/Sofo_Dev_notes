'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import FolderTree from '@/components/FolderTree';
import { FolderTree as FolderIcon, Plus, X } from 'lucide-react';

export default function AdminFoldersPage() {
  const [folderTree, setFolderTree] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [parentFolderId, setParentFolderId] = useState(null);
  const [folderName, setFolderName] = useState('');

  const fetchFolders = async () => {
    try {
      const query = selectedLanguageId ? `?languageId=${selectedLanguageId}` : '';
      const [treeRes, langRes] = await Promise.all([
        api.get(`/folders${query}`),
        api.get('/languages')
      ]);

      if (treeRes.data.success) setFolderTree(treeRes.data.data);
      if (langRes.data.success) setLanguages(langRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [selectedLanguageId]);

  const handleOpenCreateModal = (parentId = null) => {
    setParentFolderId(parentId);
    setFolderName('');
    setShowModal(true);
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!folderName) return;

    const targetLangId = selectedLanguageId || (languages[0] ? languages[0].id : '');
    if (!targetLangId) {
      alert('Please select a language first');
      return;
    }

    try {
      await api.post('/folders', {
        name: folderName,
        languageId: targetLangId,
        parentId: parentFolderId
      });
      setShowModal(false);
      fetchFolders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create folder');
    }
  };

  const handleDeleteFolder = async (id) => {
    if (confirm('Delete folder and all subfolders?')) {
      try {
        await api.delete(`/folders/${id}`);
        fetchFolders();
      } catch (err) {
        alert('Failed to delete folder');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FolderIcon className="w-6 h-6 text-cyan-400" /> Folder Hierarchy System
          </h1>
          <p className="text-xs text-slate-400">Manage nested folders (Python → Basics → Loops / OOP → Classes)</p>
        </div>

        {/* Language Filter & Add Root Folder */}
        <div className="flex items-center gap-2">
          <select
            value={selectedLanguageId}
            onChange={(e) => setSelectedLanguageId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs text-white focus:outline-none"
          >
            <option value="">All Languages</option>
            {languages.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>

          <button
            onClick={() => handleOpenCreateModal(null)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-cyan-glow"
          >
            <Plus className="w-4 h-4" /> Root Folder
          </button>
        </div>
      </div>

      {/* Folder Tree Display */}
      <div className="p-6 rounded-2xl border border-white/10 bg-dark-900 shadow-glass">
        <FolderTree
          folders={folderTree}
          onCreateFolder={(parentId) => handleOpenCreateModal(parentId)}
          onDeleteFolder={(id) => handleDeleteFolder(id)}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl border border-cyan-500/30 bg-dark-900 shadow-glass">
            <h3 className="text-base font-bold text-white mb-4">
              {parentFolderId ? 'Create Subfolder' : 'Create Root Folder'}
            </h3>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Target Language</label>
                <select
                  value={selectedLanguageId}
                  onChange={(e) => setSelectedLanguageId(e.target.value)}
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
                <label className="block text-xs text-slate-400 mb-1">Folder Name</label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="e.g. Data Structures, Algorithms, Projects"
                  className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
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
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
