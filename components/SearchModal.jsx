'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Search, Code2, FileText, Folder, Tag, Terminal, File, Sparkles, X } from 'lucide-react';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        if (res.data.success) {
          setResults(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/80 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-cyan-500/20 bg-dark-900 shadow-glass">
        
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3 bg-dark-850">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search languages, folders, topics, code snippets, notes..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-8 text-xs text-cyan-400">
              <Sparkles className="w-4 h-4 animate-spin mr-2" /> Searching knowledge base...
            </div>
          )}

          {!loading && results && (
            <>
              {/* Topics */}
              {results.topics?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Topics ({results.topics.length})
                  </h4>
                  <div className="space-y-1.5">
                    {results.topics.map(t => (
                      <Link
                        key={t.id}
                        href={`/topics/${t.id}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-white/5 bg-dark-800/60 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all group"
                      >
                        <div>
                          <div className="text-sm font-semibold text-white group-hover:text-cyan-400">{t.title}</div>
                          <div className="text-xs text-slate-400 line-clamp-1">{t.description}</div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {t.language?.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Code Snippets */}
              {results.codeSnippets?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-purple-400" /> Code Snippets ({results.codeSnippets.length})
                  </h4>
                  <div className="space-y-1.5">
                    {results.codeSnippets.map(c => (
                      <Link
                        key={c.id}
                        href={`/topics/${c.topicId}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-white/5 bg-dark-800/60 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all group"
                      >
                        <div className="flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-purple-400" />
                          <span className="text-sm font-medium text-white group-hover:text-purple-300">{c.title}</span>
                        </div>
                        <span className="text-[10px] uppercase font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                          {c.language}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Markdown Notes */}
              {results.notes?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-400" /> Notes ({results.notes.length})
                  </h4>
                  <div className="space-y-1.5">
                    {results.notes.map(n => (
                      <Link
                        key={n.id}
                        href={`/topics/${n.topicId}`}
                        onClick={onClose}
                        className="block p-2.5 rounded-lg border border-white/5 bg-dark-800/60 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all group"
                      >
                        <div className="text-sm font-medium text-white group-hover:text-blue-300">{n.title}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {results.topics?.length === 0 && results.codeSnippets?.length === 0 && results.notes?.length === 0 && (
                <div className="text-center py-8 text-sm text-slate-400">
                  No matching knowledge entries found for "<span className="text-cyan-400">{query}</span>"
                </div>
              )}
            </>
          )}

          {!query && (
            <div className="text-center py-8 text-xs text-slate-400">
              Type to search across languages, categories, folders, topics, code & notes...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
