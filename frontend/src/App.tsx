/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, ReactNode } from 'react';
import { 
  Trophy, 
  Calendar, 
  Users, 
  Settings, 
  Search, 
  Plus, 
  Clock, 
  MapPin, 
  ChevronRight,
  TrendingUp,
  Award,
  LogOut,
  User as UserIcon,
  Filter,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, Race, Horse, Jockey, Participation } from './types';
import { mockRaces, mockHorses, mockJockeys, mockHippodromes, mockParticipations, mockOwners, mockUsers } from './mockData';
import { cn, formatCurrency } from './lib/utils';

function LoginPage({ onLogin, onClose }: { onLogin: (role: UserRole) => void; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        onLogin(user.role);
      } else {
        setError(true);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-2xl relative">
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <Plus className="w-6 h-6 rotate-45" />
          </button>

          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/30 mb-4">
              <Trophy className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display mb-2">STALLION</h1>
            <p className="text-slate-500 text-sm font-medium">Система управления ипподромом</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-4 focus:ring-blue-600/10 font-medium"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 rounded-2xl py-4 pl-12 pr-12 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-4 focus:ring-blue-600/10 font-medium"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-rose-500 font-bold text-center"
              >
                Неверный email или пароль
              </motion.p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Войти в систему
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>('guest');
  const [activeTab, setActiveTab] = useState<'races' | 'horses' | 'jockeys' | 'history' | 'admin' | 'analytics'>('races');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [selectedHorse, setSelectedHorse] = useState<Horse | null>(null);
  const [selectedJockey, setSelectedJockey] = useState<Jockey | null>(null);
  const [showModal, setShowModal] = useState<'race' | 'horse' | 'jockey' | 'hippodrome' | 'register' | 'login' | null>(null);

  const analytics = useMemo(() => {
    // 4. Horse with most prize places
    const horsePrizeCount: Record<string, number> = {};
    mockParticipations.forEach(p => {
      if (p.place && p.place <= 3) {
        horsePrizeCount[p.horse_id] = (horsePrizeCount[p.horse_id] || 0) + 1;
      }
    });
    const topHorseId = Object.entries(horsePrizeCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topHorse = mockHorses.find(h => h.id === topHorseId);

    // 5. Jockey with most prize places
    const jockeyPrizeCount: Record<string, number> = {};
    mockParticipations.forEach(p => {
      if (p.place && p.place <= 3) {
        jockeyPrizeCount[p.jockey_id] = (jockeyPrizeCount[p.jockey_id] || 0) + 1;
      }
    });
    const topJockeyId = Object.entries(jockeyPrizeCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topJockey = mockJockeys.find(j => j.id === topJockeyId);

    // 6. Most frequent hippodrome
    const hippodromeCount: Record<string, number> = {};
    mockRaces.forEach(r => {
      hippodromeCount[r.hippodrome_id] = (hippodromeCount[r.hippodrome_id] || 0) + 1;
    });
    const topHippodromeId = Object.entries(hippodromeCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topHippodrome = mockHippodromes.find(h => h.id === topHippodromeId);

    // 1. Winners on a given date (using dateFilter)
    const prizeWinnersOnDate = dateFilter ? mockParticipations.filter(p => {
      const race = mockRaces.find(r => r.id === p.race_id);
      return race?.date === dateFilter && p.place && p.place <= 3;
    }).map(p => ({
      horse: mockHorses.find(h => h.id === p.horse_id),
      jockey: mockJockeys.find(j => j.id === p.jockey_id),
      place: p.place
    })) : [];

    return { topHorse, topJockey, topHippodrome, prizeWinnersOnDate };
  }, [dateFilter]);

  const filteredRaces = useMemo(() => {
    return mockRaces.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mockHippodromes.find(h => h.id === r.hippodrome_id)?.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  const filteredHorses = useMemo(() => {
    return mockHorses.filter(h => 
      h.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mockOwners.find(o => o.id === h.owner_id)?.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredJockeys = useMemo(() => {
    return mockJockeys.filter(j => 
      j.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.license.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const stats = [
    { label: 'Следующая скачка', value: '15:40', icon: Clock, color: 'text-blue-500' },
    { label: 'Общий призовой фонд', value: formatCurrency(15000000), icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Зарегистрировано лошадей', value: '1,240', icon: Award, color: 'text-amber-500' },
  ];

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
            icon={TrendingUp} 
            label="Лошади" 
          />
          <NavItem 
            active={activeTab === 'jockeys'} 
            onClick={() => { setActiveTab('jockeys'); setSelectedRace(null); }} 
            icon={Users} 
            label="Жокеи" 
          />
          <NavItem 
            active={activeTab === 'analytics'} 
            onClick={() => { setActiveTab('analytics'); setSelectedRace(null); setSelectedHorse(null); setSelectedJockey(null); }} 
            icon={Filter} 
            label="Аналитика" 
          />
          {role === 'jockey' && (
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
                  {role === 'jockey' ? 'Ж' : 'А'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-slate-900 truncate capitalize">{role === 'jockey' ? 'жокей' : 'админ'}</p>
                  <p className="text-xs text-slate-500 truncate">В сети</p>
                </div>
              </div>
              <button 
                onClick={() => { setIsLoggedIn(false); setRole('guest'); setActiveTab('races'); }}
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
          
          {/* Role Switcher Demo Removed */}
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
              {activeTab === 'jockeys' && (selectedJockey ? 'Детали жокея' : 'Зарегистрированные жокеи')}
              {activeTab === 'history' && 'Карьерные достижения'}
              {activeTab === 'admin' && 'Управление системой'}
              {activeTab === 'analytics' && 'Аналитическая выборка'}
            </h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">
              {selectedRace ? `Просмотр ${selectedRace.name}` : 
               selectedHorse ? `История скачек для ${selectedHorse.nickname}` :
               selectedJockey ? `История скачек для ${selectedJockey.full_name}` :
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
            {role === 'admin' && (['races', 'horses', 'jockeys', 'admin'].includes(activeTab)) && (
              <button 
                onClick={() => {
                  if (activeTab === 'races') setShowModal('race');
                  else if (activeTab === 'horses') setShowModal('horse');
                  else if (activeTab === 'jockeys') setShowModal('jockey');
                  else setShowModal('race');
                }}
                className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-sm shadow-blue-600/10"
              >
                <Plus className="w-4 h-4" /> {
                  activeTab === 'races' ? 'Создать скачку' :
                  activeTab === 'horses' ? 'Новая лошадь' :
                  activeTab === 'jockeys' ? 'Новый жокей' : 'Создать'
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
                />
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {filteredRaces.map((race) => (
                    <RaceListItem 
                      key={race.id} 
                      race={race} 
                      onClick={() => setSelectedRace(race)}
                      hippodrome={mockHippodromes.find(h => h.id === race.hippodrome_id)}
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
                  participations={mockParticipations.filter(p => p.horse_id === selectedHorse.id)}
                  onBack={() => setSelectedHorse(null)}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHorses.map(horse => (
                    <HorseCard 
                      key={horse.id} 
                      horse={horse} 
                      owner={mockOwners.find(o => o.id === horse.owner_id)} 
                      onClick={() => setSelectedHorse(horse)}
                    />
                  ))}
                </div>
              )}
            </motion.section>
          )}

          {activeTab === 'jockeys' && (
            <motion.section 
              key={selectedJockey ? `jockey-${selectedJockey.id}` : 'jockey-list'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {selectedJockey ? (
                <HistoryView 
                  title={`История жокея: ${selectedJockey.full_name}`} 
                  participations={mockParticipations.filter(p => p.jockey_id === selectedJockey.id)}
                  onBack={() => setSelectedJockey(null)}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJockeys.map(jockey => (
                    <JockeyCard 
                      key={jockey.id} 
                      jockey={jockey} 
                      onClick={() => setSelectedJockey(jockey)}
                    />
                  ))}
                </div>
              )}
            </motion.section>
          )}

          {activeTab === 'analytics' && (
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
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Жокей: {winner.jockey?.full_name}</p>
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
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Всего побед</p>
                  <p className="text-3xl font-bold text-slate-900">42</p>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Процент побед</p>
                  <p className="text-3xl font-bold text-emerald-600">18.4%</p>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Подиумы</p>
                  <p className="text-3xl font-bold text-slate-900">108</p>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Доход</p>
                  <p className="text-3xl font-bold text-blue-600">{formatCurrency(2450000)}</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                   <h3 className="text-lg font-bold text-slate-900 tracking-tight">Последние результаты</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {mockParticipations.filter(p => p.jockey_id === 'j1' && p.place).map(p => {
                    const race = mockRaces.find(r => r.id === p.race_id);
                    const horse = mockHorses.find(h => h.id === p.horse_id);
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
                          <p className="text-sm font-bold text-slate-900">+{formatCurrency((race?.prize || 0) * (p.place === 1 ? 0.1 : 0.05))}</p>
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
             <motion.section 
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AdminCard title="Недавняя активность" description="Отслеживание изменений в системе">
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"><Plus className="w-5 h-5"/></div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Скачка "Весеннее дерби" создана</p>
                          <p className="text-xs text-slate-500 font-medium">2 часа назад от Системы</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AdminCard>
                <AdminCard title="Быстрые действия" description="Управление треком">
                  <div className="grid grid-cols-2 gap-4">
                    <ActionButton icon={Plus} label="Новая скачка" onClick={() => setShowModal('race')} />
                    <ActionButton icon={Plus} label="Новая лошадь" onClick={() => setShowModal('horse')} />
                    <ActionButton icon={Plus} label="Новый жокей" onClick={() => setShowModal('jockey')} />
                    <ActionButton icon={Plus} label="Новый ипподром" onClick={() => setShowModal('hippodrome')} />
                  </div>
                </AdminCard>
                <AdminCard title="Владельцы и лошади" description="Управление составом владельцев">
                   <div className="space-y-4">
                     {mockOwners.map(owner => (
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
                           {mockHorses.filter(h => h.owner_id === owner.id).map(horse => (
                             <div key={horse.id} className="flex items-center justify-between text-xs p-2 bg-white rounded-lg border border-slate-200">
                               <span className="font-semibold text-slate-700">{horse.nickname} ({horse.color})</span>
                               <button className="text-rose-500 hover:text-rose-700 font-bold uppercase text-[8px] tracking-widest">Удалить</button>
                             </div>
                           ))}
                         </div>
                       </div>
                     ))}
                   </div>
                </AdminCard>
                 <AdminCard title="Управление жокеями" description="Лицензии и допуски">
                    <div className="space-y-4">
                      {mockJockeys.map(j => (
                        <div key={j.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{j.full_name}</p>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Лицензия: {j.license}</p>
                          </div>
                          <div className="flex gap-2">
                             <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-100 transition-colors">Продлить</button>
                             <button className="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-[10px] font-bold uppercase hover:bg-rose-100 transition-colors">Отстранить</button>
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
                <AdminCard title="Системное" description="Конфигурация параметров">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                    <p className="text-xs text-blue-700 font-medium leading-relaxed">
                      Все действия логируются. Изменения вступают в силу мгновенно для всех пользователей системы.
                    </p>
                  </div>
                </AdminCard>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Modals */}
        <AnimatePresence>
          {showModal && (
            <Modal onClose={() => setShowModal(null)}>
              {showModal === 'login' && (
                <LoginPage 
                  onLogin={(selectedRole) => { 
                    setRole(selectedRole); 
                    setIsLoggedIn(true); 
                    setShowModal(null); 
                    if (selectedRole === 'admin') setActiveTab('admin');
                    else if (selectedRole === 'jockey') setActiveTab('history');
                  }} 
                  onClose={() => setShowModal(null)} 
                />
              )}
              {showModal === 'race' && <RaceForm onClose={() => setShowModal(null)} />}
              {showModal === 'horse' && <HorseForm onClose={() => setShowModal(null)} />}
              {showModal === 'jockey' && <JockeyForm onClose={() => setShowModal(null)} />}
              {showModal === 'hippodrome' && <HippodromeForm onClose={() => setShowModal(null)} />}
              {showModal === 'register' && <RegisterEntryForm race={selectedRace!} onClose={() => setShowModal(null)} />}
            </Modal>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
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

function RaceListItem({ race, hippodrome, onClick }: { race: Race; hippodrome?: any; onClick: () => void; key?: string | number }) {
  const statusColor = {
    upcoming: 'bg-blue-50 text-blue-700 border-blue-100',
    ongoing: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    finished: 'bg-slate-50 text-slate-600 border-slate-100'
  }[race.status];

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-slate-200 p-6 rounded-2xl group hover:border-blue-600 transition-all cursor-pointer relative overflow-hidden shadow-sm hover:shadow-md"
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", statusColor)}>
              {race.status === 'upcoming' ? 'ожидается' : race.status === 'ongoing' ? 'идет' : 'завершено'}
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
              <p className="text-lg font-bold text-slate-900">12 / 20</p>
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

function RaceDetailView({ race, onBack, role, onRegister }: { race: Race; onBack: () => void; role: UserRole; onRegister?: () => void }) {
  const participations = mockParticipations.filter(p => p.race_id === race.id);

  return (
    <div className="space-y-8 pb-10">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-bold uppercase tracking-widest">
        <ChevronRight className="w-4 h-4 rotate-180" /> Вернуться в панель
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Race Info */}
        <div className="lg:col-span-12 space-y-8">
          <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="relative z-10 space-y-6">
               <div className="flex items-center gap-3">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Главное событие</span>
                <span className="text-slate-500 text-sm font-medium">{race.date} • {race.time}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight font-display">{race.name}</h2>
              <div className="flex flex-wrap items-center gap-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shadow-sm border border-blue-100"><MapPin className="w-6 h-6 text-blue-600"/></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Местоположение</p>
                    <p className="text-lg text-slate-900 font-bold leading-tight">{mockHippodromes.find(h => h.id === race.hippodrome_id)?.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">{mockHippodromes.find(h => h.id === race.hippodrome_id)?.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shadow-sm border border-emerald-100"><TrendingUp className="w-6 h-6 text-emerald-600"/></div>
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
              {role === 'jockey' && race.status === 'upcoming' && (
                <button 
                  onClick={() => onRegister?.()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
                >
                  Зарегистрироваться
                </button>
              )}
              {role === 'admin' && (
                <button 
                  onClick={() => alert('Режим редактирования активирован (демо)')}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
                >
                  Редактировать
                </button>
              )}
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-bottom border-slate-100 bg-slate-50">
                    {race.status === 'finished' && <th className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest">Место</th>}
                    <th className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest">Лошадь</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest">Жокей</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest text-right">Владелец</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {participations
                    .sort((a, b) => (a.place || 99) - (b.place || 99))
                    .map((p, idx) => {
                    const horse = mockHorses.find(h => h.id === p.horse_id);
                    const jockey = mockJockeys.find(j => j.id === p.jockey_id);
                    const owner = mockOwners.find(o => o.id === horse?.owner_id);
                    const isPodium = p.place && p.place <= 3;
                    
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                        {race.status === 'finished' && (
                          <td className="p-4">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                              p.place === 1 ? "bg-amber-100 text-amber-700" :
                              p.place === 2 ? "bg-slate-200 text-slate-700" :
                              p.place === 3 ? "bg-orange-100 text-orange-800" : "bg-slate-50 text-slate-400"
                            )}>
                              {p.place || '-'}
                            </div>
                          </td>
                        )}
                        <td className="p-4">
                          <p className="text-sm font-bold text-slate-900">{horse?.nickname}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{horse?.color} • {horse?.age}л</p>
                        </td>
                        <td className="p-4 text-sm text-slate-600 font-medium">{jockey?.full_name}</td>
                        <td className="p-4 text-sm text-slate-500 text-right">{owner?.full_name}</td>
                      </tr>
                    )
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

function HorseCard({ horse, owner, onClick }: { horse: Horse; owner?: any; onClick?: () => void; key?: string | number }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "p-6 bg-white border border-slate-200 rounded-2xl group transition-all shadow-sm shadow-slate-200/50",
        onClick ? "cursor-pointer hover:border-blue-600" : ""
      )}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
          🏇
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors tracking-tight font-display">{horse.nickname}</h3>
      <div className="flex gap-4 mb-6">
        <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded">{horse.color}</span>
        <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded">{horse.age} лет</span>
      </div>
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Владелец</p>
           <p className="text-sm font-semibold text-slate-800">{owner?.full_name}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all text-slate-400">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

function JockeyCard({ jockey, onClick }: { jockey: Jockey; onClick?: () => void; key?: string | number }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "p-6 bg-white border border-slate-200 rounded-2xl group transition-all shadow-sm",
        onClick ? "cursor-pointer hover:shadow-md" : ""
      )}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl group-hover:scale-105 transition-all">
          🧢
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{jockey.full_name}</h3>
          <p className="text-xs text-slate-500 font-medium">Элитный профессионал</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Возраст</p>
          <p className="text-sm font-bold text-slate-900">{jockey.age}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Лицензия</p>
          <p className="text-sm font-bold text-slate-900">{jockey.license}</p>
        </div>
      </div>
       <button className="w-full mt-6 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold uppercase tracking-widest text-slate-600 transition-all border border-slate-200 shadow-xs">
        Статистика карьеры
      </button>
    </div>
  );
}

function HistoryView({ title, participations, onBack }: { title: string; participations: Participation[]; onBack: () => void }) {
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
              const race = mockRaces.find(r => r.id === p.race_id);
              return (
                <div key={p.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-lg font-bold text-slate-900 tracking-tight">{race?.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{race?.date} • {mockHippodromes.find(h => h.id === race?.hippodrome_id)?.name}</p>
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

function AnalyticsTopCard({ label, value, subtext, icon: Icon }: { label: string; value: string; subtext: string; icon: any }) {
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

function AdminCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
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

function ActionButton({ icon: Icon, label, onClick }: { icon: any; label: string; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 group transition-all active:scale-95 shadow-xs hover:shadow-sm w-full"
    >
      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all border border-slate-100">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[10px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-widest">{label}</span>
    </button>
  );
}

function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200"
      >
        {children}
      </motion.div>
    </div>
  );
}

function FormLayout({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
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

function InputField({ label, type = "text", placeholder, required = true }: { label: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input 
        type={type} 
        placeholder={placeholder}
        required={required}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
      />
    </div>
  );
}

function RaceForm({ onClose }: { onClose: () => void }) {
  return (
    <FormLayout title="Создать скачку" onClose={onClose}>
      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
        <InputField label="Название скачки" placeholder="Напр. Кубок Президента" />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Дата" type="date" />
          <InputField label="Время" type="time" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ипподром</label>
          <select required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium">
            {mockHippodromes.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
        </div>
        <InputField label="Приз ($)" type="number" placeholder="50000" />
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 mt-4">
          Сохранить скачку
        </button>
      </form>
    </FormLayout>
  );
}

function HorseForm({ onClose }: { onClose: () => void }) {
  return (
    <FormLayout title="Новая лошадь" onClose={onClose}>
      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
        <InputField label="Кличка лошади" placeholder="Напр. Вихрь" />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Окрас" placeholder="Гнедая" />
          <InputField label="Возраст" type="number" placeholder="4" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Владелец</label>
          <select required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium">
            {mockOwners.map(o => <option key={o.id} value={o.id}>{o.full_name}</option>)}
          </select>
        </div>
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 mt-4">
          Зарегистрировать
        </button>
      </form>
    </FormLayout>
  );
}

function JockeyForm({ onClose }: { onClose: () => void }) {
  return (
    <FormLayout title="Новый жокей" onClose={onClose}>
      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
        <InputField label="ФИО Жокея" placeholder="Иван Иванов" />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Возраст" type="number" placeholder="25" />
          <InputField label="Лицензия" placeholder="LIC-000" />
        </div>
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 mt-4">
          Добавить в систему
        </button>
      </form>
    </FormLayout>
  );
}

function HippodromeForm({ onClose }: { onClose: () => void }) {
  return (
    <FormLayout title="Новый ипподром" onClose={onClose}>
      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
        <InputField label="Название" placeholder="Центральный ипподром" />
        <InputField label="Город" placeholder="Москва" />
        <InputField label="Адрес" placeholder="ул. Беговая, 22" />
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 mt-4">
          Создать
        </button>
      </form>
    </FormLayout>
  );
}

function RegisterEntryForm({ race, onClose }: { race: Race; onClose: () => void }) {
  return (
    <FormLayout title={`Участие в: ${race.name}`} onClose={onClose}>
      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Выберите лошадь</label>
          <select required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium">
            {mockHorses.map(h => <option key={h.id} value={h.id}>{h.nickname} ({h.color})</option>)}
          </select>
        </div>
        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
          <p className="text-xs text-blue-700 font-medium leading-relaxed">
            Вы регистрируетесь как элитный жокей. Убедитесь, что ваша лицензия действительна на дату проведения скачки ({race.date}).
          </p>
        </div>
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 mt-4">
          Подтвердить участие
        </button>
      </form>
    </FormLayout>
  );
}
