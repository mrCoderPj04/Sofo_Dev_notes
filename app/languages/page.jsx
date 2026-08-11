'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Code2, ArrowRight, Clock, Sparkles } from 'lucide-react';

export default function LanguagesPage() {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLanguages() {
      try {
        const res = await api.get('/languages');
        if (res.data.success) {
          setLanguages(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLanguages();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <Code2 className="w-6 h-6 text-cyan-400" /> Programming Languages
        </h1>
        <p className="text-sm text-slate-400">Browse organized knowledge bases by technology stack</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {languages.map((lang) => (
          <div
            key={lang.id}
            className="p-6 rounded-2xl border border-white/10 bg-dark-900/80 backdrop-blur-md hover:border-cyan-500/40 hover:shadow-cyan-glow transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-cyan-300 font-bold text-lg group-hover:scale-105 transition-transform">
                    {lang.name[0]}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {lang.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Updated {new Date(lang.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                {lang.description || 'Comprehensive programming knowledge, snippets, and notes.'}
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
                <span>{lang.topicCount || 0} topics</span>
                <span>•</span>
                <span>{lang.codeCount || 0} code</span>
              </div>

              <Link
                href={`/languages/${lang.slug}`}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all flex items-center gap-1"
              >
                Open <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
