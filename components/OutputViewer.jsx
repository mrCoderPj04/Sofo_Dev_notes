'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Terminal, Copy, Check, Save, Lock, CheckCircle2 } from 'lucide-react';

export default function OutputViewer({ topicId, outputs = [], readOnly = false, onOutputCreated, onOutputDeleted }) {
  const existingOutput = outputs?.[0];

  const [outputTitle, setOutputTitle] = useState(existingOutput?.title || 'Execution Output Log');
  const [outputContent, setOutputContent] = useState(existingOutput?.content || '');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (outputs && outputs[0]) {
      setOutputTitle(outputs[0].title || 'Execution Output Log');
      setOutputContent(outputs[0].content || '');
    }
  }, [outputs]);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveOutput = async () => {
    if (readOnly || !topicId) return;

    setSaving(true);
    try {
      if (existingOutput?.id) {
        const res = await api.put(`/outputs/${existingOutput.id}`, {
          title: outputTitle,
          type: 'CONSOLE',
          content: outputContent
        });
        if (res.data.success && onOutputCreated) {
          onOutputCreated(res.data.data);
        }
      } else {
        const res = await api.post('/outputs', {
          title: outputTitle || 'Execution Output Log',
          type: 'CONSOLE',
          content: outputContent,
          topicId
        });
        if (res.data.success && onOutputCreated) {
          onOutputCreated(res.data.data);
        }
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      alert('Failed to save output log');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-white/10 bg-dark-900 shadow-glass overflow-hidden">
      {/* Editor / Console Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-2.5 bg-dark-850">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <input
            type="text"
            value={outputTitle}
            onChange={(e) => !readOnly && setOutputTitle(e.target.value)}
            readOnly={readOnly}
            placeholder="Output Title (e.g. Console Execution Log)"
            className="bg-transparent text-sm font-semibold text-white placeholder-slate-500 focus:outline-none"
          />
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

        {/* Copy & Save Controls */}
        <div className="flex items-center gap-2">
          {/* Copy Output Button (Always available for visitors) */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 text-xs rounded border border-white/10 bg-dark-800 text-slate-300 hover:text-white hover:border-emerald-500/30 transition-all"
            title="Copy output text to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Output'}</span>
          </button>

          {/* Save Output Button (Hidden for unauthenticated users) */}
          {!readOnly && (
            <button
              onClick={handleSaveOutput}
              disabled={saving}
              className="flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold rounded bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-cyan-glow hover:opacity-90 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Output'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Terminal Output Console Box */}
      <div className="p-3 bg-black/90 min-h-[300px]">
        <textarea
          value={outputContent}
          onChange={(e) => !readOnly && setOutputContent(e.target.value)}
          readOnly={readOnly}
          placeholder={readOnly ? "// No output logs recorded." : "// Console Output Terminal Log\n// Paste stdout, stderr, execution results, or terminal logs here..."}
          className="w-full h-full min-h-[280px] p-3 rounded-lg bg-transparent font-mono text-xs text-emerald-400 placeholder-emerald-800 focus:outline-none resize-none leading-relaxed border-0"
        />
      </div>
    </div>
  );
}
