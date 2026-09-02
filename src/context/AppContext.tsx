import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Personnel,
  UserAccount,
  Role,
  Battery,
  ParadeStatus,
  DutyAssignment,
  AuditLogItem,
  BatteryParadeSummary,
  DailyParadePoint,
  ParadePointCount,
  OutOfUnitCategory,
} from '../types';
import { INITIAL_PERSONNEL, INITIAL_USERS, INITIAL_DUTY_ROSTER, INITIAL_AUDIT_LOGS } from '../data/initialData';
import { INITIAL_PARADE_POINTS } from '../data/paradePointsData';

interface AppContextType {
  currentUser: UserAccount;
  setCurrentUser: (user: UserAccount) => void;
  switchRole: (role: Role, battery?: Battery) => void;
  usersList: UserAccount[];
  addUser: (user: Omit<UserAccount, 'id'>) => void;
  updateUser: (id: string, updated: Partial<UserAccount>) => void;
  deleteUser: (id: string) => void;
  personnelList: Personnel[];
  addPersonnel: (person: Omit<Personnel, 'id'>) => void;
  updatePersonnel: (id: string, updated: Partial<Personnel>) => void;
  deletePersonnel: (id: string) => void;
  updateParadeStatus: (id: string, status: ParadeStatus, statusDetails?: string) => void;
  batchUpdateStatus: (ids: string[], status: ParadeStatus, statusDetails?: string) => void;
  dutyRoster: DutyAssignment[];
  addDutyAssignment: (assignment: Omit<DutyAssignment, 'id'>) => void;
  auditLogs: AuditLogItem[];
  addAuditLog: (action: string, details: string, category: AuditLogItem['category']) => void;
  getBatterySummaries: () => BatteryParadeSummary[];
  getRegimentalTotals: () => {
    totalPosted: number;
    totalPresent: number;
    totalDuty: number;
    totalSick: number;
    totalLeave: number;
    totalCourse: number;
    totalTempDuty: number;
    totalAttached: number;
    totalAbsent: number;
    presentPercentage: number;
  };
  activePage: string;
  setActivePage: (page: string) => void;
  selectedBatteryFilter: Battery | 'All';
  setSelectedBatteryFilter: (bty: Battery | 'All') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  customLogo: string | null;
  setCustomLogo: (logo: string | null) => void;
  notification: string | null;
  showNotification: (msg: string) => void;

  // Daily Parade State Management
  dailyParadePoints: DailyParadePoint[];
  updateParadePointCount: (pointId: string, battery: Battery, counts: ParadePointCount) => void;
  togglePointForBattery: (pointId: string, battery: Battery, enabled: boolean) => void;
  setRsmPointSuggestion: (pointId: string, suggestion: Partial<ParadePointCount>) => void;
  addDailyParadePoint: (name: string, enabledBatteries?: Battery[], initialCounts?: ParadePointCount) => void;
  deleteDailyParadePoint: (pointId: string) => void;
  toggleDailyParadePointActive: (pointId: string, active: boolean) => void;

  // Out Of Unit Management
  assignOutOfUnit: (
    personnelId: string,
    category: OutOfUnitCategory,
    details: {
      location?: string;
      startDate?: string;
      endDate?: string;
      authority?: string;
      remarks?: string;
    }
  ) => void;
  cancelOutOfUnit: (personnelId: string) => void;

  // Modal triggers
  dailyParadeModalOpen: boolean;
  setDailyParadeModalOpen: (open: boolean) => void;
  outOfUnitModalOpen: boolean;
  setOutOfUnitModalOpen: (open: boolean) => void;
  activeOutOfUnitCategory: OutOfUnitCategory;
  setActiveOutOfUnitCategory: (cat: OutOfUnitCategory) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PERSONNEL: '10med_personnel_v2',
  USER: '10med_currentUser_v1',
  USERS_LIST: '10med_users_v2',
  DUTY: '10med_duty_v1',
  LOGS: '10med_logs_v1',
  LOGO: '10med_custom_logo_v1',
  PARADE_POINTS: '10med_parade_points_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usersList, setUsersList] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUserState] = useState<UserAccount>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_USERS[0]; // Default to CO
  });

  const [personnelList, setPersonnelList] = useState<Personnel[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PERSONNEL);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_PERSONNEL;
  });

  const [dutyRoster, setDutyRoster] = useState<DutyAssignment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DUTY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_DUTY_ROSTER;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [dailyParadePoints, setDailyParadePoints] = useState<DailyParadePoint[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PARADE_POINTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_PARADE_POINTS;
  });

  const [activePage, setActivePage] = useState<string>('main_dashboard');
  const [selectedBatteryFilter, setSelectedBatteryFilter] = useState<Battery | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customLogo, setCustomLogoState] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.LOGO);
  });
  const [notification, setNotification] = useState<string | null>(null);

  // Modals
  const [dailyParadeModalOpen, setDailyParadeModalOpen] = useState<boolean>(false);
  const [outOfUnitModalOpen, setOutOfUnitModalOpen] = useState<boolean>(false);
  const [activeOutOfUnitCategory, setActiveOutOfUnitCategory] = useState<OutOfUnitCategory>('Msn');

  const setCustomLogo = (logo: string | null) => {
    setCustomLogoState(logo);
    if (logo) {
      localStorage.setItem(STORAGE_KEYS.LOGO, logo);
      addAuditLog('Logo Updated (Admin)', 'Admin updated unit heraldic logo', 'SECURITY');
    } else {
      localStorage.removeItem(STORAGE_KEYS.LOGO);
      addAuditLog('Logo Reset (Admin)', 'Admin restored default unit logo', 'SECURITY');
    }
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PERSONNEL, JSON.stringify(personnelList));
  }, [personnelList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DUTY, JSON.stringify(dutyRoster));
  }, [dutyRoster]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PARADE_POINTS, JSON.stringify(dailyParadePoints));
  }, [dailyParadePoints]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const addAuditLog = (action: string, details: string, category: AuditLogItem['category']) => {
    const newLog: AuditLogItem = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action,
      performedBy: `${currentUser.rank} ${currentUser.name} (${currentUser.role})`,
      role: currentUser.role,
      details,
      category,
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  const setCurrentUser = (user: UserAccount) => {
    setCurrentUserState(user);
    addAuditLog('User Session Changed', `Switched active profile to ${user.name} (${user.role})`, 'SECURITY');
  };

  const switchRole = (role: Role, battery?: Battery) => {
    const matchingUser = usersList.find(u => u.role === role) || INITIAL_USERS.find(u => u.role === role);
    if (matchingUser) {
      let defaultBty: Battery | undefined = battery || matchingUser.assignedBattery;
      if (!defaultBty) {
        if (role === 'P BSM') defaultBty = 'P Bty';
        else if (role === 'Q BSM') defaultBty = 'Q Bty';
        else if (role === 'R BSM') defaultBty = 'R Bty';
        else if (role === 'HQ BSM') defaultBty = 'HQ Bty';
      }
      const updatedUser: UserAccount = {
        ...matchingUser,
        assignedBattery: defaultBty,
      };
      setCurrentUserState(updatedUser);
      showNotification(`Active Role changed to ${role}${updatedUser.assignedBattery ? ` (${updatedUser.assignedBattery})` : ''}`);
      addAuditLog('Role Switch', `Switched view mode to ${role}`, 'SECURITY');
    }
  };

  const addUser = (user: Omit<UserAccount, 'id'>) => {
    const newId = 'u-' + Date.now();
    const newUser: UserAccount = {
      ...user,
      id: newId,
      assignedBattery: user.assignedBatteries && user.assignedBatteries.length > 0 ? user.assignedBatteries[0] : user.assignedBattery,
      lastLogin: 'Never',
    };
    setUsersList(prev => [...prev, newUser]);
    showNotification(`User account @${newUser.username} (${newUser.rank} ${newUser.name}) created successfully.`);
    addAuditLog('User Created (Admin)', `Created user @${newUser.username} with role ${newUser.role} & assigned btys: ${newUser.assignedBatteries?.join(', ') || 'All'}`, 'SECURITY');
  };

  const updateUser = (id: string, updated: Partial<UserAccount>) => {
    setUsersList(prev =>
      prev.map(u => {
        if (u.id === id) {
          const updatedUser = { ...u, ...updated };
          if (currentUser.id === id) {
            setCurrentUserState(updatedUser);
          }
          return updatedUser;
        }
        return u;
      })
    );
    showNotification(`User account updated successfully.`);
    addAuditLog('User Updated (Admin)', `Modified user settings for ID ${id}`, 'SECURITY');
  };

  const deleteUser = (id: string) => {
    const target = usersList.find(u => u.id === id);
    if (!target) return;
    if (target.id === currentUser.id) {
      showNotification('Cannot delete your currently active user account.');
      return;
    }
    setUsersList(prev => prev.filter(u => u.id !== id));
    showNotification(`User @${target.username} (${target.name}) removed.`);
    addAuditLog('User Deleted (Admin)', `Deleted user account @${target.username} (${target.name})`, 'SECURITY');
  };

  const addPersonnel = (person: Omit<Personnel, 'id'>) => {
    const newId = (personnelList.length + 1).toString();
    const newPerson: Personnel = { ...person, id: newId };
    setPersonnelList(prev => [newPerson, ...prev]);
    showNotification(`Soldier ${newPerson.rk} ${newPerson.name} (${newPerson.snkNo}) enlisted successfully.`);
    addAuditLog('Personnel Enlisted', `${currentUser.role} enlisted ${newPerson.rk} ${newPerson.name} (${newPerson.snkNo}) to ${newPerson.battery}`, 'PERSONNEL');
  };

  const updatePersonnel = (id: string, updated: Partial<Personnel>) => {
    setPersonnelList(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updatedPerson = { ...p, ...updated };
          return updatedPerson;
        }
        return p;
      })
    );
    showNotification(`Personnel record updated successfully.`);
    addAuditLog('Personnel Updated', `Modified record for ID: ${id}`, 'PERSONNEL');
  };

  const deletePersonnel = (id: string) => {
    const target = personnelList.find(p => p.id === id);
    if (target) {
      setPersonnelList(prev => prev.filter(p => p.id !== id));
      showNotification(`Record for ${target.rk} ${target.name} removed from active roll.`);
      addAuditLog('Personnel Deleted', `Deleted ${target.rk} ${target.name} (${target.snkNo})`, 'PERSONNEL');
    }
  };

  const updateParadeStatus = (id: string, status: ParadeStatus, statusDetails?: string) => {
    setPersonnelList(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            status,
            statusDetails: statusDetails ?? (status === 'Present' ? undefined : p.statusDetails),
            outOfUnitCategory: status === 'Present' ? undefined : p.outOfUnitCategory,
          };
        }
        return p;
      })
    );
    const target = personnelList.find(p => p.id === id);
    if (target) {
      showNotification(`Status for ${target.name} set to ${status}`);
      addAuditLog('Parade Status Change', `Marked ${target.rk} ${target.name} (${target.snkNo}) as ${status}`, 'PARADE_STATE');
    }
  };

  const batchUpdateStatus = (ids: string[], status: ParadeStatus, statusDetails?: string) => {
    setPersonnelList(prev =>
      prev.map(p => {
        if (ids.includes(p.id)) {
          return {
            ...p,
            status,
            statusDetails: statusDetails ?? (status === 'Present' ? undefined : p.statusDetails),
            outOfUnitCategory: status === 'Present' ? undefined : p.outOfUnitCategory,
          };
        }
        return p;
      })
    );
    showNotification(`Updated ${ids.length} soldiers to ${status}`);
    addAuditLog('Batch Status Update', `Updated ${ids.length} records to ${status}`, 'PARADE_STATE');
  };

  // Out Of Unit Handlers
  const assignOutOfUnit = (
    personnelId: string,
    category: OutOfUnitCategory,
    details: {
      location?: string;
      startDate?: string;
      endDate?: string;
      authority?: string;
      remarks?: string;
    }
  ) => {
    let paradeStatus: ParadeStatus = 'Temp Duty';
    if (category === 'CMH') paradeStatus = 'CMH/Sick';
    else if (category === 'P/Lve' || category === 'C/Lve') paradeStatus = 'Leave';
    else if (category === 'Course') paradeStatus = 'Course/Trg';
    else if (category === 'Att') paradeStatus = 'Attached Out';
    else paradeStatus = 'Temp Duty';

    setPersonnelList(prev =>
      prev.map(p => {
        if (p.id === personnelId) {
          return {
            ...p,
            status: paradeStatus,
            outOfUnitCategory: category,
            outOfUnitLocation: details.location,
            outOfUnitStartDate: details.startDate,
            outOfUnitEndDate: details.endDate,
            outOfUnitAuthority: details.authority,
            outOfUnitRemarks: details.remarks,
            statusDetails: `${category} - ${details.location || details.remarks || 'Out of Unit'}`,
          };
        }
        return p;
      })
    );

    const person = personnelList.find(p => p.id === personnelId);
    showNotification(`Assigned ${person?.rk} ${person?.name} to [${category}] (${details.location || 'Out of Unit'})`);
    addAuditLog('Out Of Unit Assignment', `Assigned ${person?.rk} ${person?.name} (${person?.battery}) to ${category}: ${details.location || ''}`, 'PARADE_STATE');
  };

  const cancelOutOfUnit = (personnelId: string) => {
    setPersonnelList(prev =>
      prev.map(p => {
        if (p.id === personnelId) {
          return {
            ...p,
            status: 'Present',
            outOfUnitCategory: undefined,
            outOfUnitLocation: undefined,
            outOfUnitStartDate: undefined,
            outOfUnitEndDate: undefined,
            outOfUnitAuthority: undefined,
            outOfUnitRemarks: undefined,
            statusDetails: undefined,
          };
        }
        return p;
      })
    );

    const person = personnelList.find(p => p.id === personnelId);
    showNotification(`Cancelled Out-of-Unit status for ${person?.rk} ${person?.name} - Returned to Unit Present.`);
    addAuditLog('Out Of Unit Cancelled', `Returned ${person?.rk} ${person?.name} (${person?.battery}) to Present status in Unit`, 'PARADE_STATE');
  };

  // Daily Parade State Management Handlers
  const updateParadePointCount = (pointId: string, battery: Battery, counts: ParadePointCount) => {
    setDailyParadePoints(prev =>
      prev.map(pt => {
        if (pt.id === pointId) {
          return {
            ...pt,
            counts: {
              ...pt.counts,
              [battery]: counts,
            },
          };
        }
        return pt;
      })
    );
  };

  const togglePointForBattery = (pointId: string, battery: Battery, enabled: boolean) => {
    setDailyParadePoints(prev =>
      prev.map(pt => {
        if (pt.id === pointId) {
          const current = pt.enabledBatteries || ['HQ Bty', 'P Bty', 'Q Bty', 'R Bty'];
          const updated = enabled
            ? Array.from(new Set([...current, battery]))
            : current.filter(b => b !== battery);
          return {
            ...pt,
            enabledBatteries: updated,
          };
        }
        return pt;
      })
    );
    showNotification(`Updated parade point visibility for ${battery}`);
  };

  const setRsmPointSuggestion = (pointId: string, suggestion: Partial<ParadePointCount>) => {
    setDailyParadePoints(prev =>
      prev.map(pt => {
        if (pt.id === pointId) {
          return {
            ...pt,
            rsmSuggested: { ...pt.rsmSuggested, ...suggestion },
          };
        }
        return pt;
      })
    );
    showNotification(`RSM point suggestion updated.`);
  };

  const addDailyParadePoint = (name: string, enabledBatteries?: Battery[], initialCounts?: ParadePointCount) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const newId = 'pt-' + Date.now();
    const defaultCount = initialCounts || { offr: 0, jco: 0, or: 0 };
    const newPoint: DailyParadePoint = {
      id: newId,
      name: trimmed,
      order: dailyParadePoints.length + 1,
      isActive: true,
      enabledBatteries: enabledBatteries || ['HQ Bty', 'P Bty', 'Q Bty', 'R Bty'],
      counts: {
        'HQ Bty': { ...defaultCount },
        'P Bty': { ...defaultCount },
        'Q Bty': { ...defaultCount },
        'R Bty': { ...defaultCount },
      },
    };
    setDailyParadePoints(prev => [...prev, newPoint]);
    showNotification(`Added new Daily Parade point: "${trimmed}"`);
    addAuditLog('Parade Point Added', `Added parade duty point "${trimmed}"`, 'PARADE_STATE');
  };

  const deleteDailyParadePoint = (pointId: string) => {
    const target = dailyParadePoints.find(p => p.id === pointId);
    setDailyParadePoints(prev => prev.filter(p => p.id !== pointId));
    showNotification(`Parade point "${target?.name}" removed.`);
    addAuditLog('Parade Point Removed', `Removed point "${target?.name}"`, 'PARADE_STATE');
  };

  const toggleDailyParadePointActive = (pointId: string, active: boolean) => {
    setDailyParadePoints(prev =>
      prev.map(p => (p.id === pointId ? { ...p, isActive: active } : p))
    );
  };

  const addDutyAssignment = (assignment: Omit<DutyAssignment, 'id'>) => {
    const newAssignment: DutyAssignment = {
      ...assignment,
      id: 'duty-' + Date.now(),
    };
    setDutyRoster(prev => [newAssignment, ...prev]);
    showNotification(`New duty roster created for ${assignment.dutyType}`);
    addAuditLog('Duty Assigned', `Scheduled ${assignment.dutyType} on ${assignment.date}`, 'PARADE_STATE');
  };

  const getBatterySummaries = (): BatteryParadeSummary[] => {
    const batteries: Battery[] = ['HQ Bty', 'P Bty', 'Q Bty', 'R Bty'];
    return batteries.map(bty => {
      const btyMembers = personnelList.filter(p => p.battery === bty);
      const posted = btyMembers.length;
      const present = btyMembers.filter(p => p.status === 'Present').length;
      const onDuty = btyMembers.filter(p => p.status === 'On Duty').length;
      const sick = btyMembers.filter(p => p.status === 'CMH/Sick').length;
      const leave = btyMembers.filter(p => p.status === 'Leave').length;
      const course = btyMembers.filter(p => p.status === 'Course/Trg').length;
      const tempDuty = btyMembers.filter(p => p.status === 'Temp Duty').length;
      const attached = btyMembers.filter(p => p.status === 'Attached Out').length;
      const absent = btyMembers.filter(p => p.status === 'AWOL/OSL').length;

      return {
        battery: bty,
        posted,
        present,
        onDuty,
        sick,
        leave,
        course,
        tempDuty,
        attached,
        absent,
        submissionStatus: 'Approved',
        lastUpdated: '0630 HRS',
        submittedBy: bty === 'P Bty' ? 'SWO Jafor (BSM)' : bty === 'Q Bty' ? 'WO Hamid (BSM)' : bty === 'R Bty' ? 'WO Aminul (BSM)' : 'SWO Nasir (RSM)',
      };
    });
  };

  const getRegimentalTotals = () => {
    const totalPosted = personnelList.length;
    const totalPresent = personnelList.filter(p => p.status === 'Present').length;
    const totalDuty = personnelList.filter(p => p.status === 'On Duty').length;
    const totalSick = personnelList.filter(p => p.status === 'CMH/Sick').length;
    const totalLeave = personnelList.filter(p => p.status === 'Leave').length;
    const totalCourse = personnelList.filter(p => p.status === 'Course/Trg').length;
    const totalTempDuty = personnelList.filter(p => p.status === 'Temp Duty').length;
    const totalAttached = personnelList.filter(p => p.status === 'Attached Out').length;
    const totalAbsent = personnelList.filter(p => p.status === 'AWOL/OSL').length;
    const effectivePresent = totalPresent + totalDuty;
    const presentPercentage = totalPosted > 0 ? Math.round((effectivePresent / totalPosted) * 100) : 0;

    return {
      totalPosted,
      totalPresent,
      totalDuty,
      totalSick,
      totalLeave,
      totalCourse,
      totalTempDuty,
      totalAttached,
      totalAbsent,
      presentPercentage,
    };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        usersList,
        addUser,
        updateUser,
        deleteUser,
        personnelList,
        addPersonnel,
        updatePersonnel,
        deletePersonnel,
        updateParadeStatus,
        batchUpdateStatus,
        dutyRoster,
        addDutyAssignment,
        auditLogs,
        addAuditLog,
        getBatterySummaries,
        getRegimentalTotals,
        activePage,
        setActivePage,
        selectedBatteryFilter,
        setSelectedBatteryFilter,
        searchQuery,
        setSearchQuery,
        customLogo,
        setCustomLogo,
        notification,
        showNotification,

        dailyParadePoints,
        updateParadePointCount,
        togglePointForBattery,
        setRsmPointSuggestion,
        addDailyParadePoint,
        deleteDailyParadePoint,
        toggleDailyParadePointActive,

        assignOutOfUnit,
        cancelOutOfUnit,

        dailyParadeModalOpen,
        setDailyParadeModalOpen,
        outOfUnitModalOpen,
        setOutOfUnitModalOpen,
        activeOutOfUnitCategory,
        setActiveOutOfUnitCategory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

