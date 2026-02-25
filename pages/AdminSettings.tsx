
import React, { useState, useRef } from 'react';
import { useAuth } from '../authContext';
import { 
  Shield, UserPlus, Trash2, ShieldCheck, CheckCircle, 
  Search, X, Save, ShieldAlert, Users, Plus, Key,
  Settings, Image as ImageIcon, Music, Type, Wand2, Upload, FileImage,
  UserCheck
} from 'lucide-react';
import { UserRole } from '../types';

const AdminSettings: React.FC = () => {
  const { 
    theme, user, registeredUsers, churchCouncil, addCouncilMember, 
    removeCouncilMember, appLogo, appName, coverImage, updateAppIdentity,
    songs, removeSong, registerMember, filiais
  } = useAuth();
  
  const [councilSearch, setCouncilSearch] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  
  // Estados para Branding
  const [editName, setEditName] = useState(appName);
  const [editLogo, setEditLogo] = useState(appLogo);
  const [editCover, setEditCover] = useState(coverImage);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'logo') setEditLogo(base64String);
        else setEditCover(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    updateAppIdentity(editName, editLogo, editCover);
  };

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    registerMember({
      name: fd.get('name') as string,
      role: fd.get('role') as UserRole,
      filial: fd.get('filial') as string,
      department: fd.get('department') as string
    });
    setShowAddUserModal(false);
  };

  if (user?.role !== UserRole.SUPER_ADMIN) {
    return <div className="p-20 text-center uppercase font-black opacity-20">Acesso Restrito</div>;
  }

  return (
    <div className="space-y-12 animate-reveal pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-red-600 text-white rounded-3xl shadow-xl"><Shield size={32}/></div>
          <div>
             <h2 className="text-3xl font-black uppercase tracking-tighter dark:text-white">Painel de Controlo Superior</h2>
             <p className="text-slate-500 font-medium">Gestão de segurança, identidade e recursos globais.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddUserModal(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 shadow-xl hover:bg-red-600 transition-all"
        >
          <UserPlus size={18}/> Novo Utilizador do Sistema
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Identidade Visual */}
        <div className="xl:col-span-2 space-y-8">
           <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 space-y-8">
              <div className="flex items-center gap-3">
                 <Wand2 size={24} className="text-red-500" />
                 <h3 className="text-xl font-black uppercase tracking-tighter dark:text-white">Identidade da Aplicação</h3>
              </div>
              
              <form onSubmit={handleSaveIdentity} className="space-y-8">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome do Portal *</label>
                    <div className="relative">
                      <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-red-500" />
                      <Type size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Upload de Logo */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Logótipo da Igreja</label>
                        <div className="flex flex-col items-center gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <div className="w-24 h-24 bg-white rounded-2xl p-2 shadow-sm flex items-center justify-center overflow-hidden">
                                <img src={editLogo} alt="Preview Logo" className="max-w-full max-h-full object-contain" />
                            </div>
                            <input 
                                type="file" 
                                ref={logoInputRef} 
                                onChange={(e) => handleFileChange(e, 'logo')} 
                                className="hidden" 
                                accept="image/*"
                            />
                            <button 
                                type="button" 
                                onClick={() => logoInputRef.current?.click()}
                                className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                            >
                                <Upload size={14}/> Carregar do Dispositivo
                            </button>
                        </div>
                    </div>

                    {/* Upload de Capa */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Imagem de Capa (Hero)</label>
                        <div className="flex flex-col items-center gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <div className="w-full h-24 bg-slate-200 dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
                                <img src={editCover} alt="Preview Cover" className="w-full h-full object-cover" />
                            </div>
                            <input 
                                type="file" 
                                ref={coverInputRef} 
                                onChange={(e) => handleFileChange(e, 'cover')} 
                                className="hidden" 
                                accept="image/*"
                            />
                            <button 
                                type="button" 
                                onClick={() => coverInputRef.current?.click()}
                                className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                            >
                                <Upload size={14}/> Carregar do Dispositivo
                            </button>
                        </div>
                    </div>
                 </div>
                 
                 <div className="pt-4">
                    <button type="submit" className="w-full bg-red-600 text-white p-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-red-700 shadow-xl transition-all flex items-center justify-center gap-3">
                       <Save size={20}/> Guardar Identidade Visual
                    </button>
                 </div>
              </form>
           </div>

           {/* Gestão de Hinos na Admin */}
           <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 space-y-8">
              <div className="flex items-center gap-3">
                 <Music size={24} className="text-blue-500" />
                 <h3 className="text-xl font-black uppercase tracking-tighter dark:text-white">Biblioteca Musical Corporativa</h3>
              </div>
              
              <div className="max-h-96 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                 {songs.map(song => (
                   <div key={song.id} className="p-5 flex justify-between items-center bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] group border border-transparent hover:border-blue-200 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                            <Music size={20}/>
                         </div>
                         <div>
                            <p className="text-sm font-black uppercase dark:text-white leading-none">{song.title}</p>
                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{song.author}</p>
                         </div>
                      </div>
                      <button onClick={() => removeSong(song.id)} className="p-3 text-slate-300 hover:text-red-500 transition-all">
                         <Trash2 size={18}/>
                      </button>
                   </div>
                 ))}
                 {songs.length === 0 && (
                    <div className="py-10 text-center opacity-30 italic text-sm">Nenhum hino na biblioteca central.</div>
                 )}
              </div>
           </div>
        </div>

        {/* Gestão do Conselho & Status */}
        <div className="space-y-8">
           <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black uppercase tracking-tighter dark:text-white flex items-center gap-3">
                    <ShieldCheck size={24} className="text-blue-600" /> Conselho Superior
                 </h3>
              </div>

              <div className="space-y-4">
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" value={councilSearch} onChange={e => setCouncilSearch(e.target.value)}
                      placeholder="Nome para adicionar..."
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-xs outline-none"
                    />
                 </div>

                 <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                    {registeredUsers.filter(u => u.name.toLowerCase().includes(councilSearch.toLowerCase())).slice(0, 5).map(m => (
                      <button 
                        key={m.id} 
                        onClick={() => addCouncilMember({ id: m.id, name: m.name, registrationDate: '', participation: 'ACTIVO', birthDate: '' })}
                        className="w-full p-4 flex justify-between items-center bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white rounded-2xl transition-all"
                      >
                        <span className="text-[10px] font-black uppercase">{m.name}</span>
                        <Plus size={16}/>
                      </button>
                    ))}
                 </div>
              </div>

              <div className="pt-6 border-t border-slate-50 dark:border-slate-800 space-y-4">
                 <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Integrantes do Conselho</h4>
                 <div className="space-y-3">
                    {churchCouncil.map(m => (
                      <div key={m.id} className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                         <span className="text-[10px] font-black uppercase text-blue-700 dark:text-blue-400">{m.name}</span>
                         <button onClick={() => removeCouncilMember(m.id)} className="text-red-500 hover:scale-110 transition-transform"><Trash2 size={16}/></button>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
              <ShieldCheck className="absolute -bottom-10 -right-10 w-48 h-48 opacity-5" />
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-red-600 rounded-2xl"><ShieldAlert size={24}/></div>
                 <h3 className="text-xl font-black uppercase tracking-tighter">Estado do Sistema</h3>
              </div>
              <div className="space-y-4">
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex justify-between items-center">
                    <div>
                       <p className="text-[10px] font-black uppercase text-slate-500">Utilizadores</p>
                       <p className="text-2xl font-black">{registeredUsers.length}</p>
                    </div>
                    <Users size={32} className="opacity-20"/>
                 </div>
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex justify-between items-center">
                    <div>
                       <p className="text-[10px] font-black uppercase text-slate-500">Membros de Conselho</p>
                       <p className="text-2xl font-black">{churchCouncil.length}</p>
                    </div>
                    <ShieldCheck size={32} className="opacity-20"/>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {showAddUserModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl p-10 rounded-[3.5rem] shadow-2xl space-y-8 animate-reveal">
             <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-6">
               <div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter dark:text-white">Criar Utilizador</h3>
                  <p className="text-xs font-bold text-red-500 uppercase tracking-widest mt-1">Atribuição de Acessos Administrativos</p>
               </div>
               <button onClick={() => setShowAddUserModal(false)} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:text-rose-500 transition-all">
                  <X size={24}/>
               </button>
             </div>
             
             <form onSubmit={handleAddUser} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome de Exibição *</label>
                    <input name="name" required placeholder="Nome do utilizador" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-red-500" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nível de Acesso *</label>
                    <select name="role" required className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-red-500">
                       <option value={UserRole.MEMBER}>Membro Comum</option>
                       <option value={UserRole.SECRETARY}>Secretário</option>
                       <option value={UserRole.TREASURER}>Tesoureiro</option>
                       <option value={UserRole.LEADER}>Responsável de Dept.</option>
                       <option value={UserRole.ASSISTANT}>Assistente</option>
                       <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Filial *</label>
                    <select name="filial" required className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-red-500">
                       {filiais.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Departamento Associado</label>
                    <select name="department" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-red-500">
                       <option value="GERAL">Geral</option>
                       <option value="JIESA">JIESA</option>
                       <option value="DCIESA">DCIESA</option>
                       <option value="SHIESA">SHIESA</option>
                       <option value="DEBOS">DEBOS</option>
                    </select>
                  </div>
                </div>

                <p className="text-[9px] font-bold text-slate-400 uppercase italic">
                  Nota: Após a criação, o sistema gerará um código de acesso único (IESA-XXXX) que servirá como senha inicial.
                </p>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-slate-900 text-white p-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-red-600 shadow-xl transition-all flex items-center justify-center gap-3">
                    <Save size={20}/> Criar Utilizador e Gerar Código
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
