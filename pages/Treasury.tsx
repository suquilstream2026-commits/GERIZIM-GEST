
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../authContext';
import { Transaction, UserRole, TransactionCategory } from '../types';
import { GoogleGenAI } from "@google/genai";
import { 
  Wallet, Plus, Search, X, Clock, Save, ArrowUpCircle, ArrowDownCircle, 
  Mic, Square, Sparkles, Filter, Calendar, ListFilter, Edit2
} from 'lucide-react';

const Treasury: React.FC = () => {
  const { user, addNotification, theme, registeredUsers } = useAuth();
  const [activeTab, setActiveTab] = useState<'flow' | 'insert' | 'tithes'>('flow');
  const [transactions, setTransactions] = useState<Transaction[]>(() => JSON.parse(localStorage.getItem('iesa_transactions') || '[]'));

  // Estados de Filtro
  const [filterMemberId, setFilterMemberId] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [formData, setFormData] = useState({
    amount: '',
    category: TransactionCategory.TITHE,
    memberName: '',
    memberId: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    area: ''
  });

  useEffect(() => { localStorage.setItem('iesa_transactions', JSON.stringify(transactions)); }, [transactions]);

  const canManageFlow = [UserRole.SUPER_ADMIN, UserRole.TREASURER, UserRole.SECRETARY].includes(user?.role as UserRole);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribe(audioBlob);
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) { console.error(e); }
  };

  const stopRecording = () => { if (mediaRecorderRef.current && isRecording) { mediaRecorderRef.current.stop(); setIsRecording(false); } };

  const transcribe = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [{ parts: [{ inlineData: { data: base64, mimeType: 'audio/webm' } }, { text: "Transcreva este áudio curto para uma descrição de transação financeira de igreja em português." }] }]
        });
        setFormData(prev => ({ ...prev, description: prev.description + (prev.description ? " " : "") + response.text }));
      };
    } finally { setIsTranscribing(false); }
  };

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (tx: Transaction) => {
    setFormData({
      amount: tx.amount.toString(),
      category: tx.category,
      memberName: tx.memberName || '',
      memberId: tx.memberId || '',
      description: tx.description,
      date: tx.date,
      time: tx.time
    });
    setEditingId(tx.id);
    setActiveTab('insert');
  };

  const handleSave = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) return;
    
    if (editingId) {
      setTransactions(prev => prev.map(t => t.id === editingId ? {
        ...t,
        date: formData.date,
        time: formData.time,
        description: formData.description,
        amount: parseFloat(formData.amount),
        type: formData.category === TransactionCategory.EXPENSE ? 'SAI_SAIDA' : 'ENT_ENTRADA',
        category: formData.category,
        memberName: formData.memberName,
        memberId: formData.memberId
      } : t));
      addNotification(`Tesouraria: Actualizado ${formData.category} - ${formData.amount} AOA`, user?.name || 'Operador');
      setEditingId(null);
    } else {
      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        date: formData.date,
        time: formData.time,
        description: formData.description || `${formData.category} - ${formData.memberName || 'Geral'}`,
        amount: parseFloat(formData.amount),
        type: formData.category === TransactionCategory.EXPENSE ? 'SAI_SAIDA' : 'ENT_ENTRADA',
        category: formData.category,
        memberName: formData.memberName,
        memberId: formData.memberId
      };
      setTransactions([newTx, ...transactions]);
      addNotification(`Tesouraria: Registado ${formData.category} - ${formData.amount} AOA`, user?.name || 'Operador');
    }
    setActiveTab('flow');
    setFormData({ amount: '', category: TransactionCategory.TITHE, memberName: '', memberId: '', description: '', date: new Date().toISOString().split('T')[0], time: new Date().toTimeString().slice(0, 5), area: '' });
  };

  // Lógica de filtragem unificada
  const applyFilters = (txs: Transaction[]) => {
    return txs.filter(tx => {
      const matchMember = filterMemberId ? tx.memberId === filterMemberId : true;
      const matchStart = filterStartDate ? tx.date >= filterStartDate : true;
      const matchEnd = filterEndDate ? tx.date <= filterEndDate : true;
      const matchCat = filterCategory === 'ALL' ? true : tx.category === filterCategory;
      const isPrivate = user?.role === UserRole.MEMBER ? tx.memberName === user.name : true;
      return matchMember && matchStart && matchEnd && matchCat && isPrivate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const currentTxs = applyFilters(transactions);
  const totalIn = currentTxs.filter(t => t.type === 'ENT_ENTRADA').reduce((acc, t) => acc + t.amount, 0);
  const totalOut = currentTxs.filter(t => t.type === 'SAI_SAIDA').reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6 animate-reveal pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-red-600">Tesouraria IESA</h2>
          <p className="text-slate-500 font-medium">Gestão transparente do Reino de Deus.</p>
        </div>
        {canManageFlow && (
          <button onClick={() => setActiveTab('insert')} className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-xl hover:bg-red-700 transition-all">
            <Plus size={20} /> Novo Lançamento
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-8 rounded-[2.5rem] border shadow-xl ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-white'}`}>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Entradas (Filtro)</p>
          <h3 className="text-3xl font-black text-emerald-500">{totalIn.toLocaleString()} AOA</h3>
        </div>
        <div className={`p-8 rounded-[2.5rem] border shadow-xl ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-white'}`}>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Saídas (Filtro)</p>
          <h3 className="text-3xl font-black text-rose-500">{totalOut.toLocaleString()} AOA</h3>
        </div>
        <div className={`p-8 rounded-[2.5rem] border shadow-xl bg-slate-900 text-white`}>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Saldo Geral</p>
          <h3 className="text-3xl font-black text-white">{(totalIn - totalOut).toLocaleString()} AOA</h3>
        </div>
      </div>

      <div className="flex p-1.5 rounded-2xl border bg-white border-slate-100 shadow-sm overflow-x-auto">
        <button onClick={() => setActiveTab('flow')} className={`flex-1 py-3 px-6 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeTab === 'flow' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400'}`}>Movimentações</button>
        <button onClick={() => setActiveTab('tithes')} className={`flex-1 py-3 px-6 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeTab === 'tithes' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400'}`}>Dízimos e Fundos</button>
        {canManageFlow && <button onClick={() => setActiveTab('insert')} className={`flex-1 py-3 px-6 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeTab === 'insert' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>Registo Direto</button>}
      </div>

      {activeTab !== 'insert' && (
        <div className={`p-6 rounded-[2rem] border animate-in fade-in duration-300 ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
          <div className="flex items-center gap-3 mb-6">
             <Filter size={18} className="text-red-600" />
             <h4 className="text-[11px] font-black uppercase tracking-widest dark:text-white">Painel de Consultas Personalizado</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
               <label className="text-[9px] font-black uppercase text-slate-400 ml-1">De:</label>
               <input type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} className="w-full p-3 rounded-xl border-none font-bold text-xs outline-none bg-white dark:bg-slate-800 dark:text-white" />
            </div>
            <div className="space-y-1">
               <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Até:</label>
               <input type="date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} className="w-full p-3 rounded-xl border-none font-bold text-xs outline-none bg-white dark:bg-slate-800 dark:text-white" />
            </div>
            <div className="space-y-1">
               <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Categoria:</label>
               <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="w-full p-3 rounded-xl border-none font-bold text-xs outline-none bg-white dark:bg-slate-800 dark:text-white">
                  <option value="ALL">Todas as Categorias</option>
                  <option value={TransactionCategory.TITHE}>Dízimos</option>
                  <option value={TransactionCategory.OFFERING}>Ofertas Gerais</option>
                  <option value={TransactionCategory.MISSIONARY}>Fundo Missionário</option>
                  <option value={TransactionCategory.EXPENSE}>Despesas</option>
               </select>
            </div>
            <div className="flex items-end">
               <button onClick={() => { setFilterStartDate(''); setFilterEndDate(''); setFilterCategory('ALL'); setFilterMemberId(''); }} className="w-full p-3 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-300 transition-all">Limpar Filtros</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'flow' && (
        <div className="space-y-3 animate-in fade-in duration-500">
          {currentTxs.map(t => (
            <div key={t.id} className="flex items-center justify-between p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all group">
               <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${t.type === 'ENT_ENTRADA' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {t.type === 'ENT_ENTRADA' ? <ArrowUpCircle size={20}/> : <ArrowDownCircle size={20}/>}
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase dark:text-white">{t.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[9px] font-bold text-slate-400 uppercase">{t.date}</span>
                       <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 text-[8px] font-black uppercase rounded">{t.category}</span>
                    </div>
                  </div>
               </div>
                <div className="flex items-center gap-4">
                   <p className={`text-lg font-black ${t.type === 'ENT_ENTRADA' ? 'text-emerald-600' : 'text-rose-500'}`}>{t.amount.toLocaleString()} AOA</p>
                   {canManageFlow && (
                     <button 
                       onClick={() => handleEdit(t)}
                       className="p-2 text-slate-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                     >
                        <Edit2 size={16} />
                     </button>
                   )}
                </div>
            </div>
          ))}
          {currentTxs.length === 0 && (
             <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4 uppercase font-black text-xs">
                <Search size={48} /> Nenhuma movimentação no período
             </div>
          )}
        </div>
      )}

      {activeTab === 'insert' && (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl max-w-2xl mx-auto animate-reveal">
           <div className="mb-8 flex items-center gap-3">
              <Plus size={24} className="text-red-600" />
              <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Lançamento Tesouraria</h3>
           </div>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Área do Membro (Filtro)</label>
                  <select 
                    value={formData.area} 
                    onChange={e => setFormData({...formData, area: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none"
                  >
                    <option value="">Todas as Áreas</option>
                    {[...new Set(registeredUsers.map(u => u.area).filter(Boolean))].map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Membro *</label>
                  <select 
                    value={formData.memberId} 
                    onChange={e => {
                      const m = registeredUsers.find(u => u.id === e.target.value);
                      setFormData({...formData, memberId: e.target.value, memberName: m?.name || ''});
                    }}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none"
                  >
                    <option value="">Seleccionar Membro</option>
                    {registeredUsers
                      .filter(u => !formData.area || u.area === formData.area)
                      .map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))
                    }
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Categoria *</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as TransactionCategory})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none">
                    <option value={TransactionCategory.TITHE}>Dízimo</option>
                    <option value={TransactionCategory.OFFERING}>Oferta Geral</option>
                    <option value={TransactionCategory.CONSTRUCTION}>Oferta Construção</option>
                    <option value={TransactionCategory.MISSIONARY}>Fundo Missionário</option>
                    <option value={TransactionCategory.EXPENSE}>Despesa</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Valor (AOA) *</label>
                  <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-emerald-600 text-lg outline-none" placeholder="0,00" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                   <label className="text-[10px] font-black uppercase text-slate-400">Descrição / Nota de Voz</label>
                   <div className="flex items-center gap-2">
                      {isTranscribing && <div className="flex items-center gap-2 text-[8px] font-black uppercase text-red-600 animate-pulse"><Sparkles size={12}/> Transcrevendo...</div>}
                      <button type="button" onMouseDown={startRecording} onMouseUp={stopRecording} onMouseLeave={stopRecording} className={`p-2 rounded-full transition-all ${isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-600'}`}>
                         {isRecording ? <Square size={14}/> : <Mic size={14}/>}
                      </button>
                   </div>
                </div>
                <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none" placeholder="Detalhes do lançamento..." />
              </div>

              <button onClick={handleSave} type="button" className="w-full bg-red-600 text-white p-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-red-700 shadow-xl flex items-center justify-center gap-3">
                <Save size={20} /> Finalizar Registo Financeiro
              </button>
           </form>
        </div>
      )}
    </div>
  );
};

export default Treasury;
