import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Race, Participation, Hippodrome } from '../../types';
import { cn, formatCurrency } from '../../lib/utils';

interface HistoryViewProps {
  title: string;
  participations: Participation[];
  onBack: () => void;
  races: Race[];
  hippodromes: Hippodrome[];
}

export function HistoryView({ title, participations, onBack, races, hippodromes }: HistoryViewProps) {
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-bold uppercase tracking-widest">
        <ChevronRight className="w-4 h-4 rotate-180" /> Назад к списку
      </button>
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {participations.length > 0 ? (
            participations.map((p) => {
              const race = races.find(r => r.id === p.race_id);
              return (
                <div key={p.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-lg font-bold text-slate-900 tracking-tight">{race?.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{race?.date} • {hippodromes.find(h => h.id === race?.hippodrome_id)?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-sm font-bold",
                      p.place && p.place <= 3 ? "text-emerald-600" : "text-slate-400"
                    )}>
                      {p.place ? `${p.place} место` : 'Не завершено'}
                    </p>
                    {p.place && p.place <= 3 && race?.prize && (
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Призовые: {formatCurrency(race.prize * (p.place === 1 ? 0.6 : p.place === 2 ? 0.2 : 0.1))}</p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-slate-400 font-medium">История участий пуста</div>
          )}
        </div>
      </div>
    </div>
  );
}
