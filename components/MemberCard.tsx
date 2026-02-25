
import React, { useState } from 'react';
import { useAuth } from '../authContext';
import { Member, UserRole } from '../types';
import { 
  X, Save, Edit2, Camera, ShieldCheck, 
  Calendar, User as UserIcon, Heart, MapPin, 
  Phone, Info, GraduationCap, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MemberCardProps {
  member: Member;
  onClose: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onClose }) => {
  const { user, updateMember, theme } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState(member);

  const canEdit = user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.SECRETARY;

  const handleSave = () => {
    updateMember(member.id, editedMember);
    setIsEditing(false);
  };

  const statusColors = {
    'Catecúmeno': 'bg-amber-100 text-amber-600',
    'Baptizado': 'bg-emerald-100 text-emerald-600',
    'Ouviente': 'bg-slate-100 text-slate-600'
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[4rem] shadow-2xl overflow-hidden relative"
      >
        <button onClick={onClose} className="absolute top-8 right-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-rose-500 transition-all z-10">
          <X size={24}/>
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Side: Visual Card */}
          <div className="lg:w-2/5 bg-gradient-to-br from-blue-600 to-indigo-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full -ml-32 -mb-32 blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 bg-white rounded-xl p-2">
                  <ShieldCheck className="text-blue-600 w-full h-full" />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-lg tracking-tighter leading-none">IESA GERIZIM</span>
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-60">Cartão de Membro Oficial</span>
                </div>
              </div>

              <div className="space-y-8">
                <div className="relative group w-48 h-48 mx-auto">
                  <div className="w-full h-full rounded-[3rem] bg-white/10 border-4 border-white/20 overflow-hidden shadow-2xl">
                    {editedMember.photo ? (
                      <img src={editedMember.photo} alt={editedMember.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UserIcon size={64} className="opacity-20" />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 p-3 bg-white text-blue-600 rounded-2xl shadow-xl">
                      <Camera size={20} />
                    </button>
                  )}
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-black uppercase tracking-tighter leading-tight">{editedMember.name}</h3>
                  <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">
                    {editedMember.roleInDept || editedMember.role}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-12 border-t border-white/10 flex justify-between items-end">
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest opacity-50 mb-1">ID do Membro</p>
                <p className="font-mono text-sm font-bold">#{editedMember.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black uppercase tracking-widest opacity-50 mb-1">Validade</p>
                <p className="font-bold text-sm">DEZ 2027</p>
              </div>
            </div>
          </div>

          {/* Right Side: Details & Editing */}
          <div className="lg:w-3/5 p-12 lg:p-16 overflow-y-auto max-h-[80vh] no-scrollbar space-y-10">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Dados do Registo</h4>
                <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">Informações Oficiais da Secretaria</p>
              </div>
              {canEdit && !isEditing && (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                  <Edit2 size={14} /> Editar Dados
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <DetailItem label="Filiação (Pai)" value={editedMember.fatherName} icon={UserIcon} isEditing={isEditing} onChange={v => setEditedMember({...editedMember, fatherName: v})} />
                <DetailItem label="Filiação (Mãe)" value={editedMember.motherName} icon={UserIcon} isEditing={isEditing} onChange={v => setEditedMember({...editedMember, motherName: v})} />
                <DetailItem label="Data de Nascimento" value={editedMember.birthDate} icon={Calendar} type="date" isEditing={isEditing} onChange={v => setEditedMember({...editedMember, birthDate: v})} />
              </div>
              <div className="space-y-6">
                <DetailItem label="Data de Baptismo" value={editedMember.baptismDate} icon={GraduationCap} type="date" isEditing={isEditing} onChange={v => setEditedMember({...editedMember, baptismDate: v})} />
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Estado Eclesiástico</label>
                  {isEditing ? (
                    <select 
                      value={editedMember.spiritualState || 'Ouviente'} 
                      onChange={e => setEditedMember({...editedMember, spiritualState: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold outline-none border-none dark:text-white"
                    >
                      <option value="Catecúmeno">Catecúmeno</option>
                      <option value="Baptizado">Baptizado</option>
                      <option value="Ouviente">Ouviente</option>
                    </select>
                  ) : (
                    <div className={`px-4 py-2 rounded-xl font-black uppercase text-[10px] w-fit ${statusColors[editedMember.spiritualState as keyof typeof statusColors] || 'bg-slate-100 text-slate-600'}`}>
                      {editedMember.spiritualState || 'Ouviente'}
                    </div>
                  )}
                </div>
                <DetailItem label="Contacto" value={editedMember.phone} icon={Phone} isEditing={isEditing} onChange={v => setEditedMember({...editedMember, phone: v})} />
              </div>
            </div>

            <div className="pt-10 border-t border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="flex-1 bg-blue-600 text-white p-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                    <Save size={20}/> Salvar Alterações
                  </button>
                  <button onClick={() => { setIsEditing(false); setEditedMember(member); }} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-500 p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                    Cancelar
                  </button>
                </>
              ) : (
                <button className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                  <Download size={20}/> Descarregar Cartão Digital (PDF)
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value?: string; icon: any; type?: string; isEditing: boolean; onChange: (v: string) => void }> = ({ label, value, icon: Icon, type = "text", isEditing, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{label}</label>
    {isEditing ? (
      <div className="relative">
        <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type={type} 
          value={value || ''} 
          onChange={e => onChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold outline-none border-none dark:text-white" 
        />
      </div>
    ) : (
      <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
        <Icon size={18} className="text-slate-300" />
        {value || 'Não informado'}
      </div>
    )}
  </div>
);

export default MemberCard;
