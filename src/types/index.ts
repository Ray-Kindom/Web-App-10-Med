export type Role = 'CO' | 'Officers' | 'Adjutant' | 'RSM' | 'BSM' | 'Admin';

export type Battery = 'HQ Bty' | 'P Bty' | 'Q Bty' | 'R Bty';

export type MilitaryRank =
  | 'Lt Col'
  | 'Maj'
  | 'Capt'
  | 'Lt'
  | 'SWO'
  | 'WO'
  | 'Sgt'
  | 'Cpl'
  | 'Lcpl'
  | 'Snk'
  | 'Gnr';

export type Trade =
  | 'TA' // Technical Assistant
  | 'OCU' // Operational Control Unit / Gunner OCU
  | 'DMT' // Driver Mechanical Transport
  | 'Gnr' // Gunner
  | 'Ck(U)' // Cook (Unit)
  | 'Clerk'
  | 'Tech'
  | 'Rdr' // Radar
  | 'Surv'; // Survey

export type ParadeStatus =
  | 'Present'
  | 'On Duty'
  | 'CMH/Sick'
  | 'Leave'
  | 'Course/Trg'
  | 'Temp Duty'
  | 'Attached Out'
  | 'AWOL/OSL';

export interface Personnel {
  id: string;
  snkNo: string;
  rk: MilitaryRank | string;
  trade: Trade | string;
  name: string;
  battery: Battery;
  status: ParadeStatus;
  statusDetails?: string;
  rmk?: string;
  phone?: string;
  bloodGroup?: string;
  enlistmentDate?: string;
  medicalCategory?: 'AYE' | 'BEE' | 'CEE';
  currentDuty?: string;
  nokName?: string;
  nokContact?: string;
  // Extended state details
  leaveType?: 'P/Lve' | 'C/Lve';
  leaveFrom?: string;
  leaveTo?: string;
  joiningDate?: string; // Kobe join korbe
  leaveAddress?: string;
  courseName?: string; // Kon course e geche
  courseLocation?: string;
  courseFrom?: string;
  courseTo?: string; // Kobe sesh
  courseDuration?: string;
  sickType?: 'CMH' | 'Sic';
  hospitalName?: string;
  diagnosis?: string;
  admissionDate?: string;
  reviewDate?: string;
  comdAssignment?: string;
  comdLocation?: string;
  comdFrom?: string;
  comdTo?: string;
  comdAuthority?: string;
}

export interface BatteryParadeSummary {
  battery: Battery;
  posted: number;
  present: number;
  onDuty: number;
  sick: number;
  leave: number;
  course: number;
  tempDuty: number;
  attached: number;
  absent: number;
  submissionStatus: 'Pending' | 'Submitted' | 'Verified' | 'Approved';
  lastUpdated: string;
  submittedBy?: string;
}

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  name: string;
  snkNo?: string;
  rank: string;
  role: Role;
  accessLevel?: string;
  assignedBattery?: Battery;
  assignedBatteries?: Battery[];
  email?: string;
  avatar?: string;
  lastLogin?: string;
}

export interface DutyAssignment {
  id: string;
  dutyType: 'Quarter Guard' | 'Regimental Police' | 'Duty NCO' | 'Duty Officer' | 'Cookhouse I/C' | 'Armoury Guard' | 'Main Gate';
  assignedPersonnel: {
    id: string;
    snkNo: string;
    name: string;
    rank: string;
    battery: Battery;
  }[];
  date: string;
  shift: 'Day' | 'Night' | '24 Hours';
  location: string;
  status: 'Scheduled' | 'Active' | 'Relieved';
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  role: Role;
  details: string;
  category: 'PARADE_STATE' | 'PERSONNEL' | 'SYSTEM' | 'SECURITY';
}
