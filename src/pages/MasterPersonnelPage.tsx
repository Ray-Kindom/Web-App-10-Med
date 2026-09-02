import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PersonnelTable } from '../components/personnel/PersonnelTable';
import { Personnel, Battery } from '../types';
import {
  Users,
  UserPlus,
  Download,
  Filter,
  Shield,
  Layers,
  Sparkles,
  Printer,
} from 'lucide-react';

interface MasterPersonnelPageProps {
  onViewDossier: (person: Personnel) => void;
  onOpenAddModal: () => void;
  onOpenPrintModal: () => void;
}

export const MasterPersonnelPage: React.FC<MasterPersonnelPageProps> = ({
  onViewDossier,
  onOpenAddModal,
  onOpenPrintModal,
}) => {
  const { personnelList, currentUser, showNotification } = useApp();

  const handleExportCSV = () => {
    const headers = ['Snk No', 'Rank', 'Trade', 'Name', 'Battery', 'Status', 'Details', 'Blood Group', 'Medical Cat'];
    const rows = personnelList.map((p) => [
      p.snkNo,
      p.rk,
      p.trade,
      `"${p.name}"`,
      p.battery,
      p.status,
      `"${p.statusDetails || ''}"`,
      p.bloodGroup || 'O+',
      p.medicalCategory || 'AYE',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `10_Med_Regt_Nominal_Roll_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Master Nominal Roll exported to CSV.');
  };

  // Trade Counts
  const taCount = personnelList.filter((p) => p.trade === 'TA').length;
  const ocuCount = personnelList.filter((p) => p.trade === 'OCU').length;
  const dmtCount = personnelList.filter((p) => p.trade === 'DMT').length;
  const gnrCount = personnelList.filter((p) => p.trade === 'Gnr').length;
  const ckCount = personnelList.filter((p) => p.trade === 'Ck(U)').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              Master Nominal Roll
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              {personnelList.length} Active Records
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Master Personnel Database
          </h1>
          <p className="text-xs text-slate-400">
            Official Bangladesh Army 10 Medium Regiment Artillery personnel roster & specialty trade records.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenPrintModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-rose-400" />
            <span>Print Parade State</span>
          </button>
          {currentUser.role === 'RSM' && (
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-900/40 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enlist Soldier</span>
            </button>
          )}
        </div>
      </div>

      {/* Trade Quick Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 font-mono">TA (Technical Asst)</div>
          <div className="mt-1 text-xl font-bold font-mono text-white">{taCount}</div>
          <div className="text-[10px] text-blue-400 mt-0.5">Fire Direction / Survey</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 font-mono">OCU (Operational)</div>
          <div className="mt-1 text-xl font-bold font-mono text-white">{ocuCount}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Command Post Control</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 font-mono">DMT (Mech Transport)</div>
          <div className="mt-1 text-xl font-bold font-mono text-white">{dmtCount}</div>
          <div className="text-[10px] text-amber-400 mt-0.5">Gun Towing & Drivers</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 font-mono">Gnr (Gunners)</div>
          <div className="mt-1 text-xl font-bold font-mono text-white">{gnrCount}</div>
          <div className="text-[10px] text-purple-400 mt-0.5">Artillery Gun Crews</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 font-mono">Ck(U) (Cook Unit)</div>
          <div className="mt-1 text-xl font-bold font-mono text-white">{ckCount}</div>
          <div className="text-[10px] text-rose-400 mt-0.5">Regimental Cookhouse</div>
        </div>
      </div>

      {/* Main Personnel Table Component */}
      <PersonnelTable
        personnel={personnelList}
        onViewDossier={onViewDossier}
        onOpenAddModal={onOpenAddModal}
        allowStatusEdits={currentUser.role !== 'CO'}
        title="10 Medium Regiment Artillery — Master Roll"
      />
    </div>
  );
};
