'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Heart, Code2, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState({ topics: [], codeSnippets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavs() {
      try {
        const res = await api.get('/favorites');
        if (res.data.success) {
          setFavorites(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchFavs();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> Favorites Repository
        </h1>
        <p className="text-sm text-slate-400">Quick access to bookmarked topics and code snippets</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-cyan-400">
          <Sparkles className="w-4 h-4 animate-spin inline mr-2" /> Loading favorites...
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Favorite Topics */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" /> Favorite Topics ({favorites.topics?.length || 0})
            </h2>

            {favorites.topics?.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-white/10 rounded-2xl">
                No topics marked as favorite yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.topics.map(t => (
                  <Link
                    key={t.id}
                    href={`/topics/${t.id}`}
                    className="p-5 rounded-2xl border border-white/10 bg-dark-900/80 hover:border-cyan-500/40 hover:shadow-cyan-glow transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {t.language?.name}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors mt-2">
                        {t.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{t.description}</p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                      <span>{t._count?.codeSnippets || 0} snippets</span>
                      <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Favorite Code Snippets */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-purple-400" /> Favorite Code Snippets ({favorites.codeSnippets?.length || 0})
            </h2>

            {favorites.codeSnippets?.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-white/10 rounded-2xl">
                No code snippets marked as favorite yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favorites.codeSnippets.map(c => (
                  <Link
                    key={c.id}
                    href={`/topics/${c.topicId}`}
                    className="p-5 rounded-2xl border border-white/10 bg-dark-900/80 hover:border-purple-500/40 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white group-hover:text-purple-300">{c.title}</span>
                        <span className="text-[10px] uppercase font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                          {c.language}
                        </span>
                      </div>
                      <pre className="mt-3 p-3 rounded-lg bg-black/80 font-mono text-[11px] text-cyan-300 overflow-hidden max-h-24 leading-relaxed border border-white/5">
                        {c.code}
                      </pre>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
