import React from 'react';

interface ActionButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  onClick?: () => void;
}

export function ActionButton({ icon: Icon, label, onClick }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 group transition-all active:scale-95 shadow-xs hover:shadow-sm w-full"
    >
      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all border border-slate-100">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[10px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-widest">{label}</span>
    </button>
  );
}
