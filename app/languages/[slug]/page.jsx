'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import FolderTree from '@/components/FolderTree';
import { Code2, Folder, BookOpen, ArrowRight, Sparkles, Filter, ChevronRight } from 'lucide-react';

export default function LanguageDetailPage() {
  const { slug } = useParams();
  const [language, setLanguage] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLanguageDetail() {
      try {
        const res = await api.get(`/languages/${slug}`);
        if (res.data.success) {
          setLanguage(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchLanguageDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-cyan-400 text-sm">
        <Sparkles className="w-5 h-5 animate-spin mr-2" /> Loading language workspace...
      </div>
    );
  }

  if (!language) {
    return (
      <div className="text-center py-20 text-slate-400 text-sm">
        Language knowledge base not found.
      </div>
    );
  }

  // Filter topics by selected folder if active
  const filteredTopics = selectedFolderId
    ? language.topics.filter(t => t.folderId === selectedFolderId)
    : language.topics;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-cyan-500/20 bg-dark-900 shadow-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-cyan-300 font-extrabold text-2xl shadow-cyan-glow">
            {language.name[0]}
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">{language.name}</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              {language.description || 'Structured knowledge base and code repository.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            {language.topics?.length || 0} Topics Available
          </span>
        </div>
      </div>

      {/* Main Workspace Layout (Folder Tree + Topics) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Folder Hierarchy Navigation */}
        <div className="md:col-span-1 p-4 rounded-2xl border border-white/10 bg-dark-900/60 shadow-glass h-fit space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-bold text-white">Structure</span>
            {selectedFolderId && (
              <button
                onClick={() => setSelectedFolderId(null)}
                className="text-[10px] text-cyan-400 hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          <FolderTree
            folders={language.folders || []}
            selectedFolderId={selectedFolderId}
            onSelectFolder={(id) => setSelectedFolderId(id === selectedFolderId ? null : id)}
            readOnly={true}
          />
        </div>

        {/* Right Topics Grid */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" /> Topics ({filteredTopics.length})
            </h2>
          </div>

          {filteredTopics.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-white/10 rounded-2xl">
              No topics created in this folder yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredTopics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/topics/${topic.id}`}
                  className="p-5 rounded-2xl border border-white/10 bg-dark-900/80 hover:border-cyan-500/40 hover:bg-dark-850 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {topic.difficulty}
                      </span>
                      {topic.folder && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Folder className="w-3 h-3 text-cyan-400" /> {topic.folder.name}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {topic.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-3 text-[11px]">
                      <span>{topic._count?.notes || 0} notes</span>
                      <span>•</span>
                      <span>{topic._count?.codeSnippets || 0} code</span>
                      <span>•</span>
                      <span>{topic._count?.files || 0} files</span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
