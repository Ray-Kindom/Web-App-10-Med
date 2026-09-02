import React, { useState } from 'react';
import { Personnel, Battery, ParadeStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { RankBadge } from '../common/RankBadge';
import {
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Shield,
  UserCheck,
  ChevronDown,
  Download,
  Plus,
} from 'lucide-react';

interface PersonnelTableProps {
  personnel: Personnel[];
  onViewDossier: (person: Personnel) => void;
  onEditPerson?: (person: Personnel) => void;
  onOpenAddModal?: () => void;
  allowStatusEdits?: boolean;
  fixedBattery?: Battery;
  title?: string;
}

export const PersonnelTable: React.FC<PersonnelTableProps> = ({
  personnel,
  onViewDossier,
  onEditPerson,
  onOpenAddModal,
  allowStatusEdits = true,
  fixedBattery,
  title,
}) => {
  const {
    updateParadeStatus,
    batchUpdateStatus,
    deletePersonnel,
    currentUser,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batteryFilter, setBatteryFilter] = useState<Battery | 'All'>(fixedBattery || 'All');
  const [tradeFilter, setTradeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [rankCategoryFilter, setRankCategoryFilter] = useState<string>('All');
  const [activeStatusMenuId, setActiveStatusMenuId] = useState<string | null>(null);

  // Filter items
  const filteredPersonnel = personnel.filter((p) => {
    // Battery filter
    if (fixedBattery && p.battery !== fixedBattery) return false;
    if (batteryFilter !== 'All' && p.battery !== batteryFilter) return false;

    // Trade filter
    if (tradeFilter !== 'All' && p.trade !== tradeFilter) return false;

    // Status filter
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;

    // Rank filter
    if (rankCategoryFilter !== 'All') {
      if (rankCategoryFilter === 'Officers' && !['Lt Col', 'Maj', 'Capt', 'Lt'].includes(p.rk)) return false;
      if (rankCategoryFilter === 'JCO' && !['SWO', 'WO'].includes(p.rk)) return false;
      if (rankCategoryFilter === 'NCO' && !['Sgt', 'Cpl', 'Lcpl'].includes(p.rk)) return false;
      if (rankCategoryFilter === 'Soldier' && !['Snk', 'Gnr'].includes(p.rk)) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSnk = p.snkNo.toLowerCase().includes(q);
      const matchName = p.name.toLowerCase().includes(q);
      const matchRk = p.rk.toLowerCase().includes(q);
      const matchTrade = p.trade.toLowerCase().includes(q);
      const matchBty = p.battery.toLowerCase().includes(q);
      const matchStatus = p.status.toLowerCase().includes(q);
      if (!matchSnk && !matchName && !matchRk && !matchTrade && !matchBty && !matchStatus) {
        return false;
      }
    }

    return true;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredPersonnel.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBatchStatus = (status: ParadeStatus) => {
    if (selectedIds.length === 0) return;
    batchUpdateStatus(selectedIds, status);
    setSelectedIds([]);
  };

  const isCoReadOnly = currentUser.role === 'CO';
  const canEdit = allowStatusEdits && !isCoReadOnly;

  const statusOptions: ParadeStatus[] = [
    'Present',
    'On Duty',
    'CMH/Sick',
    'Leave',
    'Course/Trg',
    'Temp Duty',
    'Attached Out',
    'AWOL/OSL',
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{title || '10 Med Regt Personnel Roll'}</span>
              <span className="text-xs font-mono font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {filteredPersonnel.length} / {personnel.length} Listed
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive nominal roll, military rank, artillery trade & parade status
            </p>
          </div>

          <div className="flex items-center gap-2">
            {currentUser.role === 'RSM' && onOpenAddModal && (
              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-900/30 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Enlist Soldier</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 pt-2 text-xs">
          {/* Search bar inside table */}
          <div className="col-span-2 sm:col-span-2 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search snk no, name, trade..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Battery filter */}
          {!fixedBattery && (
            <select
              value={batteryFilter}
              onChange={(e) => setBatteryFilter(e.target.value as any)}
              className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            >
              <option value="All">All Batteries (4)</option>
              <option value="HQ Bty">HQ Battery</option>
              <option value="P Bty">P Battery</option>
              <option value="Q Bty">Q Battery</option>
              <option value="R Bty">R Battery</option>
            </select>
          )}

          {/* Trade Filter */}
          <select
            value={tradeFilter}
            onChange={(e) => setTradeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="All">All Trades</option>
            <option value="TA">TA (Technical Assistant)</option>
            <option value="OCU">OCU (Operational Control)</option>
            <option value="DMT">DMT (Driver Mech Transport)</option>
            <option value="Gnr">Gnr (Gunner)</option>
            <option value="Ck(U)">Ck(U) (Cook Unit)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="All">All Statuses</option>
            <option value="Present">Present on Parade</option>
            <option value="On Duty">On Duty / Guard</option>
            <option value="CMH/Sick">CMH / Sick</option>
            <option value="Leave">Leave / Furlough</option>
            <option value="Course/Trg">Course / Training</option>
            <option value="Temp Duty">Temporary Duty</option>
            <option value="Attached Out">Attached Out</option>
            <option value="AWOL/OSL">AWOL / OSL</option>
          </select>
        </div>

        {/* Batch Operations Bar */}
        {selectedIds.length > 0 && canEdit && (
          <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-rose-200 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-rose-400" />
              <span>{selectedIds.length} Soldiers Selected for Batch Action:</span>
            </span>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => handleBatchStatus('Present')}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium shadow-sm text-xs"
              >
                Mark Present
              </button>
              <button
                onClick={() => handleBatchStatus('On Duty')}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium shadow-sm text-xs"
              >
                Mark On Duty
              </button>
              <button
                onClick={() => handleBatchStatus('CMH/Sick')}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded font-medium shadow-sm text-xs"
              >
                Mark CMH
              </button>
              <button
                onClick={() => handleBatchStatus('Leave')}
                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded font-medium shadow-sm text-xs"
              >
                Mark Leave
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-2 py-1 bg-slate-800 text-slate-300 hover:text-white rounded text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] font-mono border-b border-slate-800">
              {canEdit && (
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredPersonnel.length > 0 &&
                      selectedIds.length === filteredPersonnel.length
                    }
                    onChange={handleSelectAll}
                    className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-rose-500 focus:ring-offset-0 cursor-pointer"
                  />
                </th>
              )}
              <th className="p-3">Army / Snk No</th>
              <th className="p-3">Rank & Trade</th>
              <th className="p-3">Soldier Name</th>
              <th className="p-3">Battery</th>
              <th className="p-3">Parade State</th>
              <th className="p-3">Medical / Blood</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filteredPersonnel.length === 0 ? (
              <tr>
                <td
                  colSpan={canEdit ? 8 : 7}
                  className="p-8 text-center text-slate-400 font-medium"
                >
                  <Shield className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p>No military personnel records found matching current criteria.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setBatteryFilter(fixedBattery || 'All');
                      setTradeFilter('All');
                      setStatusFilter('All');
                    }}
                    className="mt-2 text-rose-400 hover:underline text-xs"
                  >
                    Clear active filters
                  </button>
                </td>
              </tr>
            ) : (
              filteredPersonnel.map((person) => {
                const isSelected = selectedIds.includes(person.id);
                return (
                  <tr
                    key={person.id}
                    className={`hover:bg-slate-800/50 transition-colors ${
                      isSelected ? 'bg-rose-950/20' : ''
                    }`}
                  >
                    {canEdit && (
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(person.id)}
                          className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-rose-500 cursor-pointer"
                        />
                      </td>
                    )}

                    {/* Army / Snk No */}
                    <td className="p-3 font-mono font-bold text-slate-200 whitespace-nowrap">
                      <button
                        onClick={() => onViewDossier(person)}
                        className="hover:text-rose-400 hover:underline flex items-center gap-1 text-left"
                      >
                        <span>{person.snkNo}</span>
                      </button>
                    </td>

                    {/* Rank & Trade */}
                    <td className="p-3 whitespace-nowrap">
                      <RankBadge rank={person.rk} trade={person.trade} size="sm" />
                    </td>

                    {/* Name */}
                    <td className="p-3 font-semibold text-white whitespace-nowrap">
                      <button
                        onClick={() => onViewDossier(person)}
                        className="hover:text-amber-300 transition-colors text-left"
                      >
                        {person.name}
                      </button>
                    </td>

                    {/* Battery */}
                    <td className="p-3 whitespace-nowrap">
                      <span className="font-mono text-[11px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {person.battery}
                      </span>
                    </td>

                    {/* Status with Quick Update Dropdown */}
                    <td className="p-3 whitespace-nowrap relative">
                      <div className="flex items-center gap-2">
                        <StatusBadge
                          status={person.status}
                          details={person.statusDetails}
                          size="sm"
                        />

                        {canEdit && (
                          <div className="relative">
                            <button
                              onClick={() =>
                                setActiveStatusMenuId(
                                  activeStatusMenuId === person.id ? null : person.id
                                )
                              }
                              title="Quick Update Status"
                              className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>

                            {activeStatusMenuId === person.id && (
                              <div className="absolute left-0 top-full mt-1 w-44 bg-slate-950 border border-slate-700 rounded-lg shadow-2xl py-1 z-50 divide-y divide-slate-800">
                                <div className="px-2.5 py-1 text-[10px] font-mono text-slate-400 uppercase">
                                  Mark Status:
                                </div>
                                <div className="py-1">
                                  {statusOptions.map((st) => (
                                    <button
                                      key={st}
                                      onClick={() => {
                                        updateParadeStatus(person.id, st);
                                        setActiveStatusMenuId(null);
                                      }}
                                      className={`w-full text-left px-2.5 py-1 text-xs hover:bg-slate-800 flex items-center justify-between ${
                                        person.status === st ? 'text-rose-400 font-bold' : 'text-slate-300'
                                      }`}
                                    >
                                      <span>{st}</span>
                                      {person.status === st && (
                                        <CheckCircle2 className="w-3 h-3 text-rose-400" />
                                      )}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Medical / Blood Group */}
                    <td className="p-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      <span>{person.bloodGroup || 'O+'}</span>
                      <span className="mx-1 text-slate-600">|</span>
                      <span className="text-emerald-400 font-semibold">{person.medicalCategory || 'AYE'}</span>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onViewDossier(person)}
                          title="View Dossier"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {canEdit && onEditPerson && (
                          <button
                            onClick={() => onEditPerson(person)}
                            title="Edit Record"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {canEdit && (currentUser.role === 'Admin' || currentUser.role === 'Adjutant') && (
                          <button
                            onClick={() => {
                              if (confirm(`Remove soldier ${person.rk} ${person.name} (${person.snkNo}) from Nominal Roll?`)) {
                                deletePersonnel(person.id);
                              }
                            }}
                            title="Delete Soldier"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
