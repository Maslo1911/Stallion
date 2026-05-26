import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Horse } from '../../types';
import { cn } from '../../lib/utils';

interface HorseCardProps {
  key?: any;
  horse: Horse;
  owner?: any;
  onClick?: () => void;
}

export function HorseCard({ horse, owner, onClick }: HorseCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-6 bg-white border border-slate-200 rounded-2xl group transition-all shadow-sm shadow-slate-200/50",
        onClick ? "cursor-pointer hover:border-blue-600" : ""
      )}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
          🐎
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors tracking-tight font-display">{horse.nickname}</h3>
      <div className="flex gap-4 mb-6">
        <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded">{horse.color}</span>
        <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded">{horse.age} лет</span>
      </div>
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Владелец</p>
          <p className="text-sm font-semibold text-slate-800">{owner?.full_name}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all text-slate-400">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
