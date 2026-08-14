'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import MarkdownEditor from '@/components/MarkdownEditor';
import MonacoCodeEditor from '@/components/MonacoCodeEditor';
import FileUploader from '@/components/FileUploader';
import OutputViewer from '@/components/OutputViewer';
import { useAuth } from '@/lib/authContext';
import {
  BookOpen,
  FileText,
  Code2,
  File,
  Terminal,
  Heart,
  Tag,
  Folder,
  Sparkles,
  ArrowLeft,
  Lock,
  LogIn
} from 'lucide-react';

export default function TopicWorkspacePage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [topic, setTopic] = useState(null);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes', 'code', 'files', 'outputs'
  const [loading, setLoading] = useState(true);

  const fetchTopic = async () => {
    try {
      const res = await api.get(`/topics/${id}`);
      if (res.data.success) {
        setTopic(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTopic();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-cyan-400 text-sm">
        <Sparkles className="w-5 h-5 animate-spin mr-2" /> Loading topic workspace...
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="text-center py-20 text-slate-400 text-sm">
        Topic knowledge record not found.
      </div>
    );
  }

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.post(`/topics/${topic.id}/favorite`);
      if (res.data.success) {
        setTopic(prev => ({ ...prev, isFavorite: res.data.data.isFavorite }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNote = async (content) => {
    if (!isAuthenticated) return;
    try {
      if (topic.notes && topic.notes[0]) {
        await api.put(`/notes/${topic.notes[0].id}`, { content });
      } else {
        await api.post('/notes', { title: `${topic.title} Notes`, content, topicId: topic.id });
      }
      fetchTopic();
    } catch (err) {
      alert('Failed to save note');
    }
  };

  const handleSaveCode = async ({ code, language }) => {
    if (!isAuthenticated) return;
    try {
      if (topic.codeSnippets && topic.codeSnippets[0]) {
        await api.put(`/code/${topic.codeSnippets[0].id}`, { code, language, incrementVersion: true });
      } else {
        await api.post('/code', { title: `${topic.title} Snippet`, code, language, topicId: topic.id });
      }
      fetchTopic();
    } catch (err) {
      alert('Failed to save code snippet');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Back Navigation & Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/languages/${topic.language?.slug || ''}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to {topic.language?.name || 'Language'}
        </Link>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <button
              onClick={handleToggleFavorite}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                topic.isFavorite
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                  : 'bg-dark-850 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${topic.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{topic.isFavorite ? 'Favorited' : 'Favorite'}</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>EMS Sign In to Edit</span>
            </Link>
          )}
        </div>
      </div>

      {/* Public Read-Only Banner for Unauthenticated Visitors */}
      {!isAuthenticated && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-xs text-cyan-300 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span><strong>Public Read-Only Mode:</strong> You are viewing formatted notes, code, files, and outputs. Only logged-in EMS Team Leaders can edit or save records.</span>
          </div>
          <Link href="/login" className="font-bold underline text-cyan-200 hover:text-white shrink-0 ml-2">
            Sign In
          </Link>
        </div>
      )}

      {/* Topic Title & Breadcrumbs */}
      <div className="p-6 sm:p-8 rounded-3xl border border-cyan-500/20 bg-dark-900 shadow-glass space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-0.5 rounded-md font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            {topic.language?.name}
          </span>
          {topic.folder && (
            <span className="flex items-center gap-1 text-slate-400">
              <Folder className="w-3.5 h-3.5 text-purple-400" /> {topic.folder.name}
            </span>
          )}
          <span className="px-2.5 py-0.5 rounded-md font-bold uppercase text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20">
            {topic.difficulty}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">{topic.title}</h1>

        {topic.description && (
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            {topic.description}
          </p>
        )}

        {/* Tags */}
        {topic.topicTags && topic.topicTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {topic.topicTags.map(tt => (
              <span key={tt.tagId} className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                #{tt.tag?.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Tabs (Notes, Code, Files, Outputs) */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'notes'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-cyan-glow'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Notes ({topic.notes?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'code'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-purple-glow'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Code Editor ({topic.codeSnippets?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('files')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'files'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-glass'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <File className="w-4 h-4" />
          <span>Files ({topic.files?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('outputs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'outputs'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-glass'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Outputs ({topic.outputs?.length || 0})</span>
        </button>
      </div>

      {/* Tab Panels with readOnly={!isAuthenticated} */}
      <div className="space-y-6">
        
        {/* Markdown Notes Tab */}
        {activeTab === 'notes' && (
          <MarkdownEditor
            title={`${topic.title} - Notes`}
            content={topic.notes?.[0]?.content || ''}
            readOnly={!isAuthenticated}
            onSave={handleSaveNote}
          />
        )}

        {/* Monaco Code Editor Tab */}
        {activeTab === 'code' && (
          <MonacoCodeEditor
            title={topic.codeSnippets?.[0]?.title || `${topic.title} Snippet`}
            code={topic.codeSnippets?.[0]?.code || '# Code snippet\n'}
            language={topic.codeSnippets?.[0]?.language || 'python'}
            version={topic.codeSnippets?.[0]?.version || 1}
            readOnly={!isAuthenticated}
            onSave={handleSaveCode}
          />
        )}

        {/* File Management Tab */}
        {activeTab === 'files' && (
          <FileUploader
            topicId={topic.id}
            files={topic.files || []}
            readOnly={!isAuthenticated}
            onFileUploaded={() => fetchTopic()}
            onFileDeleted={() => fetchTopic()}
          />
        )}

        {/* Dedicated Output System Tab */}
        {activeTab === 'outputs' && (
          <OutputViewer
            topicId={topic.id}
            outputs={topic.outputs || []}
            readOnly={!isAuthenticated}
            onOutputCreated={() => fetchTopic()}
            onOutputDeleted={() => fetchTopic()}
          />
        )}
      </div>
    </div>
  );
}
