
import React, { useState } from 'react';
import { useAuth } from '../authContext';
import { UserRole } from '../types';
import { 
  Baby, Users, Search, Plus, X, ShieldCheck, Heart, 
  ChevronRight, Star, GraduationCap, Filter, UserPlus,
  Calendar, Phone, Info, Save
} from 'lucide-react';

import MemberManager from '../components/MemberManager';
import DeptManagement from '../components/DeptManagement';

const DCIESA: React.FC = () => {
  const { user, theme, filiais } = useAuth();
  const [activeTab, setActiveTab] = useState<'directory' | 'cbic' | 'management'>('directory');

  return (
    <div className="space-y-8 animate-reveal pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-rose-600">DCIESA</h2>
          <p className="text-slate-500 font-medium">DEPARTAMENTO DE CRIANÇAS DA IESA.</p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-x-auto">
          <button onClick={() => setActiveTab('directory')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'directory' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400'}`}>Membros</button>
          <button onClick={() => setActiveTab('management')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'management' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400'}`}>Gestão</button>
          <button onClick={() => setActiveTab('cbic')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'cbic' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400'}`}>Academia CBIC</button>
        </div>
      </div>

      {activeTab === 'directory' && (
        <MemberManager department="DCIESA" title="Diretório DCIESA" />
      )}

      {activeTab === 'management' && (
        <DeptManagement department="DCIESA" />
      )}

      {activeTab === 'cbic' && (
        <div className={`p-12 rounded-[3.5rem] border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'} text-center space-y-6`}>
           <div className="w-24 h-24 bg-rose-100 dark:bg-rose-900/20 text-rose-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <GraduationCap size={48} />
           </div>
           <h3 className="text-3xl font-black uppercase tracking-tighter dark:text-white">Academia CBIC</h3>
           <p className="text-slate-500 max-w-xl mx-auto font-medium">O Centro de Batismo e Instrução Cristã é o coração da formação espiritual dos nossos pequenos. Em breve, acompanhamento completo de notas e volumes.</p>
        </div>
      )}
    </div>
  );
};

export default DCIESA;
