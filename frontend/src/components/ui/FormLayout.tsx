import React, { ReactNode } from 'react';
import { Plus } from 'lucide-react';

interface FormLayoutProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function FormLayout({ title, children, onClose }: FormLayoutProps) {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-display">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
          <Plus className="w-6 h-6 rotate-45" />
        </button>
      </div>
      {children}
    </div>
  );
}
