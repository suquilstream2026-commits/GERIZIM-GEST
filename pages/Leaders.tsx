
import React from 'react';
import { useAuth } from '../authContext';
import { UserRole } from '../types';
import { ShieldCheck, User as UserIcon, Mail, Phone, MapPin, BadgeCheck, Star } from 'lucide-react';

const Leaders: React.FC = () => {
  const { theme, departments } = useAuth();

  // Mock de dados de líderes baseado nos departamentos existentes
  const leadersData = [
    { name: 'Pr. António Manuel', role: 'Pastor Presidente', dept: 'Conselho Geral', phone: '923 000 001', gender: 'M' },
    { name: 'Ir. Maria Luísa', role: 'Responsável', dept: 'SHIESA', phone: '923 000 002', gender: 'F' },
    { name: 'Dr. Pedro Afonso', role: 'Responsável', dept: 'DEBOS', phone: '923 000 003', gender: 'M' },
    { name: 'Ir. Samuel Jorge', role: 'Líder', dept: 'JIESA', phone: '923 000 004', gender: 'M' },
    { name: 'Ira. Rosa Bumba', role: 'Supervisora', dept: 'DCIESA', phone: '923 000 005', gender: 'F' },
    { name: 'Ir. Carlos Neto', role: 'Coordenador', dept: 'EVANGELIZAÇÃO', phone: '923 000 006', gender: 'M' },
  ];

  const getDeptColor = (deptName: string) => {
    const dept = departments.find(d => d.name === deptName);
    return dept ? dept.color : 'bg-slate-400';
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className={`text-4xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Corpo de Liderança</h2>
          <p className="text-slate-500 font-medium">Servos dedicados à organização e guia espiritual da nossa igreja.</p>
        </div>
        <div className="flex gap-2">
            <span className={`px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-2 ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>
                <Star size={14} className="text-amber-500 fill-amber-500"/> Gestão Central
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {leadersData.map((leader, i) => (
          <div key={i} className={`p-8 rounded-[3rem] border transition-all hover:shadow-2xl hover:-translate-y-2 group relative overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 opacity-10 rounded-full scale-150 ${getDeptColor(leader.dept)}`}></div>
            
            <div className="flex items-center gap-6 mb-8 relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 overflow-hidden border-2 border-white dark:border-slate-700 shadow-xl group-hover:scale-110 transition-transform">
                <UserIcon size={40} />
              </div>
              <div>
                <h3 className={`text-xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{leader.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                   <BadgeCheck size={14} className="text-blue-500"/>
                   <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">{leader.role}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-transparent'}`}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Departamento</p>
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${getDeptColor(leader.dept)}`}></div>
                   <p className={`font-black uppercase text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{leader.dept}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center gap-3 text-slate-500">
                  <Phone size={14} className="text-slate-300" />
                  <span className="text-xs font-bold">{leader.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Mail size={14} className="text-slate-300" />
                  <span className="text-xs font-bold">{leader.name.toLowerCase().replace(' ', '.')}@iesa.ao</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">Ver Biografia</button>
               <button className="p-2 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all">
                  <Mail size={16}/>
               </button>
            </div>
          </div>
        ))}
      </div>

      <div className={`p-10 rounded-[4rem] border flex flex-col md:flex-row items-center gap-10 text-center md:text-left ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
         <div className="p-8 bg-blue-600 text-white rounded-[3rem] shadow-2xl shadow-blue-600/30">
            <ShieldCheck size={48} />
         </div>
         <div className="flex-1 space-y-4">
            <h3 className={`text-2xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Conselho de Diáconos e Anciãos</h3>
            <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
              Este corpo consultivo trabalha em conjunto com a liderança executiva para garantir a integridade espiritual e administrativa de todas as filiais Gerizim em Angola.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
               {['Governance', 'Ethics', 'Spiritual Care', 'Support'].map(tag => (
                 <span key={tag} className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400">#{tag}</span>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Leaders;
