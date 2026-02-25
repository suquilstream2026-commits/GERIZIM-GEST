
import React, { useState, useEffect } from 'react';
import { useAuth } from '../authContext';
import { UserRole, Member, TransactionCategory, Transaction } from '../types';
import { 
  Users, 
  Calendar, 
  Plus, 
  Search,
  CheckCircle2,
  Circle,
  X,
  Bell,
  CalendarDays,
  Save,
  FileText,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Download,
  Wallet,
  ArrowUpCircle,
  Clock,
  ListTodo,
  MoreVertical,
  Trash2
} from 'lucide-react';

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Scale {
  id: string;
  task: string;
  member: string;
  date: string;
  time: string;
  subtasks: Subtask[];
}

import MemberManager from '../components/MemberManager';

import DeptManagement from '../components/DeptManagement';

const JIESA: React.FC = () => {
  const { user, theme } = useAuth();
  const [activeTab, setActiveTab] = useState<'members' | 'management'>('members');

  return (
    <div className="space-y-8 animate-reveal pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter dark:text-white">JIESA</h2>
            <p className="text-slate-500 font-medium">JUVENTUDE DA IESA.</p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <button onClick={() => setActiveTab('members')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'members' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>Membros</button>
            <button onClick={() => setActiveTab('management')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'management' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>Gestão Interna</button>
        </div>
      </div>

      {activeTab === 'members' ? (
        <MemberManager department="JIESA" title="Diretório JIESA" />
      ) : (
        <DeptManagement department="JIESA" />
      )}
    </div>
  );
};

export default JIESA;
