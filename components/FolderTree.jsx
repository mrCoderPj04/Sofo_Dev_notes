'use client';

import React, { useState } from 'react';
import { Folder, FolderOpen, ChevronRight, ChevronDown, Plus, Trash2, Edit2, FileCode } from 'lucide-react';

export default function FolderTree({
  folders = [],
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
  readOnly = false
}) {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id, e) => {
    e.stopPropagation();
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderFolderNode = (folder) => {
    const isExpanded = !!expanded[folder.id];
    const isSelected = selectedFolderId === folder.id;
    const hasChildren = folder.children && folder.children.length > 0;

    return (
      <div key={folder.id} className="select-none my-0.5">
        <div
          onClick={() => onSelectFolder && onSelectFolder(folder.id)}
          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
            isSelected
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-cyan-glow'
              : 'text-slate-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {hasChildren ? (
              <button
                onClick={(e) => toggleExpand(folder.id, e)}
                className="p-0.5 text-slate-400 hover:text-cyan-400"
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <span className="w-3.5 h-3.5" />
            )}

            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-cyan-400 shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-cyan-500/70 shrink-0" />
            )}

            <span className="truncate">{folder.name}</span>
          </div>

          <div className="flex items-center gap-1 opacity-80 hover:opacity-100">
            {folder._count?.topics !== undefined && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-dark-800 text-slate-400 border border-white/5">
                {folder._count.topics}
              </span>
            )}

            {!readOnly && onCreateFolder && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateFolder(folder.id);
                }}
                className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-white/10"
                title="Add subfolder"
              >
                <Plus className="w-3 h-3" />
              </button>
            )}

            {!readOnly && onDeleteFolder && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFolder(folder.id);
                }}
                className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                title="Delete folder"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Children Render */}
        {hasChildren && isExpanded && (
          <div className="pl-4 border-l border-white/10 ml-3">
            {folder.children.map(child => renderFolderNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Folder className="w-3.5 h-3.5 text-cyan-400" /> Folders
        </h4>
        {!readOnly && onCreateFolder && (
          <button
            onClick={() => onCreateFolder(null)}
            className="flex items-center gap-1 px-2 py-0.5 text-[11px] rounded border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all"
          >
            <Plus className="w-3 h-3" /> New Folder
          </button>
        )}
      </div>

      {folders.length === 0 ? (
        <div className="text-xs text-slate-500 italic py-2">No folders created yet.</div>
      ) : (
        folders.map(folder => renderFolderNode(folder))
      )}
    </div>
  );
}
