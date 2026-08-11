'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import api from '@/lib/api';
import {
  Code2,
  FileText,
  File,
  Sparkles,
  ArrowRight,
  Clock,
  Heart,
  FolderTree,
  Search,
  BookOpen,
  Terminal
} from 'lucide-react';

export default function PublicDashboard() {
  const [languages, setLanguages] = useState([]);
  const [recentTopics, setRecentTopics] = useState([]);
  const [favorites, setFavorites] = useState({ topics: [], codeSnippets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [langRes, topicRes, favRes] = await Promise.all([
          api.get('/languages'),
          api.get('/topics?limit=6'),
          api.get('/favorites')
        ]);

        if (langRes.data.success) setLanguages(langRes.data.data);
        if (topicRes.data.success) setRecentTopics(topicRes.data.data);
        if (favRes.data.success) setFavorites(favRes.data.data);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Compute total statistics
  const totalTopics = languages.reduce((acc, l) => acc + (l.topicCount || 0), 0);
  const totalCode = languages.reduce((acc, l) => acc + (l.codeCount || 0), 0);
  const totalFiles = languages.reduce((acc, l) => acc + (l.fileCount || 0), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-dark-900/90 p-8 sm:p-12 shadow-glass">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs font-semibold text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Knowledge OS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Organize <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Programming Intelligence</span> in One Space.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Structured workspace hierarchy: <span className="text-cyan-400 font-medium">Language</span> → <span className="text-purple-400 font-medium">Category</span> → <span className="text-blue-400 font-medium">Folder</span> → <span className="text-emerald-400 font-medium">Topic</span> with integrated Notes, Monaco Code Editor, Files, and Outputs.
            </p>
          </div>

          {/* Large Liquid Glass Logo Badge Display */}
          <div className="shrink-0">
            <Logo size="hero" showTagline={true} />
          </div>
        </div>
      </section>

      {/* Statistics Counter Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-white/10 bg-dark-900/60 backdrop-blur-md hover:border-cyan-500/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Languages</span>
            <Code2 className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">{languages.length}</div>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-dark-900/60 backdrop-blur-md hover:border-purple-500/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Topics</span>
            <BookOpen className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">{totalTopics}</div>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-dark-900/60 backdrop-blur-md hover:border-blue-500/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Code Snippets</span>
            <Terminal className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">{totalCode}</div>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-dark-900/60 backdrop-blur-md hover:border-emerald-500/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Files Stored</span>
            <File className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">{totalFiles}</div>
        </div>
      </section>

      {/* Programming Languages Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-cyan-400" /> Programming Languages
            </h2>
            <p className="text-xs text-slate-400">Explore knowledge organized by technology stack</p>
          </div>
          <Link href="/languages" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
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

              {/* Stats badges & Open Action */}
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
      </section>

      {/* Recently Updated Knowledge Topics */}
      {recentTopics.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" /> Recently Updated Topics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentTopics.map(topic => (
              <Link
                key={topic.id}
                href={`/topics/${topic.id}`}
                className="p-5 rounded-xl border border-white/10 bg-dark-900/60 hover:border-purple-500/40 hover:bg-dark-850 transition-all group flex items-start justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {topic.language?.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-purple-300">
                      {topic.difficulty}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white group-hover:text-purple-300 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{topic.description}</p>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
