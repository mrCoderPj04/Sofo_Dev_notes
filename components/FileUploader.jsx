'use client';

import React, { useState } from 'react';
import api from '@/lib/api';
import { UploadCloud, FileText, Image as ImageIcon, Download, Trash2, Lock } from 'lucide-react';

export default function FileUploader({ topicId, files = [], readOnly = false, onFileUploaded, onFileDeleted }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async (selectedFiles) => {
    if (readOnly || !selectedFiles || selectedFiles.length === 0 || !topicId) return;

    setUploading(true);
    setUploadProgress(20);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('topicId', topicId);

      try {
        setUploadProgress(50);
        const res = await api.post('/files/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setUploadProgress(100);
        if (res.data.success && onFileUploaded) {
          onFileUploaded(res.data.data);
        }
      } catch (err) {
        alert(err.response?.data?.message || 'File upload failed');
      }
    }

    setUploading(false);
    setUploadProgress(0);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (readOnly) return;
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (readOnly) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const handleDelete = async (fileId) => {
    if (readOnly) return;
    if (confirm('Are you sure you want to delete this file attachment?')) {
      try {
        await api.delete(`/files/${fileId}`);
        if (onFileDeleted) onFileDeleted(fileId);
      } catch (err) {
        alert('Failed to delete file');
      }
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Zone (Only for authenticated logged-in users) */}
      {!readOnly && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all cursor-pointer ${
            dragActive
              ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
              : 'border-white/10 bg-dark-900/60 hover:border-cyan-500/30 hover:bg-dark-850'
          }`}
        >
          <input
            type="file"
            multiple
            onChange={(e) => handleUpload(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <UploadCloud className="w-10 h-10 text-cyan-400 mb-2 animate-bounce" />
          <p className="text-sm font-semibold text-white">Drag & drop files here, or click to browse</p>
          <p className="text-xs text-slate-400 mt-1">
            Supports PDF, DOC, Images, Zip, Code files (PY, JS, TS, CPP, JSON, etc.) up to 50MB
          </p>

          {uploading && (
            <div className="w-full max-w-xs mt-3">
              <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-cyan-400 text-center mt-1">Uploading...</p>
            </div>
          )}
        </div>
      )}

      {/* Files Grid / List */}
      {files.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-white/10 rounded-xl">
          No files attached to this topic yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {files.map(file => {
            const isImage = file.mimeType?.startsWith('image/');
            return (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-dark-850 hover:border-cyan-500/30 transition-all group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 rounded bg-dark-800 text-cyan-400 border border-white/5">
                    {isImage ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-medium text-white truncate">{file.originalName}</div>
                    <div className="text-[10px] text-slate-400">{formatBytes(file.size)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-white/10"
                    title="Download file"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>

                  {!readOnly && (
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                      title="Delete file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
