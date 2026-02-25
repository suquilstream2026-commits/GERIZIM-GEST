
import React, { useState } from 'react';
import { useAuth } from '../authContext';
import { 
  Users, Plus, Search, Trash2, Edit2, X, Save, 
  User as UserIcon, Home, Phone, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Family } from '../types';

const FamilyManager: React.FC = () => {
  const { families, addFamily, updateFamily, removeFamily, registeredUsers, theme } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);

  const filteredFamilies = families.filter(f => 
    f.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const familyData = {
      familyName: fd.get('familyName') as string,
      headOfFamily: fd.get('headOfFamily') as string,
      members: (fd.get('members') as string).split(',').map(m => m.trim()),
      address: fd.get('address') as string,
      contact: fd.get('contact') as string,
      notes: fd.get('notes') as string
    };

    if (editingFamily) {
      updateFamily(editingFamily.id, familyData);
    } else {
      addFamily(familyData);
    }
    setShowModal(false);
    setEditingFamily(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar famílias..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
          />
        </div>
        <button 
          onClick={() => { setEditingFamily(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-xl hover:bg-blue-700 transition-all"
        >
          <Plus size={20} /> Nova Família
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredFamilies.map(f => (
          <div key={f.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-xl transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
              <button onClick={() => { setEditingFamily(f); setShowModal(true); }} className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl"><Edit2 size={16}/></button>
              <button onClick={() => removeFamily(f.id)} className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl"><Trash2 size={16}/></button>
            </div>
            
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Home size={32} />
            </div>
            
            <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white mb-2">{f.familyName}</h3>
            <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <UserIcon size={12} /> Chefe: {f.headOfFamily}
            </p>
            
            <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                <MapPin size={16} className="text-slate-300" /> {f.address}
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                <Phone size={16} className="text-slate-300" /> {f.contact}
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                <Users size={16} className="text-slate-300" /> {f.members.length} Membros registrados
              </div>
            </div>
          </div>
        ))}
        {filteredFamilies.length === 0 && (
          <div className="col-span-full py-32 text-center opacity-20">
            <Home size={64} className="mx-auto mb-6" />
            <p className="font-black uppercase tracking-widest text-sm">Nenhuma família encontrada</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl p-10 rounded-[3rem] shadow-2xl space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-black uppercase tracking-tighter dark:text-white">
                  {editingFamily ? 'Editar Família' : 'Nova Família'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400">
                  <X size={24}/>
                </button>
              </div>

              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome da Família</label>
                  <input name="familyName" defaultValue={editingFamily?.familyName} required className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Chefe de Família</label>
                  <input name="headOfFamily" defaultValue={editingFamily?.headOfFamily} required className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Membros (Separados por vírgula)</label>
                  <input name="members" defaultValue={editingFamily?.members.join(', ')} placeholder="Nome 1, Nome 2..." className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Endereço</label>
                  <input name="address" defaultValue={editingFamily?.address} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Contacto</label>
                  <input name="contact" defaultValue={editingFamily?.contact} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Observações</label>
                  <textarea name="notes" defaultValue={editingFamily?.notes} rows={3} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
                <button type="submit" className="md:col-span-2 w-full bg-blue-600 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg transition-all flex items-center justify-center gap-2">
                  <Save size={20}/> Salvar Família
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FamilyManager;
