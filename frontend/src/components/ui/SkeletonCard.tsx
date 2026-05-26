import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-3 flex-1">
          <div className="h-4 bg-slate-200 rounded w-24" />
          <div className="h-6 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
        </div>
        <div className="w-10 h-10 bg-slate-200 rounded-full" />
      </div>
      <div className="flex gap-8 mt-4">
        <div className="h-5 bg-slate-200 rounded w-20" />
        <div className="h-5 bg-slate-200 rounded w-16" />
      </div>
    </div>
  );
}
