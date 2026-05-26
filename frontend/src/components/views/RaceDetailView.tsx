import React from 'react';
import { MapPin, TrendingUp, ChevronRight } from 'lucide-react';
import { Race, UserRole, Participation, Horse, User, Owner, Hippodrome } from '../../types';
import { cn, formatCurrency } from '../../lib/utils';

interface RaceDetailViewProps {
  race: Race;
  onBack: () => void;
  role: UserRole;
  onRegister?: () => void;
  onEdit?: () => void;
  onUpdateParticipantPlace?: (id: string, place: number | null) => Promise<void>;
  onDeleteParticipant?: (id: string) => Promise<void>;
  participations: Participation[];
  horses: Horse[];
  users: User[];
  owners: Owner[];
  hippodromes: Hippodrome[];
}

export function RaceDetailView({
  race,
  onBack,
  role,
  onRegister,
  onEdit,
  onUpdateParticipantPlace,
  onDeleteParticipant,
  participations: allParticipations,
  horses,
  users,
  owners,
  hippodromes
}: RaceDetailViewProps) {
  const participations = allParticipations.filter(p => p.race_id === race.id);

  return (
    <div className="space-y-8 pb-10">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-bold uppercase tracking-widest">
        <ChevronRight className="w-4 h-4 rotate-180" /> Вернуться в панель
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 space-y-8">
          <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Главное событие</span>
                  <span className="text-slate-500 text-sm font-medium">{race.date} • {race.time}</span>
                </div>
                {role === 'admin' && (
                  <button
                    onClick={onEdit}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wider shadow-sm border border-slate-200"
                  >
                    Редактировать
                  </button>
                )}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight font-display">{race.name}</h2>
              <div className="flex flex-wrap items-center gap-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shadow-sm border border-blue-100"><MapPin className="w-6 h-6 text-blue-600" /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Местоположение</p>
                    <p className="text-lg text-slate-900 font-bold leading-tight">{hippodromes.find(h => h.id === race.hippodrome_id)?.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">{hippodromes.find(h => h.id === race.hippodrome_id)?.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shadow-sm border border-emerald-100"><TrendingUp className="w-6 h-6 text-emerald-600" /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Приз</p>
                    <p className="text-lg text-slate-900 font-bold">{formatCurrency(race.prize)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-gradient-to-l from-blue-50 to-transparent pointer-events-none" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Подтвержденные участники</h3>
              {role === 'user' && race.status === 'planned' && (
                <button
                  onClick={() => onRegister?.()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
                >
                  Зарегистрироваться
                </button>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {(race.status === 'finished' || role === 'admin') && (
                      <th className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest">Место</th>
                    )}
                    <th className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest">Лошадь</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest">Жокей</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest text-right">Владелец</th>
                    {role === 'admin' && (
                      <th className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest text-right">Действия</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {participations
                    .sort((a, b) => (a.place || 99) - (b.place || 99))
                    .map((p) => {
                      const horse = horses.find(h => h.id === p.horse_id);
                      const user = users.find(j => j.id === p.jockey_id);
                      const owner = owners.find(o => o.id === horse?.owner_id);

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                          {(race.status === 'finished' || role === 'admin') && (
                            <td className="p-4">
                              {role === 'admin' ? (
                                <input
                                  type="number"
                                  min="1"
                                  max="40"
                                  placeholder="-"
                                  value={p.place || ''}
                                  onChange={async (e) => {
                                    const val = e.target.value ? Number(e.target.value) : null;
                                    if (val !== null && (val < 1 || val > 40)) return;
                                    await onUpdateParticipantPlace?.(p.id, val);
                                  }}
                                  className="w-16 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-bold text-center focus:outline-none focus:ring-1 focus:ring-blue-600"
                                />
                              ) : (
                                <div className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                                  p.place === 1 ? "bg-amber-100 text-amber-700" :
                                    p.place === 2 ? "bg-slate-200 text-slate-700" :
                                      p.place === 3 ? "bg-orange-100 text-orange-800" : "bg-slate-50 text-slate-400"
                                )}>
                                  {p.place || '-'}
                                </div>
                              )}
                            </td>
                          )}
                          <td className="p-4">
                            <p className="text-sm font-bold text-slate-900">{horse?.nickname}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{horse?.color} • {horse?.age}л</p>
                          </td>
                          <td className="p-4 text-sm text-slate-600 font-medium">{user?.full_name}</td>
                          <td className="p-4 text-sm text-slate-500 text-right">{owner?.full_name}</td>
                          {role === 'admin' && (
                            <td className="p-4 text-right">
                              <button
                                onClick={async () => {
                                  if (confirm(`Удалить участника ${horse?.nickname} (${user?.full_name}) из этой скачки?`)) {
                                    await onDeleteParticipant?.(p.id);
                                  }
                                }}
                                className="px-2.5 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 rounded-lg text-[10px] font-bold uppercase transition-colors"
                              >
                                Удалить
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
