/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Trophy,
  Calendar,
  Users,
  Settings,
  Search,
  Plus,
  Clock,
  ChessKnight,
  Banknote,
  Award,
  LogOut,
  User as UserIcon,
  ChartColumnBig,
  Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, Race, Horse, User, Participation, Owner, Hippodrome } from './types';
import { cn, formatCurrency, decodeJwtPayload } from './lib/utils';
import { api } from './services/api';

// UI Components
import { SkeletonCard } from './components/ui/SkeletonCard';
import { EmptyState } from './components/ui/EmptyState';
import { Modal } from './components/ui/Modal';
import { NavItem } from './components/ui/NavItem';

// Auth Components
import { LoginPage } from './components/auth/LoginPage';

// Card Components
import { RaceListItem } from './components/cards/RaceListItem';
import { HorseCard } from './components/cards/HorseCard';
import { UserCard } from './components/cards/UserCard';

// View Components
import { RaceDetailView } from './components/views/RaceDetailView';
import { HistoryView } from './components/views/HistoryView';
import { AnalyticsView } from './components/views/AnalyticsView';

// Admin Components
import { AdminPanel } from './components/admin/AdminPanel';

// Form Components
import { RaceForm } from './components/forms/RaceForm';
import { HorseForm } from './components/forms/HorseForm';
import { UserForm } from './components/forms/UserForm';
import { HippodromeForm } from './components/forms/HippodromeForm';
import { RegisterEntryForm } from './components/forms/RegisterEntryForm';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>('guest');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'races' | 'horses' | 'users' | 'history' | 'admin' | 'analytics'>('races');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [selectedHorse, setSelectedHorse] = useState<Horse | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState<'race' | 'horse' | 'user' | 'hippodrome' | 'register' | 'login' | null>(null);

  // ─── Database States ──────────────────────────────────────────────────
  const [races, setRaces] = useState<Race[]>([]);
  const [horses, setHorses] = useState<Horse[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [hippodromes, setHippodromes] = useState<Hippodrome[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [dbLoading, setDbLoading] = useState(true);

  const loadAllData = async () => {
    try {
      setDbLoading(true);
      const [racesData, horsesData, usersData, hippodromesData, ownersData, participationsData] = await Promise.all([
        api.getRaces(),
        api.getHorses(),
        api.getUsers(),
        api.getHippodromes(),
        api.getOwners(),
        api.getParticipations()
      ]);
      setRaces(racesData);
      setHorses(horsesData);
      setUsers(usersData);
      setHippodromes(hippodromesData);
      setOwners(ownersData);
      setParticipations(participationsData);
    } catch (err) {
      console.error('Failed to load data from backend:', err);
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuthAndData = async () => {
      try {
        setDbLoading(true);
        const token = localStorage.getItem('accessToken');

        if (token) {
          const payload = decodeJwtPayload(token);
          if (payload) {
            if (payload.role_id === 2 || payload.role === 'jockey') {
              setRole('user');
              setActiveTab('history');
            } else if (payload.role_id === 1 || payload.role === 'admin') {
              setRole('admin');
              setActiveTab('admin');
            } else {
              setRole('guest');
            }
            setIsLoggedIn(true);
            setCurrentUser((await api.getUserById(payload.id)) as any);
          }
        }
      } catch (err) {
        console.error('Ошибка при восстановлении сессии:', err);
      } finally {
        await loadAllData();
      }
    };

    initializeAuthAndData();
  }, []);

  const handleCreateRace = async (data: Omit<Race, 'id' | 'status'>) => {
    try {
      const newRace = await api.createRace(data);
      setRaces(prev => [newRace, ...prev]);
      setShowModal(null);
    } catch (err: any) {
      alert(`Ошибка при создании скачки: ${err.message}`);
    }
  };

  const handleUpdateRace = async (data: Partial<Race>) => {
    if (!selectedRace) return;
    try {
      const updatedRace = await api.updateRace(selectedRace.id, data);
      setRaces(prev => prev.map(r => r.id === updatedRace.id ? updatedRace : r));
      setSelectedRace(updatedRace);
      setShowModal(null);
    } catch (err: any) {
      alert(`Ошибка при обновлении скачки: ${err.message}`);
    }
  };

  const handleCreateHorse = async (data: Omit<Horse, 'id'>) => {
    try {
      const newHorse = await api.createHorse(data);
      setHorses(prev => [newHorse, ...prev]);
      setShowModal(null);
    } catch (err: any) {
      alert(`Ошибка при создании лошади: ${err.message}`);
    }
  };

  const handleCreateUser = async (data: Omit<User, 'id'>) => {
    try {
      const newUser = await api.createUser(data);
      setUsers(prev => [newUser, ...prev]);
      setShowModal(null);
    } catch (err: any) {
      alert(`Ошибка при создании жокея: ${err.message}`);
    }
  };

  const handleCreateHippodrome = async (data: Omit<Hippodrome, 'id'>) => {
    try {
      const newHippodrome = await api.createHippodrome(data);
      setHippodromes(prev => [newHippodrome, ...prev]);
      setShowModal(null);
    } catch (err: any) {
      alert(`Ошибка при создании ипподрома: ${err.message}`);
    }
  };

  const handleRegisterParticipation = async (formData: { horse_id: string }) => {
    if (!selectedRace) return;
    try {
      const newPart = await api.createParticipation({
        race_id: selectedRace.id,
        horse_id: formData.horse_id,
        jockey_id: currentUser?.id || "1",
      });
      setParticipations(prev => [...prev, newPart]);
      setShowModal(null);
    } catch (err: any) {
      alert(`Ошибка при регистрации участия: ${err.message}`);
    }
  };

  const handleUpdateParticipantPlace = async (id: string, place: number | null) => {
    try {
      const updatedPart = await api.updateParticipation(id, { place });
      setParticipations(prev => prev.map(p => p.id === updatedPart.id ? updatedPart : p));
    } catch (err: any) {
      alert(`Ошибка при изменении места участника: ${err.message}`);
    }
  };

  const handleDeleteParticipant = async (id: string) => {
    try {
      await api.deleteParticipation(id);
      setParticipations(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert(`Ошибка при удалении участника из скачки: ${err.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setIsLoggedIn(false);
    setRole('guest');
    setCurrentUser(null);
    setActiveTab('races');
  };

  const analytics = useMemo(() => {
    const horsePrizeCount: Record<string, number> = {};
    participations.forEach(p => {
      if (p.place && p.place <= 3) {
        horsePrizeCount[p.horse_id] = (horsePrizeCount[p.horse_id] || 0) + 1;
      }
    });
    const topHorseId = Object.entries(horsePrizeCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topHorse = horses.find(h => h.id === topHorseId);

    const userPrizeCount: Record<string, number> = {};
    participations.forEach(p => {
      if (p.place && p.place <= 3) {
        userPrizeCount[p.jockey_id] = (userPrizeCount[p.jockey_id] || 0) + 1;
      }
    });
    const topJockeyId = Object.entries(userPrizeCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topJockey = users.find(j => j.id === topJockeyId);

    const hippodromeCount: Record<string, number> = {};
    races.forEach(r => {
      hippodromeCount[r.hippodrome_id] = (hippodromeCount[r.hippodrome_id] || 0) + 1;
    });
    const topHippodromeId = Object.entries(hippodromeCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topHippodrome = hippodromes.find(h => h.id === topHippodromeId);

    const prizeWinnersOnDate = dateFilter ? participations.filter(p => {
      const race = races.find(r => r.id === p.race_id);
      return race?.date === dateFilter && p.place && p.place <= 3;
    }).map(p => ({
      horse: horses.find(h => h.id === p.horse_id),
      user: users.find(j => j.id === p.jockey_id),
      place: p.place
    })) : [];

    return { topHorse, topJockey, topHippodrome, prizeWinnersOnDate };
  }, [dateFilter, races, horses, users, hippodromes, participations]);

  const filteredRaces = useMemo(() => {
    return races
      .filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hippodromes.find(h => h.id === r.hippodrome_id)?.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      })
      .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  }, [searchQuery, races, hippodromes]);

  const filteredHorses = useMemo(() => {
    return horses.filter(h =>
      h.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owners.find(o => o.id === h.owner_id)?.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, horses, owners]);

  const filteredUsers = useMemo(() => {
    return users.filter(j =>
      String(j.role_id) !== '1' &&
      j.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, users]);

  const stats = useMemo(() => {
    const totalPrize = races.reduce((sum, r) => sum + Number(r.prize || 0), 0);
    const upcomingRaces = races
      .filter(r => r.status === 'upcoming' || r.status === 'planned')
      .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
    const nextTime = upcomingRaces[0]?.time ? upcomingRaces[0].time.substring(0, 5) : '';
    const nextDate = upcomingRaces[0]?.date ? upcomingRaces[0].date : '';
    const nextValue = upcomingRaces[0] ? `${nextDate} в ${nextTime}` : 'Ещё не запланирована';
    return [
      { label: 'Следующая скачка', value: nextValue, icon: Clock, color: 'text-blue-500' },
      { label: 'Общий призовой фонд', value: formatCurrency(totalPrize || 15000000), icon: Banknote, color: 'text-emerald-500' },
      { label: 'Зарегистрировано лошадей', value: String(horses.length || 0), icon: Award, color: 'text-amber-500' },
    ];
  }, [races, horses]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600/10">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-white border-r border-slate-200 z-50 transition-all duration-300 flex flex-col">
        <div className="p-6 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Trophy className="text-white w-6 h-6" />
          </div>
          <span className="hidden md:block font-bold text-xl tracking-tight text-slate-900 font-display">STALLION</span>
        </div>

        <nav className="mt-4 px-4 space-y-2 flex-1 overflow-y-auto min-h-0 pb-8 custom-scrollbar">
          <NavItem
            active={activeTab === 'races'}
            onClick={() => { setActiveTab('races'); setSelectedRace(null); }}
            icon={Calendar}
            label="Скачки"
          />
          <NavItem
            active={activeTab === 'horses'}
            onClick={() => { setActiveTab('horses'); setSelectedRace(null); }}
            icon={ChessKnight}
            label="Лошади"
          />
          <NavItem
            active={activeTab === 'users'}
            onClick={() => { setActiveTab('users'); setSelectedRace(null); }}
            icon={Users}
            label="Жокеи"
          />
          <NavItem
            active={activeTab === 'analytics'}
            onClick={() => { setActiveTab('analytics'); setSelectedRace(null); setSelectedHorse(null); setSelectedUser(null); }}
            icon={ChartColumnBig}
            label="Аналитика"
          />
          {role === 'user' && (
            <NavItem
              active={activeTab === 'history'}
              onClick={() => { setActiveTab('history'); setSelectedRace(null); }}
              icon={Clock}
              label="Моя история"
            />
          )}
          {role === 'admin' && (
            <NavItem
              active={activeTab === 'admin'}
              onClick={() => { setActiveTab('admin'); setSelectedRace(null); }}
              icon={Settings}
              label="Админ-панель"
            />
          )}
        </nav>

        <div className="mt-auto px-4 pb-8 space-y-4 shrink-0 bg-white border-t border-slate-50 pt-4">
          {isLoggedIn ? (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hidden md:block">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                  {role === 'admin' ? 'А' : 'Ж'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-slate-900 truncate capitalize">{currentUser?.login || role}</p>
                  <p className="text-xs text-slate-500 truncate">В сети</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-50 transition-colors rounded-lg text-xs font-medium flex items-center justify-center gap-2 text-slate-600"
              >
                <LogOut className="w-3 h-3" /> Выйти
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowModal('login')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white transition-all rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95"
            >
              <UserIcon className="w-4 h-4" /> Войти в аккаунт
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-20 md:ml-64 p-4 md:p-8 min-h-screen">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-display">
              {activeTab === 'races' && (selectedRace ? 'Детали скачки' : 'Предстоящие скачки')}
              {activeTab === 'horses' && (selectedHorse ? 'Детали лошади' : 'Список лошадей')}
              {activeTab === 'users' && (selectedUser ? 'Детали жокея' : 'Зарегистрированные жокеи')}
              {activeTab === 'history' && 'Карьерные достижения'}
              {activeTab === 'admin' && 'Управление системой'}
              {activeTab === 'analytics' && 'Аналитическая выборка'}
            </h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">
              {selectedRace ? `Просмотр ${selectedRace.name}` :
                selectedHorse ? `История скачек для ${selectedHorse.nickname}` :
                  selectedUser ? `История скачек для ${selectedUser.full_name}` :
                    ''}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {activeTab !== 'analytics' && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={
                    activeTab === 'races' ? 'Поиск скачек...' :
                      activeTab === 'horses' ? 'Поиск лошадей...' :
                        'Поиск жокеев...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm shadow-sm"
                />
              </div>
            )}
            {activeTab === 'analytics' && (
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all text-sm shadow-sm"
                />
              </div>
            )}
            {role === 'admin' && (['races', 'horses', 'users', 'admin'].includes(activeTab)) && (
              <button
                onClick={() => {
                  if (activeTab === 'races') setShowModal('race');
                  else if (activeTab === 'horses') setShowModal('horse');
                  else if (activeTab === 'users') setShowModal('user');
                  else setShowModal('race');
                }}
                className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-sm shadow-blue-600/10"
              >
                <Plus className="w-4 h-4" /> {
                  activeTab === 'races' ? 'Создать скачку' :
                    activeTab === 'horses' ? 'Новая лошадь' :
                      activeTab === 'users' ? 'Новый жокей' : 'Создать'
                }
              </button>
            )}
          </div>
        </header>

        {/* Stats Grid */}
        {!selectedRace && activeTab === 'races' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 p-6 rounded-2xl relative overflow-hidden group shadow-sm"
              >
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-sm font-semibold text-slate-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={cn("w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform", stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                  <stat.icon className="w-24 h-24" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Content Tabs */}
        <AnimatePresence mode="wait">
          {activeTab === 'races' && (
            <motion.section
              key={selectedRace ? `race-${selectedRace.id}` : 'race-list'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {selectedRace ? (
                <RaceDetailView
                  race={selectedRace}
                  onBack={() => setSelectedRace(null)}
                  role={role}
                  onRegister={() => setShowModal('register')}
                  onEdit={() => setShowModal('race')}
                  onUpdateParticipantPlace={handleUpdateParticipantPlace}
                  onDeleteParticipant={handleDeleteParticipant}
                  participations={participations}
                  horses={horses}
                  users={users}
                  owners={owners}
                  hippodromes={hippodromes}
                />
              ) : dbLoading ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              ) : filteredRaces.length === 0 ? (
                <EmptyState icon={Inbox} title="Скачки не найдены" description="По вашему запросу ничего не найдено." />
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {filteredRaces.map((race) => (
                    <RaceListItem
                      key={race.id}
                      race={race}
                      onClick={() => setSelectedRace(race)}
                      hippodrome={hippodromes.find(h => h.id === race.hippodrome_id)}
                      participantCount={participations.filter(p => p.race_id === race.id).length}
                    />
                  ))}
                </div>
              )}
            </motion.section>
          )}

          {activeTab === 'horses' && (
            <motion.section
              key={selectedHorse ? `horse-${selectedHorse.id}` : 'horse-list'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {selectedHorse ? (
                <HistoryView
                  title={`История лошади: ${selectedHorse.nickname}`}
                  participations={participations.filter(p => p.horse_id === selectedHorse.id)}
                  onBack={() => setSelectedHorse(null)}
                  races={races}
                  hippodromes={hippodromes}
                />
              ) : dbLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              ) : filteredHorses.length === 0 ? (
                <EmptyState icon={Inbox} title="Лошади не найдены" description="Попробуйте изменить поисковый запрос." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHorses.map(horse => (
                    <HorseCard
                      key={horse.id}
                      horse={horse}
                      owner={owners.find(o => o.id === horse.owner_id)}
                      onClick={() => setSelectedHorse(horse)}
                    />
                  ))}
                </div>
              )}
            </motion.section>
          )}

          {activeTab === 'users' && (
            <motion.section
              key={selectedUser ? `user-${selectedUser.id}` : 'user-list'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {selectedUser ? (
                <HistoryView
                  title={`История жокея: ${selectedUser.full_name}`}
                  participations={participations.filter(p => p.jockey_id === selectedUser.id)}
                  onBack={() => setSelectedUser(null)}
                  races={races}
                  hippodromes={hippodromes}
                />
              ) : dbLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              ) : filteredUsers.length === 0 ? (
                <EmptyState icon={Users} title="Жокеи не найдены" description="Зарегистрируйте нового жокея в админ-панели." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUsers.map(user => (
                    <UserCard
                      key={user.id}
                      user={user}
                      onClick={() => setSelectedUser(user)}
                    />
                  ))}
                </div>
              )}
            </motion.section>
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView analytics={analytics} dateFilter={dateFilter} />
          )}

          {activeTab === 'history' && (
            <motion.section
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Всего скачек</p>
                  <p className="text-3xl font-bold text-slate-900">{participations.filter(p => p.jockey_id === (currentUser?.id || '1')).length}</p>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Процент побед</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {Math.round((participations.filter(p => p.jockey_id === (currentUser?.id || '1') && p.place === 1).length /
                      (participations.filter(p => p.jockey_id === (currentUser?.id || '1')).length || 1)) * 100)}%
                  </p>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Подиумы</p>
                  <p className="text-3xl font-bold text-slate-900">{participations.filter(p => p.jockey_id === (currentUser?.id || '1') && p.place && p.place <= 3).length}</p>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Доход жокея</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatCurrency(
                      participations
                        .filter(p => p.jockey_id === (currentUser?.id || '1') && p.place)
                        .reduce((sum, p) => {
                          const race = races.find(r => r.id === p.race_id);
                          const share = p.place === 1 ? 0.1 : 0.05;
                          return sum + (Number(race?.prize || 0) * share);
                        }, 0)
                    )}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Последние результаты</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {participations.filter(p => p.jockey_id === (currentUser?.id || '1') && p.place).map(p => {
                    const race = races.find(r => r.id === p.race_id);
                    const horse = horses.find(h => h.id === p.horse_id);
                    return (
                      <div key={p.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-6">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm border",
                            p.place === 1 ? "bg-amber-50 text-amber-700 border-amber-200" :
                              p.place === 2 ? "bg-slate-100 text-slate-700 border-slate-200" : "bg-orange-50 text-orange-700 border-orange-200"
                          )}>
                            {p.place}
                          </div>
                          <div>
                            <p className="text-lg font-bold text-slate-900 tracking-tight">{race?.name}</p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{horse?.nickname} • {race?.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900">+{formatCurrency((Number(race?.prize || 0)) * (p.place === 1 ? 0.1 : 0.05))}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Доля жокея</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === 'admin' && (
            <AdminPanel
              owners={owners}
              horses={horses}
              users={users}
              setHorses={setHorses}
              setUsers={setUsers}
              setShowModal={setShowModal}
            />
          )}
        </AnimatePresence>

        {/* Modals */}
        <AnimatePresence>
          {showModal && (
            <Modal onClose={() => setShowModal(null)}>
              {showModal === 'login' && (
                <LoginPage
                  onLogin={(selectedRole, authUser) => {
                    setRole(selectedRole);
                    setCurrentUser(authUser);
                    setIsLoggedIn(true);
                    setShowModal(null);
                    if (selectedRole === 'admin') setActiveTab('admin');
                    else if (selectedRole === 'user') setActiveTab('history');
                  }}
                  onClose={() => setShowModal(null)}
                />
              )}
              {showModal === 'race' && (
                <RaceForm
                  onClose={() => setShowModal(null)}
                  hippodromes={hippodromes}
                  initialData={selectedRace || undefined}
                  onSubmit={selectedRace ? handleUpdateRace : handleCreateRace}
                />
              )}
              {showModal === 'horse' && <HorseForm onClose={() => setShowModal(null)} owners={owners} onSubmit={handleCreateHorse} />}
              {showModal === 'user' && <UserForm onClose={() => setShowModal(null)} onSubmit={handleCreateUser} />}
              {showModal === 'hippodrome' && <HippodromeForm onClose={() => setShowModal(null)} onSubmit={handleCreateHippodrome} />}
              {showModal === 'register' && <RegisterEntryForm race={selectedRace!} horses={horses} onClose={() => setShowModal(null)} onSubmit={handleRegisterParticipation} />}
            </Modal>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}