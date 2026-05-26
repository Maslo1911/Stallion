import React from 'react';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Race } from '../../types';
import { cn, formatCurrency } from '../../lib/utils';

interface RaceListItemProps {
  key?: any;
  race: Race;
  hippodrome?: any;
  participantCount: number;
  onClick: () => void;
}

export function RaceListItem({ race, hippodrome, participantCount, onClick }: RaceListItemProps) {
  const statusColor = {
    upcoming: 'bg-blue-50 text-blue-700 border-blue-100',
    planned: 'bg-blue-50 text-blue-700 border-blue-100',
    ongoing: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    finished: 'bg-slate-50 text-slate-600 border-slate-100'
  }[race.status] || 'bg-slate-50 text-slate-600 border-slate-100';

  return (
    <div
      onClick={onClick}
      className="bg-white border border-slate-200 p-6 rounded-2xl group hover:border-blue-600 transition-all cursor-pointer relative overflow-hidden shadow-sm hover:shadow-md"
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", statusColor)}>
              {race.status === 'planned' ? 'ожидается' : race.status === 'ongoing' ? 'идет' : 'завершено'}
            </span>
            <span className="text-slate-400 text-xs flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {race.date}
            </span>
            <span className="text-slate-400 text-xs flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {race.time}
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight font-display">{race.name}</h3>
            <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-blue-600" /> {hippodrome?.name}, {hippodrome?.city}
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 tracking-wider">Призовой фонд</p>
              <p className="text-lg font-bold text-slate-900">{formatCurrency(race.prize)}</p>
            </div>
            <div className="h-8 w-px bg-slate-100" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 tracking-wider">Участники</p>
              <p className="text-lg font-bold text-slate-900">{participantCount}</p>
            </div>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all text-slate-400 shadow-sm">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
