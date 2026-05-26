import React from 'react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { AdminCard } from '../cards/AdminCard';
import { ActionButton } from '../ui/ActionButton';
import { Owner, Horse, User } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { api } from '../../services/api';

interface AdminPanelProps {
  owners: Owner[];
  horses: Horse[];
  users: User[];
  setHorses: React.Dispatch<React.SetStateAction<Horse[]>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setShowModal: (modal: 'race' | 'horse' | 'user' | 'hippodrome' | 'register' | 'login' | null) => void;
}

export function AdminPanel({
  owners,
  horses,
  users,
  setHorses,
  setUsers,
  setShowModal
}: AdminPanelProps) {
  return (
    <motion.section
      key="admin"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AdminCard title="Быстрые действия" description="Управление треком">
          <div className="grid grid-cols-2 gap-4">
            <ActionButton icon={Plus} label="Новая скачка" onClick={() => setShowModal('race')} />
            <ActionButton icon={Plus} label="Новая лошадь" onClick={() => setShowModal('horse')} />
            <ActionButton icon={Plus} label="Новый жокей" onClick={() => setShowModal('user')} />
            <ActionButton icon={Plus} label="Новый ипподром" onClick={() => setShowModal('hippodrome')} />
          </div>
        </AdminCard>

        <AdminCard title="Владельцы и лошади" description="Управление составом владельцев">
          <div className="space-y-4">
            {owners.map(owner => (
              <div key={owner.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{owner.full_name}</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{owner.address}</p>
                  </div>
                  <button onClick={() => setShowModal('horse')} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {horses.filter(h => h.owner_id === owner.id).map(horse => (
                    <div key={horse.id} className="flex items-center justify-between text-xs p-2 bg-white rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-700">{horse.nickname} ({horse.color})</span>
                      <button
                        onClick={async () => {
                          if (confirm(`Удалить лошадь ${horse.nickname}?`)) {
                            try {
                              await api.deleteHorse(horse.id);
                              setHorses(prev => prev.filter(h => h.id !== horse.id));
                            } catch (err: any) {
                              alert(`Ошибка при удалении лошади: ${err.message}`);
                            }
                          }
                        }}
                        className="text-rose-500 hover:text-rose-700 font-bold uppercase text-[8px] tracking-widest"
                      >
                        Удалить
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Управление жокеями" description="Лицензии и допуски">
          <div className="space-y-4">
            {users.filter(j => String(j.role_id) !== '1').map(j => (
              <div key={j.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{j.full_name}</p>
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Лицензия: {j.license}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      if (confirm(`Вы уверены, что хотите отстранить жокея ${j.full_name} и удалить его из системы?`)) {
                        try {
                          await api.deleteUser(j.id);
                          setUsers(prev => prev.filter(u => u.id !== j.id));
                        } catch (err: any) {
                          alert(`Ошибка при отстранении жокея: ${err.message}`);
                        }
                      }
                    }}
                    className="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-[10px] font-bold uppercase hover:bg-rose-100 transition-colors"
                  >
                    Отстранить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Статистика призов" description="Финансовая аналитика">
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Выплачено призов</p>
              <p className="text-2xl font-bold text-emerald-700">{formatCurrency(15400000)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-slate-200 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Комиссия трека</p>
                <p className="text-lg font-bold text-slate-900">{formatCurrency(1250000)}</p>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Удержание налога</p>
                <p className="text-lg font-bold text-slate-900">13%</p>
              </div>
            </div>
          </div>
        </AdminCard>
      </div>
    </motion.section>
  );
}
