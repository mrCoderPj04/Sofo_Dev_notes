'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Check, Download, Save, Code2, Lock } from 'lucide-react';

const SUPPORTED_LANGUAGES = [
  { id: 'python', name: 'Python' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'java', name: 'Java' },
  { id: 'c', name: 'C' },
  { id: 'cpp', name: 'C++' },
  { id: 'csharp', name: 'C#' },
  { id: 'html', name: 'HTML' },
  { id: 'css', name: 'CSS' },
  { id: 'sql', name: 'SQL' },
  { id: 'json', name: 'JSON' },
  { id: 'shell', name: 'Bash' }
];

export default function MonacoCodeEditor({
  title = 'Code Snippet',
  code = '',
  language = 'python',
  version = 1,
  readOnly = false,
  onSave,
  onChangeLanguage
}) {
  const [currentCode, setCurrentCode] = useState(code);
  const [currentLang, setCurrentLang] = useState(language);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extensions = {
      python: 'py', javascript: 'js', typescript: 'ts', java: 'java',
      c: 'c', cpp: 'cpp', csharp: 'cs', html: 'html', css: 'css',
      sql: 'sql', json: 'json', shell: 'sh'
    };
    const ext = extensions[currentLang] || 'txt';
    const blob = new Blob([currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveInternal = async () => {
    if (onSave && !readOnly) {
      setSaving(true);
      await onSave({ code: currentCode, language: currentLang });
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-white/10 bg-dark-900 shadow-glass overflow-hidden">
      {/* Editor Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-2.5 bg-dark-850">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold text-white">{title}</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            v{version}
          </span>
          {readOnly && (
            <span className="flex items-center gap-1 text-[10px] text-slate-400 bg-dark-800 px-2 py-0.5 rounded border border-white/5">
              <Lock className="w-3 h-3 text-cyan-400" /> Read-Only
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <select
            value={currentLang}
            onChange={(e) => {
              setCurrentLang(e.target.value);
              if (onChangeLanguage) onChangeLanguage(e.target.value);
            }}
            disabled={readOnly}
            className="px-2 py-1 text-xs rounded border border-white/10 bg-dark-800 text-slate-300 focus:outline-none focus:border-cyan-500 disabled:opacity-70"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded border border-white/10 bg-dark-800 text-slate-300 hover:text-white hover:border-cyan-500/30 transition-all"
            title="Copy code text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded border border-white/10 bg-dark-800 text-slate-300 hover:text-white hover:border-purple-500/30 transition-all"
            title="Download snippet file"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Download</span>
          </button>

          {/* Save Button (Hidden for readOnly) */}
          {!readOnly && onSave && (
            <button
              onClick={handleSaveInternal}
              disabled={saving}
              className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-cyan-glow hover:opacity-90 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Snippet'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="h-80 w-full bg-[#1e1e1e]">
        <Editor
          height="100%"
          language={currentLang}
          value={currentCode}
          onChange={(val) => !readOnly && setCurrentCode(val || '')}
          theme="vs-dark"
          options={{
            readOnly,
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: 'on',
            folding: true,
            tabSize: 2,
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace"
          }}
        />
      </div>
    </div>
  );
}
