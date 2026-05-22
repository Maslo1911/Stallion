/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, ReactNode, useEffect } from 'react';
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
  ShieldCheck,
  Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, Race, Horse, User, Participation, Owner, Hippodrome } from './types';
import { cn, formatCurrency, decodeJwtPayload } from './lib/utils';
import { api } from './services/api';

// ─── Loading Skeleton Component ────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-3 flex-1">
          <div className="h-4 bg-slate-200 rounded w-24" />
          <div className="h-6 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
        </div>
        <div className="w-10 h-10 bg-slate-200 rounded-full" />
      </div>
      <div className="flex gap-8 mt-4">
        <div className="h-5 bg-slate-200 rounded w-20" />
        <div className="h-5 bg-slate-200 rounded w-16" />
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center w-full"
    >
      <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-slate-300" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm">{description}</p>
    </motion.div>
  );
}

function LoginPage({ onLogin, onClose }: { onLogin: (role: UserRole, authUser: User) => void; onClose: () => void }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const { accessToken } = await api.login({ login, password });

      const payload = decodeJwtPayload(accessToken);
      if (payload) {
        const authUser: User = {
          ...(await api.getUserById(payload.id))
        };
        if (payload.role_id === 2 || payload.role === 'jockey') {
          onLogin('user', authUser);
        } else if (payload.role_id === 1 || payload.role === 'admin') {
          onLogin('admin', authUser);
        } else {
          onLogin('guest', authUser);
        }
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Login error', err);
      setError(true);
    } finally {
      setLoading(false);
    }
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
                  type="text"
                  placeholder="Login"
                  value={login}
                  onChange={e => setLogin(e.target.value)}
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
                Неверный логин или пароль
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'races' | 'horses' | 'users' | 'history' | 'admin' | 'analytics'>('races');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [selectedHorse, setSelectedHorse] = useState<Horse | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState<'race' | 'horse' | 'user' | 'hippodrome' | 'register' | 'login' | null>(null);

  // ─── Real Database States ──────────────────────────────────────────────────
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

        // Проверяем, есть ли сохраненный токен (замените 'accessToken' на ваш ключ, если он другой)
        const token = localStorage.getItem('accessToken');

        if (token) {
          const payload = decodeJwtPayload(token);
          if (payload) {
            // Восстанавливаем роль на основе данных из JWT токена
            if (payload.role_id === 2 || payload.role === 'jockey') {
              setRole('user');
              setActiveTab('history'); // открываем вкладку жокея
            } else if (payload.role_id === 1 || payload.role === 'admin') {
              setRole('admin');
              setActiveTab('admin');   // открываем вкладку админа
            } else {
              setRole('guest');
            }
            setIsLoggedIn(true);
            setCurrentUser((await api.getUserById(payload.id)) as any);
          }
        } else {
          // Если access-токена нет, но у вас реализован refresh-токен,
          // здесь можно вызвать метод обновления, например:
          // const newTokens = await api.refreshToken();
          // и повторить логику авторизации...
        }
      } catch (err) {
        console.error('Ошибка при восстановлении сессии:', err);
      } finally {
        // После проверки авторизации загружаем остальные данные
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
    return [
      { label: 'Следующая скачка', value: `${nextDate} в ${nextTime}`, icon: Clock, color: 'text-blue-500' },
      { label: 'Общий призовой фонд', value: formatCurrency(totalPrize || 15000000), icon: TrendingUp, color: 'text-emerald-500' },
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
            icon={TrendingUp}
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
            icon={Filter}
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
                onClick={() => { setIsLoggedIn(false); setRole('guest'); setCurrentUser(null); setActiveTab('races'); }}
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
                                    await api.deleteHorse(horse.id);
                                    setHorses(prev => prev.filter(h => h.id !== horse.id));
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
                    {users.map(j => (
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
              {showModal === 'race' && <RaceForm onClose={() => setShowModal(null)} hippodromes={hippodromes} onSubmit={handleCreateRace} />}
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

function RaceListItem({ race, hippodrome, participantCount, onClick }: { race: Race; hippodrome?: any; participantCount: number; onClick: () => void }) {
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

function RaceDetailView({ race, onBack, role, onRegister, participations: allParticipations, horses, users, owners, hippodromes }: { race: Race; onBack: () => void; role: UserRole; onRegister?: () => void; participations: Participation[]; horses: Horse[]; users: User[]; owners: Owner[]; hippodromes: Hippodrome[] }) {
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
              <div className="flex items-center gap-3">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Главное событие</span>
                <span className="text-slate-500 text-sm font-medium">{race.date} • {race.time}</span>
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
                    {race.status === 'finished' && <th className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest">Место</th>}
                    <th className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest">Лошадь</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest">Жокей</th>
                    <th className="p-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest text-right">Владелец</th>
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
                          <td className="p-4 text-sm text-slate-600 font-medium">{user?.full_name}</td>
                          <td className="p-4 text-sm text-slate-500 text-right">{owner?.full_name}</td>
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

function HorseCard({ horse, owner, onClick }: { horse: Horse; owner?: any; onClick?: () => void }) {
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

// Полноценный запуск без лишних скобок на конце!
function UserCard({ user, onClick }: { user: User; onClick?: () => void }) {
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
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{user.full_name}</h3>
          <p className="text-xs text-slate-500 font-medium">Элитный профессионал</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Возраст</p>
          <p className="text-sm font-bold text-slate-900">{user.age}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Лицензия</p>
          <p className="text-sm font-bold text-slate-900">{user.license}</p>
        </div>
      </div>
      <button className="w-full mt-6 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold uppercase tracking-widest text-slate-600 transition-all border border-slate-200 shadow-xs">
        Статистика карьеры
      </button>
    </div>
  );
}

function HistoryView({ title, participations, onBack, races, hippodromes }: { title: string; participations: Participation[]; onBack: () => void; races: Race[]; hippodromes: Hippodrome[] }) {
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

// Вспомогательные карточки и модалки
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

function InputField({ label, type = "text", placeholder, required = true, value, onChange }: { label: string; type?: string; placeholder?: string; required?: boolean; value?: string | number; onChange?: (e: any) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
      />
    </div>
  );
}

function RaceForm({ onClose, hippodromes, onSubmit }: { onClose: () => void; hippodromes: Hippodrome[]; onSubmit: (data: any) => Promise<void> }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [hippodromeId, setHippodromeId] = useState(hippodromes[0]?.id || '');
  const [prize, setPrize] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name,
      date,
      time,
      hippodrome_id: hippodromeId,
      prize: Number(prize)
    });
    onClose();
  };

  return (
    <FormLayout title="Создать скачку" onClose={onClose}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <InputField label="Название скачки" placeholder="Напр. Кубок Президента" value={name} onChange={e => setName(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Дата" type="date" value={date} onChange={e => setDate(e.target.value)} />
          <InputField label="Время" type="time" value={time} onChange={e => setTime(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ипподром</label>
          <select
            required
            value={hippodromeId}
            onChange={e => setHippodromeId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium"
          >
            {hippodromes.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
        </div>
        <InputField label="Приз ($)" type="number" placeholder="50000" value={prize} onChange={e => setPrize(e.target.value)} />
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 mt-4">
          Сохранить скачку
        </button>
      </form>
    </FormLayout>
  );
}

function HorseForm({ onClose, owners, onSubmit }: { onClose: () => void; owners: Owner[]; onSubmit: (data: any) => Promise<void> }) {
  const [nickname, setNickname] = useState('');
  const [color, setColor] = useState('');
  const [age, setAge] = useState('');
  const [ownerId, setOwnerId] = useState(owners[0]?.id || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      nickname,
      color,
      age: Number(age),
      owner_id: ownerId
    });
    onClose();
  };

  return (
    <FormLayout title="Новая лошадь" onClose={onClose}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <InputField label="Кличка лошади" placeholder="Напр. Вихрь" value={nickname} onChange={e => setNickname(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Окрас" placeholder="Гнедая" value={color} onChange={e => setColor(e.target.value)} />
          <InputField label="Возраст" type="number" placeholder="4" value={age} onChange={e => setAge(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Владелец</label>
          <select
            required
            value={ownerId}
            onChange={e => setOwnerId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium"
          >
            {owners.map(o => <option key={o.id} value={o.id}>{o.full_name}</option>)}
          </select>
        </div>
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 mt-4">
          Зарегистрировать
        </button>
      </form>
    </FormLayout>
  );
}

function UserForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => Promise<void> }) {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [license, setLicense] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      full_name: fullName,
      age: Number(age),
      license
    });
    onClose();
  };

  return (
    <FormLayout title="Новый жокей" onClose={onClose}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <InputField label="ФИО Жокея" placeholder="Иван Иванов" value={fullName} onChange={e => setFullName(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Возраст" type="number" placeholder="25" value={age} onChange={e => setAge(e.target.value)} />
          <InputField label="Лицензия" placeholder="LIC-000" value={license} onChange={e => setLicense(e.target.value)} />
        </div>
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 mt-4">
          Добавить в систему
        </button>
      </form>
    </FormLayout>
  );
}

function HippodromeForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => Promise<void> }) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name,
      city,
      address
    });
    onClose();
  };

  return (
    <FormLayout title="Новый ипподром" onClose={onClose}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <InputField label="Название" placeholder="Центральный ипподром" value={name} onChange={e => setName(e.target.value)} />
        <InputField label="Город" placeholder="Москва" value={city} onChange={e => setCity(e.target.value)} />
        <InputField label="Адрес" placeholder="ул. Беговая, 22" value={address} onChange={e => setAddress(e.target.value)} />
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 mt-4">
          Создать
        </button>
      </form>
    </FormLayout>
  );
}

function RegisterEntryForm({ race, horses, onClose, onSubmit }: { race: Race; horses: Horse[]; onClose: () => void; onSubmit: (data: any) => Promise<void> }) {
  const [horseId, setHorseId] = useState(horses[0]?.id || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      horse_id: horseId,
    });
    onClose();
  };

  return (
    <FormLayout title={`Участие в: ${race.name}`} onClose={onClose}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Выберите лошадь</label>
          <select
            required
            value={horseId}
            onChange={e => setHorseId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium"
          >
            {horses.map(h => <option key={h.id} value={h.id}>{h.nickname} ({h.color})</option>)}
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