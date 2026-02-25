
import React, { useState } from 'react';
import { useAuth } from '../authContext';
import { UserRole, ChurchEvent } from '../types';
import { 
  Calendar, 
  Plus, 
  MapPin, 
  Clock, 
  Trash2, 
  X, 
  Save, 
  Search,
  Bell,
  CheckCircle2,
  Info,
  CalendarDays,
  Lock
} from 'lucide-react';

const Events: React.FC = () => {
  const { user, events, departments, addEvent, removeEvent, theme, addNotification, activityTypes } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: activityTypes[0] || 'Evento Geral', 
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    location: '',
    department: '',
    description: '', 
  });

  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
  const isAdmin = user?.role === UserRole.ADMIN;
  const isSecretary = user?.role === UserRole.SECRETARY;
  const isDeptLeader = user?.role === UserRole.LEADER;
  
  const canManageGeneral = isSuperAdmin || isAdmin || isSecretary;
  const canManageDept = isDeptLeader && user?.department;
  const canCreate = canManageGeneral || canManageDept;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvent.title && newEvent.date && newEvent.location) {
      
      // Se for líder, força o departamento dele no evento
      const targetDept = isDeptLeader ? user?.department : newEvent.department;

      addEvent({
        ...newEvent,
        department: targetDept,
        title: `${newEvent.type}: ${newEvent.title}`
      });
      addNotification(`Nova Actividade Anunciada: ${newEvent.type}`, user?.name || 'Administração');
      setShowAddModal(false);
      setNewEvent({ title: '', type: activityTypes[0] || 'Evento Geral', date: new Date().toISOString().split('T')[0], time: '09:00', location: '', department: '', description: '' });
    }
  };

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         e.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Se for líder, talvez queira focar nas suas atividades primeiro, 
    // mas a agenda geralmente é pública. Mantemos a visualização total mas restringimos a edição.
    return matchesSearch;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Função para verificar se o utilizador pode apagar este evento específico
  const canDeleteEvent = (event: ChurchEvent) => {
    if (isSuperAdmin || isAdmin || isSecretary) return true;
    if (isDeptLeader && event.department === user?.department) return true;
    return false;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className={`text-4xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Agenda & Anúncios</h2>
          <p className="text-slate-500 font-medium">
            {isDeptLeader ? `Gestão de Atividades - ${user?.department}` : 'Programação oficial da Igreja IESA.'}
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar agenda..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-2xl border outline-none font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 shadow-sm'}`}
            />
          </div>
          {canCreate && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-slate-950 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl hover:bg-blue-600 transition-all shrink-0"
            >
              <Bell size={20} /> <span className="hidden sm:inline">Anunciar Actividade</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => (
          <div key={event.id} className={`group p-8 rounded-[3rem] border transition-all hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-6">
               <div className="bg-blue-600 text-white p-4 rounded-3xl shadow-lg shadow-blue-600/20">
                  <CalendarDays size={28} />
               </div>
               {canDeleteEvent(event) && (
                 <button onClick={() => removeEvent(event.id)} className="p-2 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} />
                 </button>
               )}
            </div>

            <div className="space-y-3">
              <h3 className={`text-xl font-black uppercase tracking-tight leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{event.title}</h3>
              <div className="flex items-center gap-2">
                 <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${event.department === user?.department ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {event.department || 'Geral'}
                 </span>
              </div>
              {event.description && (
                <div className="flex items-start gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 mt-4">
                  <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className={`text-[11px] font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{event.description}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4 pt-8 mt-8 border-t border-slate-50 dark:border-slate-800">
               <div className="flex items-center gap-3 text-slate-500">
                  <Clock size={18} className="text-blue-500" />
                  <span className="text-xs font-black uppercase tracking-widest">{new Date(event.date).toLocaleDateString('pt')} às {event.time}</span>
               </div>
               <div className="flex items-center gap-3 text-slate-500">
                  <MapPin size={18} className="text-blue-500" />
                  <span className="text-xs font-black uppercase tracking-widest">{event.location}</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className={`w-full max-w-xl rounded-[3rem] shadow-2xl border overflow-hidden animate-in zoom-in-95 duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-white'}`}>
              <form onSubmit={handleAdd} className="p-8 md:p-12 space-y-8">
                 <div className="flex justify-between items-center">
                    <div>
                      <h3 className={`text-3xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Anunciar Actividade</h3>
                      {isDeptLeader && <p className="text-blue-500 font-black uppercase text-[10px] mt-1 tracking-widest">Publicação para {user?.department}</p>}
                    </div>
                    <button type="button" onClick={() => setShowAddModal(false)} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:bg-slate-100 transition-all">
                       <X size={24} />
                    </button>
                 </div>

                 <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tipo de Actividade *</label>
                         <select 
                           value={newEvent.type}
                           onChange={e => setNewEvent({...newEvent, type: e.target.value})}
                           className={`w-full p-4 rounded-2xl border font-black outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`}
                         >
                           {activityTypes.map(type => <option key={type} value={type}>{type}</option>)}
                         </select>
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Assunto / Tema *</label>
                         <input 
                           type="text" required value={newEvent.title}
                           onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                           className={`w-full p-4 rounded-2xl border font-bold outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`}
                           placeholder="Ex: Adoração"
                         />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Data *</label>
                         <input type="date" required value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className={`w-full p-4 rounded-2xl border font-bold outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Horário *</label>
                         <input type="time" required value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} className={`w-full p-4 rounded-2xl border font-bold outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} />
                      </div>
                    </div>

                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Localização *</label>
                       <input type="text" required value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className={`w-full p-4 rounded-2xl border font-bold outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} />
                    </div>

                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Departamento Responsável</label>
                       {isDeptLeader ? (
                         <div className="relative">
                           <input 
                             disabled 
                             value={user?.department || 'Geral'} 
                             className="w-full p-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-blue-600 dark:text-blue-400 outline-none" 
                           />
                           <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                         </div>
                       ) : (
                         <select 
                           value={newEvent.department}
                           onChange={e => setNewEvent({...newEvent, department: e.target.value})}
                           className={`w-full p-4 rounded-2xl border font-bold outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`}
                         >
                           <option value="">Geral / Igreja Toda</option>
                           <option value="JIESA">JIESA</option>
                           <option value="DCIESA">DCIESA</option>
                           <option value="SHIESA">SHIESA</option>
                           <option value="DEBOS">DEBOS</option>
                           <option value="EVANGELIZAÇÃO">Evangelização</option>
                         </select>
                       )}
                    </div>
                 </div>

                 <div className="pt-6">
                    <button type="submit" className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 shadow-2xl transition-all flex items-center justify-center gap-3">
                      <Save size={20} /> Publicar Actividade
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Events;
