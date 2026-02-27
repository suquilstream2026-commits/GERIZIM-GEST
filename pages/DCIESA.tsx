
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
        <CBICManagement />
      )}
    </div>
  );
};

const CBICManagement: React.FC = () => {
  const { students, cbicContributions, addStudent, updateStudent, removeStudent, addCBICContribution, removeCBICContribution, theme } = useAuth();
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddContribution, setShowAddContribution] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [studentName, setStudentName] = useState('');

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName) return;
    addStudent({
      name: studentName,
      currentVolume: 1,
      grades: {
        vol1: { books: [] },
        vol2: { books: [] },
        vol3: { books: [] }
      }
    });
    setStudentName('');
    setShowAddStudent(false);
  };

  const handleAddContribution = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === selectedStudent);
    if (!student || !amount) return;
    addCBICContribution({
      studentId: student.id,
      studentName: student.name,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      month: new Date().toLocaleString('pt-BR', { month: 'long' })
    });
    setAmount('');
    setSelectedStudent('');
    setShowAddContribution(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Academia CBIC</h3>
        <div className="flex gap-3">
          <button onClick={() => setShowAddContribution(true)} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg">
            <Plus size={16} /> Contribuição
          </button>
          <button onClick={() => setShowAddStudent(true)} className="bg-rose-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg">
            <UserPlus size={16} /> Novo Aluno
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50 dark:border-slate-800">
                  <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Aluno</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Volume</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Acções</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id} className="border-b border-slate-50 dark:border-slate-800 last:border-none hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold dark:text-white">{student.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-600 text-[10px] font-black rounded-full uppercase">Volume {student.currentVolume}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => removeStudent(student.id)} className="p-2 text-slate-300 hover:text-rose-600 transition-colors">
                        <X size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-slate-400 font-bold uppercase text-xs">Nenhum aluno matriculado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Últimas Contribuições</h4>
            <div className="space-y-4">
              {cbicContributions.slice(0, 5).map(c => (
                <div key={c.id} className="flex justify-between items-center border-b border-slate-800 pb-3 last:border-none">
                  <div>
                    <p className="text-xs font-bold">{c.studentName}</p>
                    <p className="text-[9px] text-slate-500 uppercase">{c.month} - {c.date}</p>
                  </div>
                  <p className="text-sm font-black text-emerald-400">{c.amount.toLocaleString()} AOA</p>
                </div>
              ))}
              {cbicContributions.length === 0 && (
                <p className="text-center text-slate-600 text-[10px] font-black uppercase py-4">Sem registos</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAddStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-6 dark:text-white">Matricular Aluno</h3>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome do Aluno</label>
                <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none" placeholder="Nome completo..." />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-rose-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg">Confirmar</button>
                <button type="button" onClick={() => setShowAddStudent(false)} className="px-6 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black uppercase text-xs tracking-widest">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddContribution && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-6 dark:text-white">Registar Contribuição</h3>
            <form onSubmit={handleAddContribution} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Aluno</label>
                <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none">
                  <option value="">Seleccionar Aluno</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Valor (AOA)</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-emerald-600 text-lg outline-none" placeholder="0,00" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg">Registar</button>
                <button type="button" onClick={() => setShowAddContribution(false)} className="px-6 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black uppercase text-xs tracking-widest">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DCIESA;
