
import React, { useState } from 'react';
import { useAuth } from '../authContext';
import { User, UserRole, HistoryEntry } from '../types';
import { 
  Users, Search, Plus, X, ShieldCheck, Heart, 
  ChevronRight, Star, GraduationCap, Filter, UserPlus,
  Calendar, Phone, Info, Save, Trash2, History, Eye,
  MapPin, User as UserIcon, Award, BookOpen, Clock,
  MoreVertical, Edit2, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import MemberForm from './MemberForm';

interface MemberManagerProps {
  department?: string;
  title?: string;
}

const MemberManager: React.FC<MemberManagerProps> = ({ department, title = "Gestão de Membros" }) => {
  const { user, registeredUsers, registerMember, updateMember, deleteMember, filiais, theme } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState(department || 'all');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState<User | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<User | null>(null);

  const isAdmin = user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.SECRETARY;
  const isDeptLeader = user?.role === UserRole.LEADER;

  const filteredMembers = registeredUsers.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'all' ? true : m.department === deptFilter;
    const matchesArea = areaFilter === 'all' ? true : m.area === areaFilter;
    const matchesStatus = statusFilter === 'all' ? true : m.participation === statusFilter;
    
    // If it's a department-specific view, only show that department's members unless searching globally
    if (department && !searchTerm && m.department !== department) return false;
    
    return matchesSearch && matchesDept && matchesArea && matchesStatus;
  });

  const handleSaveMember = (memberData: any) => {
    if (editingMember) {
      updateMember(editingMember.id, memberData);
    } else {
      registerMember(memberData);
    }
    setShowAddModal(false);
    setEditingMember(null);
  };

  const handleDelete = (id: string) => {
    deleteMember(id);
    setShowDeleteConfirm(null);
  };

  const areas = ["Centro", "Alviário", "Kalongombe", "Rua 11", "Sicar", "Bereia"];

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-blue-600">{title}</h2>
          <p className="text-slate-500 font-medium">Controlo total de membros e histórico administrativo.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <button 
            onClick={() => { setEditingMember(null); setShowAddModal(true); }}
            className="flex-1 lg:flex-none bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-blue-700 transition-all"
          >
            <UserPlus size={16}/> Adicionar Novo Membro
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome..." 
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select 
            value={deptFilter} 
            onChange={e => setDeptFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-black text-[10px] uppercase outline-none"
          >
            <option value="all">Todos Departamentos</option>
            <option value="JIESA">JIESA</option>
            <option value="DCIESA">DCIESA</option>
            <option value="SHIESA">SHIESA</option>
            <option value="DEBOS">DEBOS</option>
            <option value="EVANGELIZAÇÃO">Evangelização</option>
          </select>

          <select 
            value={areaFilter} 
            onChange={e => setAreaFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-black text-[10px] uppercase outline-none"
          >
            <option value="all">Todas as Áreas</option>
            {areas.map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-black text-[10px] uppercase outline-none"
          >
            <option value="all">Todos os Estados</option>
            <option value="ACTIVO">Activo</option>
            <option value="PASSIVO">Passivo</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 dark:border-slate-800">
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Membro</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest hidden md:table-cell">Departamento</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest hidden lg:table-cell">Área</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Estado</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredMembers.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-black text-sm">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black uppercase text-xs dark:text-white">{m.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.filial}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500">
                      {m.department || 'Geral'}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                      <MapPin size={12} /> {m.area || 'Não def.'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      m.participation === 'ACTIVO' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {m.participation || 'ACTIVO'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setShowDetailsModal(m)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors" 
                        title="Ver Detalhes"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => setShowHistoryModal(m)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors" 
                        title="Ver Histórico"
                      >
                        <History size={18} />
                      </button>
                      {isAdmin && (
                        <>
                          <button 
                            onClick={() => { setEditingMember(m); setShowAddModal(true); }}
                            className="p-2 text-slate-400 hover:text-blue-600 transition-colors" 
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => setShowDeleteConfirm(m.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 transition-colors" 
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center opacity-20">
                    <div className="flex flex-col items-center gap-4">
                      <Users size={48} />
                      <p className="font-black uppercase tracking-widest text-xs">Nenhum membro encontrado</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-slate-950/60 backdrop-blur-md">
            <MemberForm 
              onSave={handleSaveMember}
              onCancel={() => { setShowAddModal(false); setEditingMember(null); }}
              initialData={editingMember || undefined}
            />
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-slate-950/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl p-10 rounded-[3.5rem] shadow-2xl space-y-8"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-[2rem] bg-blue-600 text-white flex items-center justify-center font-black text-4xl shadow-xl">
                    {showDetailsModal.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter dark:text-white">{showDetailsModal.name}</h3>
                    <div className="flex gap-2 mt-2">
                      <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                        {showDetailsModal.department || 'Geral'}
                      </span>
                      <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest">
                        {showDetailsModal.area || 'Sem Área'}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowDetailsModal(null)} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400">
                  <X size={24}/>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8 py-6 border-y border-slate-50 dark:border-slate-800">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Filiação</p>
                    <p className="font-bold text-sm dark:text-white">Pai: {showDetailsModal.fatherName || '---'}</p>
                    <p className="font-bold text-sm dark:text-white">Mãe: {showDetailsModal.motherName || '---'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Datas Importantes</p>
                    <p className="font-bold text-sm dark:text-white">Nasc: {showDetailsModal.birthDate || '---'}</p>
                    <p className="font-bold text-sm dark:text-white">Bapt: {showDetailsModal.baptismDate || '---'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Espiritual</p>
                    <p className="font-bold text-sm dark:text-white">Estado: {showDetailsModal.spiritualState || 'Membro'}</p>
                    <p className="font-bold text-sm dark:text-white">Dons: {showDetailsModal.dons || '---'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Contacto</p>
                    <p className="font-bold text-sm dark:text-white flex items-center gap-2"><Phone size={14}/> {showDetailsModal.phone || '---'}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => { setShowDetailsModal(null); setShowHistoryModal(showDetailsModal); }}
                  className="flex-1 bg-slate-900 text-white p-5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3"
                >
                  <History size={18}/> Ver Histórico Completo
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* History Modal */}
        {showHistoryModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-slate-950/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl p-10 rounded-[3.5rem] shadow-2xl space-y-8 max-h-[80vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter dark:text-white">Histórico Administrativo</h3>
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">{showHistoryModal.name}</p>
                </div>
                <button onClick={() => setShowHistoryModal(null)} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400">
                  <X size={24}/>
                </button>
              </div>

              <div className="space-y-6">
                {showHistoryModal.history && showHistoryModal.history.length > 0 ? (
                  showHistoryModal.history.map((entry, idx) => (
                    <div key={entry.id} className="relative pl-8 pb-6 border-l-2 border-slate-100 dark:border-slate-800 last:border-0">
                      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-white dark:border-slate-900 shadow-sm"></div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black uppercase text-slate-400">{new Date(entry.date).toLocaleDateString()}</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                            entry.type === 'TRANSITION' ? 'bg-amber-100 text-amber-600' : 
                            entry.type === 'REGISTRATION' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {entry.type}
                          </span>
                        </div>
                        <p className="font-bold text-sm dark:text-white">{entry.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center opacity-20">
                    <Clock size={48} className="mx-auto mb-4" />
                    <p className="font-black uppercase tracking-widest text-xs">Sem registos históricos</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] max-w-md w-full text-center space-y-6"
            >
              <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Confirmar Exclusão?</h3>
                <p className="text-slate-500 font-medium">Esta acção é irreversível e removerá todos os dados do membro do sistema.</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black uppercase text-[10px] tracking-widest">Cancelar</button>
                <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-rose-600/20">Eliminar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemberManager;
