import React from 'react';
import { cn } from '../../lib/utils';

interface NavItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<any>;
  label: string;
}

export function NavItem({ active, onClick, icon: Icon, label }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-2.5 rounded-lg transition-all group font-medium",
        active ? "bg-blue-50 text-blue-700 shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", active ? "text-blue-700" : "text-slate-400 group-hover:text-slate-600")} />
      <span className="hidden md:block truncate text-sm">{label}</span>
    </button>
  );
}
