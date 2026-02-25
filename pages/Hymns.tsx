
import React, { useState, useRef } from 'react';
import { useAuth } from '../authContext';
import { Song, UserRole } from '../types';
import { 
  Music, Search, Play, Pause, Download, Trash2, 
  Plus, X, Save, Disc, Heart, Filter, User, Loader2, Upload, FileMusic
} from 'lucide-react';

const Hymns: React.FC = () => {
  const { 
    theme, user, songs, activeSongId, isMusicPlaying, toggleMusic, 
    setActiveSong, removeSong, addSong 
  } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'HINO' | 'CORO'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const audioInputRef = useRef<HTMLInputElement>(null);
  const isAdmin = user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.LEADER;

  const [newSong, setNewSong] = useState({
    title: '',
    author: '',
    url: '',
    category: 'HINO' as const
  });

  const filteredSongs = songs.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      s.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'ALL' || s.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handlePlaySong = (songId: string) => {
    if (activeSongId === songId) {
      toggleMusic();
    } else {
      setActiveSong(songId);
      if (!isMusicPlaying) toggleMusic();
    }
  };

  const handleDownload = async (song: Song) => {
    setDownloadingId(song.id);
    try {
      // Se a URL for um data URI (base64), criamos o blob diretamente
      if (song.url.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = song.url;
        link.download = `${song.title}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const response = await fetch(song.url);
        if (!response.ok) throw new Error('Falha no download');
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${song.title}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }
    } catch (error) {
      console.error('Erro ao descarregar hino:', error);
      window.open(song.url, '_blank');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewSong(prev => ({ ...prev, url: reader.result as string }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSong.url) return;
    addSong({
      ...newSong,
      type: 'external',
      format: 'mp3'
    });
    setShowAddModal(false);
    setNewSong({ title: '', author: '', url: '', category: 'HINO' });
  };

  return (
    <div className="space-y-10 animate-reveal pb-20 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h2 className="text-4xl font-black uppercase tracking-tighter text-blue-600">Hinos & Coros</h2>
           <p className="text-slate-500 font-medium">Louve ao Senhor com alegria. A nossa biblioteca musical sagrada.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-xl hover:bg-blue-700 transition-all"
          >
             <Plus size={20}/> Adicionar Hino
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Procurar hino, coro ou autor..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
           <button onClick={() => setCategoryFilter('ALL')} className={`px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${categoryFilter === 'ALL' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800'}`}>Todos</button>
           <button onClick={() => setCategoryFilter('HINO')} className={`px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${categoryFilter === 'HINO' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800'}`}>Hinos</button>
           <button onClick={() => setCategoryFilter('CORO')} className={`px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${categoryFilter === 'CORO' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800'}`}>Coros</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSongs.map((song) => (
          <div key={song.id} className={`p-8 rounded-[2.5rem] border transition-all hover:shadow-2xl flex items-center justify-between group ${activeSongId === song.id ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/30' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
             <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${activeSongId === song.id ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-blue-600 group-hover:text-white'}`}>
                   <Music size={28} />
                </div>
                <div>
                   <h4 className={`text-lg font-black uppercase tracking-tight leading-none ${activeSongId === song.id ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-white'}`}>{song.title}</h4>
                   <div className="flex items-center gap-3 mt-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <User size={12}/> {song.author || 'Desconhecido'}
                      </p>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${song.category === 'HINO' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>
                        {song.category}
                      </span>
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePlaySong(song.id)}
                  className={`p-4 rounded-full transition-all shadow-md ${activeSongId === song.id && isMusicPlaying ? 'bg-rose-600 text-white rotate-90 scale-110' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                   {activeSongId === song.id && isMusicPlaying ? <Pause size={20}/> : <Play size={20} fill="currentColor"/>}
                </button>
                <button 
                  onClick={() => handleDownload(song)}
                  disabled={downloadingId === song.id}
                  className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-900 hover:text-white rounded-full transition-all shadow-sm disabled:opacity-50"
                  title="Descarregar Hino"
                >
                   {downloadingId === song.id ? <Loader2 size={20} className="animate-spin" /> : <Download size={20}/>}
                </button>
                {isAdmin && (
                  <button 
                    onClick={() => removeSong(song.id)}
                    className="p-4 bg-red-50 text-red-400 hover:bg-red-600 hover:text-white rounded-full transition-all"
                  >
                     <Trash2 size={20}/>
                  </button>
                )}
             </div>
          </div>
        ))}

        {filteredSongs.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-30 flex flex-col items-center gap-4">
             <Disc size={64} className="animate-spin-slow" />
             <p className="font-black uppercase tracking-widest text-xs">Nenhum hino encontrado na nossa biblioteca</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 w-full max-w-xl p-10 rounded-[3.5rem] shadow-2xl space-y-8 animate-reveal max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-6">
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter dark:text-white">Anexar Hino</h3>
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">Biblioteca Musical Gerizim</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:text-rose-500 transition-all">
                  <X size={24}/>
                </button>
              </div>

              <form onSubmit={handleAddSong} className="space-y-6">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Título do Hino *</label>
                    <input required value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Grandioso és Tu" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Autor / Coro</label>
                    <input value={newSong.author} onChange={e => setNewSong({...newSong, author: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nome do autor ou grupo" />
                 </div>
                 
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Ficheiro de Áudio (MP3) *</label>
                    <div className="flex flex-col items-center gap-4 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                        {newSong.url ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center animate-pulse">
                                    <FileMusic size={32}/>
                                </div>
                                <p className="text-[10px] font-black text-emerald-500 uppercase">Ficheiro Carregado com Sucesso</p>
                                <button type="button" onClick={() => setNewSong(prev => ({ ...prev, url: '' }))} className="text-[8px] font-bold text-red-500 uppercase underline">Remover e escolher outro</button>
                            </div>
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded-2xl flex items-center justify-center">
                                    {isUploading ? <Loader2 size={24} className="animate-spin text-blue-500" /> : <Upload size={24}/>}
                                </div>
                                <p className="text-[10px] font-black uppercase text-slate-400 text-center tracking-widest">
                                    {isUploading ? 'Processando áudio...' : 'Arraste ou clique para carregar MP3'}
                                </p>
                                <input 
                                    type="file" 
                                    ref={audioInputRef} 
                                    onChange={handleFileSelect} 
                                    className="hidden" 
                                    accept="audio/mpeg,audio/mp3" 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => audioInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-sm"
                                >
                                    Selecionar Ficheiro
                                </button>
                            </>
                        )}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <p className="text-[9px] font-bold text-slate-400 uppercase text-center">Ou use um link externo</p>
                    <input value={newSong.url.startsWith('data:') ? '' : newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://exemplo.com/audio.mp3" />
                 </div>

                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Categoria</label>
                    <div className="flex gap-4">
                       <label className="flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer has-[:checked]:bg-blue-600 has-[:checked]:text-white has-[:checked]:border-blue-600 transition-all font-black text-[10px] uppercase">
                          <input type="radio" name="cat" checked={newSong.category === 'HINO'} onChange={() => setNewSong({...newSong, category: 'HINO'})} className="hidden" />
                          Hino Tradicional
                       </label>
                       <label className="flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer has-[:checked]:bg-rose-600 has-[:checked]:text-white has-[:checked]:border-rose-600 transition-all font-black text-[10px] uppercase">
                          <input type="radio" name="cat" checked={newSong.category === 'CORO'} onChange={() => setNewSong({...newSong, category: 'CORO'})} className="hidden" />
                          Coro Espiritual
                       </label>
                    </div>
                 </div>

                 <button type="submit" disabled={!newSong.url || isUploading} className="w-full bg-blue-600 text-white p-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                    <Save size={20}/> Guardar na Biblioteca
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Hymns;
