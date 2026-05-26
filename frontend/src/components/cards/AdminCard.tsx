import React, { ReactNode } from 'react';

interface AdminCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AdminCard({ title, description, children }: AdminCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden p-6 space-y-6 shadow-sm shadow-slate-200/50">
      <div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
        <p className="text-sm text-slate-500 font-medium">{description}</p>
      </div>
      {children}
    </div>
  );
}
