
import React, { useState } from 'react';
import { useAuth } from '../authContext';
import MemberManager from '../components/MemberManager';
import DeptManagement from '../components/DeptManagement';

const SHIESA: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'directory' | 'management'>('directory');

  return (
    <div className="space-y-8 animate-reveal pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-pink-600">SHIESA</h2>
          <p className="text-slate-500 font-medium">Departamento de Senhoras da IESA Gerizim.</p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-x-auto">
          <button onClick={() => setActiveTab('directory')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === 'directory' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-400'}`}>Membros</button>
          <button onClick={() => setActiveTab('management')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === 'management' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-400'}`}>Gestão</button>
        </div>
      </div>

      {activeTab === 'directory' && (
        <MemberManager department="SHIESA" title="Diretório de Senhoras SHIESA" />
      )}

      {activeTab === 'management' && (
        <DeptManagement department="SHIESA" />
      )}
    </div>
  );
};

export default SHIESA;
