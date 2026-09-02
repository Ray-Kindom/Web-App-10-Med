import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_USERS } from '../data/initialData';
import { Role, Battery, UserAccount } from '../types';
import {
  Settings,
  Shield,
  Users,
  Database,
  KeyRound,
  FileText,
  RotateCcw,
  CheckCircle2,
  Server,
  Sparkles,
  Lock,
} from 'lucide-react';

export const AdminPanelPage: React.FC = () => {
  const {
    auditLogs,
    personnelList,
    currentUser,
    switchRole,
    showNotification,
    addAuditLog,
  } = useApp();

  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'ROLES' | 'AUDIT' | 'FIREBASE'>('ROLES');

  const handleUpdateBattery = (userId: string, battery: Battery) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, assignedBattery: battery } : u))
    );
    showNotification('Battery assignment updated for user.');
    addAuditLog('User Role Modified', `Updated battery for user ID ${userId} to ${battery}`, 'SECURITY');
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (selectedCategory !== 'All' && log.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                System Administration
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                SECURE CONFIGURATION
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-sans mt-1">
              Admin & System Security Panel
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Manage 10 Med Regt user roles, battery assignments, security audit logs & Firebase readiness.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('ROLES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ROLES'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            Role & Battery Permissions
          </button>
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'AUDIT'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            Audit Logs ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('FIREBASE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'FIREBASE'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            Firebase Schema Architecture
          </button>
        </div>
      </div>

      {/* Tab 1: Roles & Battery Assignments */}
      {activeTab === 'ROLES' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-sans">
                  Regimental User Accounts & Role Permissions
                </h3>
                <p className="text-xs text-slate-400">
                  Role-based access matrix for CO, Adjutant, RSM, Officers, and BSMs
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                    <th className="p-3">User / Rank</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Service ID</th>
                    <th className="p-3">Assigned Battery Restriction</th>
                    <th className="p-3">Access Level</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-amber-400">
                            {u.rank.slice(0, 2)}
                          </div>
                          <div>
                            <div>{u.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">@{u.username}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                          {u.role}
                        </span>
                      </td>

                      <td className="p-3 font-mono text-slate-300">{u.snkNo || 'BA-OFFICER'}</td>

                      <td className="p-3">
                        {u.role === 'BSM' || u.role === 'Officers' ? (
                          <select
                            value={u.assignedBattery || 'P Bty'}
                            onChange={(e) => handleUpdateBattery(u.id, e.target.value as Battery)}
                            className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                          >
                            <option value="HQ Bty">HQ Battery</option>
                            <option value="P Bty">P Battery</option>
                            <option value="Q Bty">Q Battery</option>
                            <option value="R Bty">R Battery</option>
                          </select>
                        ) : (
                          <span className="text-slate-500 font-mono text-[11px]">All Sub-Units (Regimental)</span>
                        )}
                      </td>

                      <td className="p-3">
                        <span className="text-emerald-400 font-mono text-[11px]">
                          {u.role === 'CO'
                            ? 'Executive Read-Only'
                            : u.role === 'Admin'
                            ? 'Full System Administrator'
                            : u.role === 'Adjutant'
                            ? 'Regiment Roll & State Approval'
                            : u.role === 'RSM'
                            ? 'Consolidated Muster & Discipline'
                            : 'Battery State & Nominal Roll'}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={() => switchRole(u.role, u.assignedBattery)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium"
                        >
                          Switch to User
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Audit Logs */}
      {activeTab === 'AUDIT' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white font-sans">
                  Military System Audit & Activity Logs
                </h3>
                <p className="text-xs text-slate-400">
                  Immutable record of personnel changes, parade status verifications & user logins
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-mono"
                >
                  <option value="All">All Categories</option>
                  <option value="PARADE_STATE">PARADE_STATE</option>
                  <option value="PERSONNEL">PERSONNEL</option>
                  <option value="SECURITY">SECURITY</option>
                  <option value="SYSTEM">SYSTEM</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-slate-800/80 max-h-[500px] overflow-y-auto">
              {filteredLogs.map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-mono">{log.action}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-rose-400 border border-slate-700">
                        {log.category}
                      </span>
                    </div>
                    <p className="text-slate-400 font-sans">{log.details}</p>
                    <div className="text-[10px] text-slate-500 font-mono">By: {log.performedBy}</div>
                  </div>

                  <div className="text-right text-[11px] font-mono text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Firebase Schema Architecture */}
      {activeTab === 'FIREBASE' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Firebase Firestore & Authentication Ready Architecture
            </h3>
          </div>
          <p className="text-slate-400">
            The frontend application is architected with clear TypeScript interfaces and modular service separation so that connecting Firebase is immediate and seamless:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-amber-400">1. /users Collection</div>
              <p className="text-[11px] text-slate-400">
                Maps to Firebase Authentication UID. Stores rank, name, role (CO, Officers, Adjt, RSM, BSM, Admin), assignedBattery.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-blue-400">2. /personnel Collection</div>
              <p className="text-[11px] text-slate-400">
                Stores military snkNo, rank, trade (TA, OCU, DMT, Gnr, Ck(U)), name, battery, status, bloodGroup, medicalCategory.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-emerald-400">3. /parade_states Collection</div>
              <p className="text-[11px] text-slate-400">
                Daily morning & evening consolidated muster states with date, battery totals, submittedBy, and approval stages.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
