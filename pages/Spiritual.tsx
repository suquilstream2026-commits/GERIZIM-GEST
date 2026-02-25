
import React, { useEffect, useState } from 'react';
import { useAuth } from '../authContext';
import { getDailySpiritualContent } from '../geminiService';
import { PRAYERS } from '../constants';
import { BookOpen, Heart, Quote, Calendar, Save, Trash2, CheckCircle, Circle, Plus, Notebook, Sparkles } from 'lucide-react';

const Spiritual: React.FC = () => {
  const { theme, prayerIntentions, spiritualNotes, addPrayer, togglePrayer, removePrayer, saveSpiritualNote } = useAuth();
  const [reflection, setReflection] = useState<string>('');
  const [verse, setVerse] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  const [newPrayer, setNewPrayer] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const todayNote = spiritualNotes.find(n => n.date === today);

  useEffect(() => {
    async function fetchContent() {
      const content = await getDailySpiritualContent();
      const parts = content.split('\n\n');
      setVerse(parts[0] || 'Reflexão Diária IESA');
      setReflection(parts.slice(1).join('\n\n') || content);
      setLoading(false);
    }
    fetchContent();
  }, []);

  useEffect(() => {
    if (todayNote) setNoteContent(todayNote.content);
  }, [todayNote]);

  const handleAddPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayer.trim()) return;
    addPrayer(newPrayer);
    setNewPrayer('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-reveal pb-20">
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 bg-rose-600 rounded-[2rem] text-white shadow-2xl mb-2">
            <BookOpen size={40} />
        </div>
        <h2 className={`text-5xl font-black uppercase tracking-tighter dark:text-white`}>Espiritualidade IESA</h2>
        <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.4em]">Gerizim - Alimentando o Espírito, Fortalecendo a Fé</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* Reflexão Diária */}
        <div className="xl:col-span-2 space-y-8">
           <div className={`rounded-[3.5rem] shadow-2xl border overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <div className="bg-gradient-to-br from-rose-700 to-rose-900 p-10 text-white relative overflow-hidden">
                  <Quote className="absolute -top-6 -left-6 w-40 h-40 text-white/10 rotate-12" />
                  <div className="relative z-10 space-y-4">
                      <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">Pão do Dia</span>
                      <h3 className="text-3xl font-black uppercase tracking-tight leading-tight">{verse}</h3>
                  </div>
              </div>
              <div className="p-12 md:p-16">
                  {loading ? (
                      <div className="flex flex-col items-center justify-center py-20 space-y-6">
                          <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest animate-pulse">Buscando alimento espiritual para a sua alma...</p>
                      </div>
                  ) : (
                      <div className={`prose prose-slate max-w-none text-xl font-medium leading-relaxed italic ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          {reflection}
                      </div>
                  )}
              </div>
           </div>

           {/* Diário Espiritual Personalizado */}
           <div className={`p-10 rounded-[3.5rem] border shadow-xl space-y-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 dark:text-white">
                    <Notebook size={28} className="text-rose-600" /> Diário de Meditação
                 </h3>
                 <button onClick={() => saveSpiritualNote(noteContent)} className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg hover:bg-emerald-700 transition-all">
                    <Save size={16}/> Guardar Meditação
                 </button>
              </div>
              <textarea 
                value={noteContent}
                onChange={e => setNoteContent(e.target.value)}
                placeholder="O que é que Deus falou hoje ao seu coração através desta palavra? Escreva aqui as suas reflexões..."
                className="w-full h-60 p-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[2.5rem] font-medium text-lg dark:text-white outline-none resize-none placeholder:text-slate-300"
              />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <Sparkles size={12}/> Suas notas são privadas e ficam salvas no seu dispositivo.
              </p>
           </div>
        </div>

        {/* Sidebar: Orações e Credos */}
        <div className="space-y-8">
           {/* Pedidos de Oração */}
           <div className={`p-10 rounded-[3.5rem] border shadow-xl space-y-8 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <div className="space-y-2">
                 <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Intercessão</h3>
                 <p className="text-[10px] font-black uppercase text-rose-500 tracking-widest">Meus Pedidos de Oração</p>
              </div>
              
              <form onSubmit={handleAddPrayer} className="relative">
                 <input 
                   type="text" value={newPrayer} onChange={e => setNewPrayer(e.target.value)}
                   placeholder="Nova intenção..." 
                   className="w-full p-4 pr-14 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none"
                 />
                 <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-rose-600 text-white rounded-xl shadow-lg">
                    <Plus size={18}/>
                 </button>
              </form>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 no-scrollbar">
                 {prayerIntentions.map(p => (
                   <div key={p.id} className={`p-5 rounded-2xl flex items-center justify-between group transition-all ${p.isAnswered ? 'bg-emerald-50 dark:bg-emerald-900/10 opacity-60' : 'bg-slate-50 dark:bg-slate-800'}`}>
                      <div className="flex items-center gap-4 flex-1">
                         <button onClick={() => togglePrayer(p.id)} className={p.isAnswered ? 'text-emerald-500' : 'text-slate-300'}>
                            {p.isAnswered ? <CheckCircle size={22}/> : <Circle size={22}/>}
                         </button>
                         <p className={`text-xs font-bold leading-tight ${p.isAnswered ? 'line-through text-slate-400' : 'dark:text-white'}`}>{p.text}</p>
                      </div>
                      <button onClick={() => removePrayer(p.id)} className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                         <Trash2 size={16}/>
                      </button>
                   </div>
                 ))}
                 {prayerIntentions.length === 0 && (
                   <div className="py-10 text-center opacity-20 flex flex-col items-center gap-3 uppercase font-black text-[9px]">
                      <Heart size={32}/> Sem pedidos registados
                   </div>
                 )}
              </div>
           </div>

           {/* Orações Fixas Premium */}
           <div className="space-y-4">
              <div className="p-10 rounded-[3rem] bg-slate-900 text-white space-y-6 shadow-2xl relative overflow-hidden">
                 <Quote className="absolute -bottom-10 -right-10 w-48 h-48 opacity-5" />
                 <h4 className="text-xl font-black uppercase tracking-tighter border-b border-white/10 pb-4">{PRAYERS.paiNosso.title}</h4>
                 <p className="leading-loose italic text-sm text-slate-300 font-medium">{PRAYERS.paiNosso.text}</p>
              </div>
              <div className="p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 dark:bg-slate-900 space-y-6">
                 <h4 className="text-xl font-black uppercase tracking-tighter border-b border-slate-50 dark:border-slate-800 pb-4 dark:text-white">{PRAYERS.credoApostolos.title}</h4>
                 <p className="leading-loose italic text-sm text-slate-400 font-medium">{PRAYERS.credoApostolos.text}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Spiritual;
