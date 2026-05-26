import React from 'react';
import { User } from '../../types';
import { cn } from '../../lib/utils';

interface UserCardProps {
  key?: any;
  user: User;
  onClick?: () => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-6 bg-white border border-slate-200 rounded-2xl group transition-all shadow-sm",
        onClick ? "cursor-pointer hover:shadow-md" : ""
      )}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl group-hover:scale-105 transition-all">
          🧢
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{user.full_name}</h3>
          <p className="text-xs text-slate-500 font-medium">Элитный профессионал</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Возраст</p>
          <p className="text-sm font-bold text-slate-900">{user.age}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Лицензия</p>
          <p className="text-sm font-bold text-slate-900">{user.license}</p>
        </div>
      </div>
      <button className="w-full mt-6 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold uppercase tracking-widest text-slate-600 transition-all border border-slate-200 shadow-xs">
        Статистика карьеры
      </button>
    </div>
  );
}
