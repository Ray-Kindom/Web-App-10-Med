import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role, Battery } from '../types';
import { UnitLogo } from '../components/common/UnitLogo';
import { INITIAL_USERS } from '../data/initialData';
import {
  Lock,
  User,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Shield,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { setCurrentUser, setActivePage, showNotification } = useApp();

  const [username, setUsername] = useState('co');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<Role>('CO');
  const [selectedBattery, setSelectedBattery] = useState<Battery>('P Bty');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = INITIAL_USERS.find((u) => u.role === selectedRole) || INITIAL_USERS[0];
    const finalUser = {
      ...user,
      assignedBattery: selectedRole === 'BSM' ? selectedBattery : user.assignedBattery,
    };
    setCurrentUser(finalUser);
    showNotification(`Logged in as ${finalUser.rank} ${finalUser.name} (${finalUser.role})`);
    setActivePage('main_dashboard');
  };

  const handleQuickLogin = (role: Role, bty?: Battery) => {
    const user = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    const finalUser = {
      ...user,
      assignedBattery: bty || user.assignedBattery || (role === 'BSM' ? 'P Bty' : undefined),
    };
    setCurrentUser(finalUser);
    showNotification(`Logged in as ${finalUser.rank} ${finalUser.name} (${finalUser.role})`);
    setActivePage(role === 'CO' ? 'co_dashboard' : role === 'RSM' ? 'rsm_dashboard' : 'main_dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Military Grid Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Unit Emblem & Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <UnitLogo size="xl" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide font-sans">
              10 MED REGT ARTY
            </h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                Born Destroyer
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Smart Dashboard
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              Secure Personnel & Parade State Management System
            </p>
          </div>
        </div>

        {/* Quick Role Selection Cards */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Select Role to Access (Simulate Unit Login):
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { role: 'CO' as Role, label: 'CO', desc: 'Lt Col Tariq' },
              { role: 'Adjutant' as Role, label: 'Adjt', desc: 'Capt Saifuddin' },
              { role: 'RSM' as Role, label: 'RSM', desc: 'SWO Nasir' },
              { role: 'Officers' as Role, label: 'Officer', desc: 'Lt Rayahan' },
              { role: 'BSM' as Role, label: 'BSM', desc: 'P Battery' },
              { role: 'Admin' as Role, label: 'Admin', desc: 'IT Controller' },
            ].map((r) => (
              <button
                key={r.role}
                type="button"
                onClick={() => handleQuickLogin(r.role, r.role === 'BSM' ? 'P Bty' : undefined)}
                className={`p-2 rounded-xl text-center border transition-all ${
                  selectedRole === r.role
                    ? 'bg-rose-950/60 border-rose-500 text-white shadow-md shadow-rose-950/40 ring-1 ring-rose-500'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs font-mono">{r.label}</div>
                <div className="text-[10px] text-slate-400 truncate">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 pt-2 border-t border-slate-800/80">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Service ID / Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. co / adjt / bsm_p"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Security Passkey / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition-all"
          >
            <span>Authenticate into 10 Med Regt System</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security Notice */}
        <div className="pt-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>MILITARY CONFIDENTIAL • READY FOR FIREBASE AUTH</span>
        </div>
      </div>
    </div>
  );
};
