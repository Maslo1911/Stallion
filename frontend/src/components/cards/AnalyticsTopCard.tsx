import React from 'react';

interface AnalyticsTopCardProps {
  label: string;
  value: string;
  subtext: string;
  icon: React.ComponentType<any>;
}

export function AnalyticsTopCard({ label, value, subtext, icon: Icon }: AnalyticsTopCardProps) {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
      <div className="relative z-10 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-xl font-bold text-slate-900 tracking-tight">{value}</p>
          <p className="text-[10px] font-medium text-slate-500 mt-1">{subtext}</p>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 pointer-events-none" />
    </div>
  );
}
