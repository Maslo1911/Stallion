import React from 'react';
import { motion } from 'motion/react';
import { Award, Users, MapPin } from 'lucide-react';
import { AnalyticsTopCard } from '../cards/AnalyticsTopCard';
import { cn } from '../../lib/utils';
import { Horse, User, Hippodrome } from '../../types';

interface AnalyticsViewProps {
  analytics: {
    topHorse?: Horse;
    topJockey?: User;
    topHippodrome?: Hippodrome;
    prizeWinnersOnDate: Array<{
      horse?: Horse;
      user?: User;
      place?: number | null;
      race_name?: string;
    }>;
  };
  dateFilter: string;
}

export function AnalyticsView({ analytics, dateFilter }: AnalyticsViewProps) {
  return (
    <motion.section
      key="analytics"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsTopCard
          label="Топ лошадь"
          value={analytics.topHorse?.nickname || '-'}
          subtext="Больше всего призовых мест"
          icon={Award}
        />
        <AnalyticsTopCard
          label="Топ жокей"
          value={analytics.topJockey?.full_name || '-'}
          subtext="Больше всего призовых мест"
          icon={Users}
        />
        <AnalyticsTopCard
          label="Популярный ипподром"
          value={analytics.topHippodrome?.name || '-'}
          subtext="Чаще всего проводятся скачки"
          icon={MapPin}
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Призеры на {dateFilter || 'выбранную дату'}</h3>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            {analytics.prizeWinnersOnDate.length} найдено
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {analytics.prizeWinnersOnDate.length > 0 ? (
            analytics.prizeWinnersOnDate.map((winner, idx) => (
              <div key={idx} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm",
                    winner.place === 1 ? "bg-amber-100 text-amber-700" :
                      winner.place === 2 ? "bg-slate-200 text-slate-700" :
                        "bg-orange-100 text-orange-800"
                  )}>
                    {winner.place}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{winner.horse?.nickname}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Жокей: {winner.user?.full_name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Скачка: {winner.race_name}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400">
              {dateFilter ? 'Призеров не найдено на эту дату' : 'Выберите дату сверху, чтобы увидеть призеров'}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
