import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MilitaryRank, Trade, Battery, ParadeStatus, Personnel } from '../../types';
import { UnitLogo } from '../common/UnitLogo';
import { X, UserPlus, Shield, Check } from 'lucide-react';

interface AddPersonnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBattery?: Battery;
}

export const AddPersonnelModal: React.FC<AddPersonnelModalProps> = ({
  isOpen,
  onClose,
  defaultBattery,
}) => {
  const { addPersonnel, currentUser } = useApp();

  const isRsm = currentUser.role === 'RSM';

  const [snkNo, setSnkNo] = useState('');
  const [name, setName] = useState('');
  const [rk, setRk] = useState<MilitaryRank | string>('Snk');
  const [trade, setTrade] = useState<Trade | string>('Gnr');
  const [battery, setBattery] = useState<Battery>(defaultBattery || 'HQ Bty');
  const [status, setStatus] = useState<ParadeStatus>('Present');
  const [statusDetails, setStatusDetails] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [medicalCategory, setMedicalCategory] = useState<'AYE' | 'BEE' | 'CEE'>('AYE');
  const [nokName, setNokName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRsm) {
      alert('Access Restricted: Only Regimental Sergeant Major (RSM) can enlist new personnel.');
      return;
    }
    if (!snkNo.trim() || !name.trim()) {
      alert('Please fill Army/Snk No and Soldier Name');
      return;
    }

    addPersonnel({
      snkNo: snkNo.trim(),
      name: name.trim(),
      rk,
      trade,
      battery,
      status,
      statusDetails: statusDetails.trim() || undefined,
      bloodGroup,
      medicalCategory,
      nokName: nokName.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UnitLogo size="sm" />
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                Enlist Personnel to 10 Med Regt Roll
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Official Unit Nominal Roll Entry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        {!isRsm ? (
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2">
              <div className="font-bold text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Enlistment Authority Restricted to RSM</span>
              </div>
              <p className="text-xs text-slate-300">
                You are currently logged in as <span className="font-bold text-white">{currentUser.rank} {currentUser.name} ({currentUser.role})</span>. Only the <span className="font-bold text-amber-300">Regimental Sergeant Major (RSM)</span> has the administrative authorization to enlist new soldiers into the active muster roll.
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                Please switch your active role to RSM from the top bar if you need to simulate new soldier enrollment.
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white font-medium"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Army / Soldier Number (Snk No) *
                </label>
                <input
                  type="text"
                  required
                  value={snkNo}
                  onChange={(e) => setSnkNo(e.target.value)}
                  placeholder="e.g. 1243507 or BA-9921"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Md. Shamsur Rahman"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Military Rank *
              </label>
              <select
                value={rk}
                onChange={(e) => setRk(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Lt Col">Lt Col</option>
                <option value="Maj">Maj</option>
                <option value="Capt">Capt</option>
                <option value="Lt">Lt</option>
                <option value="SWO">SWO</option>
                <option value="WO">WO</option>
                <option value="Sgt">Sgt</option>
                <option value="Cpl">Cpl</option>
                <option value="Lcpl">Lcpl</option>
                <option value="Snk">Snk</option>
                <option value="Gnr">Gnr</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Trade / Specialty *
              </label>
              <select
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500"
              >
                <option value="TA">TA (Technical Assistant)</option>
                <option value="OCU">OCU (Operational Control)</option>
                <option value="DMT">DMT (Driver Mech Transport)</option>
                <option value="Gnr">Gnr (Gunner)</option>
                <option value="Ck(U)">Ck(U) (Cook Unit)</option>
                <option value="Clerk">Clerk (GD)</option>
                <option value="Tech">Gun Tech</option>
                <option value="Rdr">Radar Operator</option>
                <option value="Surv">Surveyor</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Battery Assignment *
              </label>
              <select
                value={battery}
                onChange={(e) => setBattery(e.target.value as Battery)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500"
              >
                <option value="HQ Bty">HQ Battery</option>
                <option value="P Bty">P Battery</option>
                <option value="Q Bty">Q Battery</option>
                <option value="R Bty">R Battery</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Current Parade State *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ParadeStatus)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Present">Present on Parade</option>
                <option value="On Duty">On Duty / Guard</option>
                <option value="CMH/Sick">CMH / Sick Report</option>
                <option value="Leave">Leave / Furlough</option>
                <option value="Course/Trg">Course / Training</option>
                <option value="Temp Duty">Temporary Duty</option>
                <option value="Attached Out">Attached Out</option>
                <option value="AWOL/OSL">AWOL / OSL</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Status Details / Location
              </label>
              <input
                type="text"
                value={statusDetails}
                onChange={(e) => setStatusDetails(e.target.value)}
                placeholder="e.g. Quarter Guard, CMH Ward 3, Annual Leave"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500 font-mono"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Medical Category
              </label>
              <select
                value={medicalCategory}
                onChange={(e) => setMedicalCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500 font-mono"
              >
                <option value="AYE">AYE (Fit Field Duty)</option>
                <option value="BEE">BEE (Sedentary/Restricted)</option>
                <option value="CEE">CEE (Hospitalized/Temp Unfit)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Next of Kin (NOK)
              </label>
              <input
                type="text"
                value={nokName}
                onChange={(e) => setNokName(e.target.value)}
                placeholder="Parent/Spouse Name"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-rose-900/40"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enlist Soldier</span>
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};
