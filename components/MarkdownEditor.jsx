'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Eye, Edit3, Save, FileText, CheckCircle2, Lock } from 'lucide-react';

export default function MarkdownEditor({
  title = 'Markdown Note',
  content = '',
  readOnly = false,
  onSave
}) {
  const [markdown, setMarkdown] = useState(content);
  // Default to preview mode if readOnly
  const [activeTab, setActiveTab] = useState(readOnly ? 'preview' : 'split');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    if (onSave && !readOnly) {
      setSaving(true);
      await onSave(markdown);
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-white/10 bg-dark-900 shadow-glass overflow-hidden">
      {/* Editor Header Toolbar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 bg-dark-850">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-white">{title}</span>
          {readOnly && (
            <span className="flex items-center gap-1 text-[10px] text-slate-400 bg-dark-800 px-2 py-0.5 rounded border border-white/5">
              <Lock className="w-3 h-3 text-cyan-400" /> Read-Only
            </span>
          )}
          {savedSuccess && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> Saved
            </span>
          )}
        </div>

        {/* Tab Controls & Save (Hidden for readOnly) */}
        <div className="flex items-center gap-2">
          {!readOnly && (
            <div className="flex items-center p-0.5 rounded-lg bg-dark-800 border border-white/5">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                  activeTab === 'edit' ? 'bg-cyan-500/20 text-cyan-400 font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3 h-3 inline mr-1" /> Edit
              </button>
              <button
                onClick={() => setActiveTab('split')}
                className={`px-2.5 py-1 text-xs rounded-md transition-all hidden md:block ${
                  activeTab === 'split' ? 'bg-cyan-500/20 text-cyan-400 font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Split
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                  activeTab === 'preview' ? 'bg-cyan-500/20 text-cyan-400 font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3 h-3 inline mr-1" /> Preview
              </button>
            </div>
          )}

          {!readOnly && onSave && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-cyan-glow hover:opacity-90 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Note'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Content Area */}
      <div className={`grid grid-cols-1 ${!readOnly && activeTab === 'split' ? 'md:grid-cols-2' : ''} divide-y md:divide-y-0 md:divide-x divide-white/10 min-h-[350px]`}>
        {/* Write Pane (Only when authenticated & not readOnly) */}
        {!readOnly && (activeTab === 'edit' || activeTab === 'split') && (
          <div className={`p-3 ${activeTab === 'edit' ? 'col-span-2' : ''}`}>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Write Markdown notes here... (Headings, lists, code blocks, links)"
              className="w-full h-full min-h-[350px] p-3 rounded-lg bg-dark-950/60 border border-white/5 font-mono text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/40 resize-none leading-relaxed"
            />
          </div>
        )}

        {/* Live Preview Pane (Read-Only formatted text view) */}
        {(readOnly || activeTab === 'preview' || activeTab === 'split') && (
          <div className="p-5 overflow-y-auto max-h-[600px] prose prose-invert prose-cyan text-sm col-span-2 w-full">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdown || '*No note content recorded.*'}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
