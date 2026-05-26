import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Plus, Mail, Lock, EyeOff, Eye, ShieldCheck } from 'lucide-react';
import { UserRole, User } from '../../types';
import { decodeJwtPayload } from '../../lib/utils';
import { api } from '../../services/api';

interface LoginPageProps {
  onLogin: (role: UserRole, authUser: User) => void;
  onClose: () => void;
}

export function LoginPage({ onLogin, onClose }: LoginPageProps) {
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
