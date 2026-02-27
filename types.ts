
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'administrador',
  SECRETARY = 'secretário',
  TREASURER = 'tesoureiro',
  ASSISTANT = 'assistente',
  LEADER = 'responsável',
  SUPERVISOR = 'supervisor',
  MEMBER = 'membro'
}

export interface Song {
  id: string;
  title: string;
  author?: string;
  url: string;
  type: 'local' | 'drive' | 'external';
  format: string;
  category?: 'HINO' | 'CORO' | 'INSTRUMENTAL';
}

export enum TransactionCategory {
  TITHE = 'DIZIMO',
  OFFERING = 'OFERTA_GERAL',
  GRATITUDE = 'OFERTA_GRATIDAO',
  CONSTRUCTION = 'DOMINGO_CONSTRUCAO',
  MISSIONARY = 'FUNDO_MISSIONARIO',
  QUOTA = 'QUOTA_DEPARTAMENTAL',
  CONTRIBUTION = 'CONTRIBUICAO_ESPECIAL',
  CBIC_CONTRIBUTION = 'CONTRIBUICAO_CBIC',
  EXPENSE = 'DESPESA'
}

export interface Transaction {
  id: string;
  date: string;
  time: string;
  description: string;
  amount: number;
  type: 'ENT_ENTRADA' | 'SAI_SAIDA';
  category: TransactionCategory;
  memberName?: string;
  memberId?: string;
  receipt?: string;
  departmentOrigin?: string;
}

export interface HistoryEntry {
  id: string;
  date: string;
  type: 'TRANSITION' | 'STATUS_CHANGE' | 'DEPARTMENT_CHANGE' | 'REGISTRATION' | 'OTHER';
  description: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  department?: string;
  filial?: string;
  birthDate?: string;
  password?: string;
  phone?: string;
  notes?: string;
  fatherName?: string;
  motherName?: string;
  baptismDate?: string;
  area?: string;
  talents?: string[];
  dons?: string[];
  history?: HistoryEntry[];
  photo?: string;
  participation?: 'ACTIVO' | 'PASSIVO';
  spiritualState?: string;
  civilStatus?: string;
  gender?: 'M' | 'F';
  biNumber?: string;
  registrationDate?: string;
}

export interface Member extends User {
  roleInDept?: string;
}

export interface ChurchEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  department?: string;
  description: string;
}

export interface AppNotification {
  id: string;
  timestamp: string;
  message: string;
  type: 'INFO' | 'ALERT' | 'ACHIEVEMENT';
  author: string;
}

export interface SpiritualContent {
  id: string;
  date: string;
  verse: string;
  reflection: string;
}

export interface PrayerIntention {
  id: string;
  text: string;
  date: string;
  isAnswered: boolean;
}

export interface SpiritualNote {
  id: string;
  date: string;
  content: string;
}

// Added missing CBICStudent interface used in Dashboard.tsx
export interface CBICStudent {
  id: string;
  name: string;
  currentVolume: 1 | 2 | 3;
  grades: {
    vol1: { books: { continuous: number; exam: number }[] };
    vol2: { books: { continuous: number; exam: number }[] };
    vol3: { books: { continuous: number; exam: number }[] };
  };
}

export interface CBICContribution {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  month: string;
}

// Added missing Department interface used in MemberForm.tsx
export interface Department {
  id: string;
  name: string;
  roles: string[];
  color: string;
}

// Added missing ChurchAsset interface used in Patrimony.tsx
export interface ChurchAsset {
  id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  acquisitionDate: string;
  value: number;
  condition: 'NOVO' | 'BOM' | 'USADO' | 'DANIFICADO';
}

export interface DeptSchedule {
  id: string;
  department: string;
  title: string;
  type: 'ENSAIO' | 'ESTUDO' | 'ACTIVIDADE' | 'SERVICO';
  date: string;
  time: string;
  responsible: string;
  participants: string[];
}

export interface BibleLesson {
  id: string;
  department: string;
  theme: string;
  date: string;
  teacher: string;
  material: string;
  attendance: string[];
}

export interface Family {
  id: string;
  name: string;
  members: string[];
  address?: string;
  notes?: string;
}

export interface PastoralNote {
  id: string;
  memberId: string;
  authorId: string;
  date: string;
  content: string;
  type: 'VISITA' | 'ACONSELHAMENTO' | 'OBSERVACAO';
}

export interface Course {
  id: string;
  name: string;
  department: string;
  startDate: string;
  description?: string;
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  courseName: string;
  memberId: string;
  memberName: string;
  enrollmentDate: string;
  status: 'PENDENTE' | 'APROVADO' | 'CONCLUIDO';
}

export interface CommissionMember {
  id: string;
  department: string;
  memberId: string;
  memberName: string;
  role: string;
}
