
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../authContext';
import { Music, VolumeX, Volume2, Repeat, Repeat1, SkipForward, Maximize2, Settings2 } from 'lucide-react';

const BackgroundMusic: React.FC = () => {
  const { 
    bgMusicEnabled, songs, activeSongId, isMusicPlaying, toggleMusic, 
    musicVolume, setMusicVolume, musicLoop, toggleMusicLoop, theme
  } = useAuth();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showVolume, setShowVolume] = useState(false);

  const activeSong = songs.find(s => s.id === activeSongId);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    if (activeSong) {
      audioRef.current.src = activeSong.url;
      audioRef.current.loop = musicLoop;
      audioRef.current.volume = musicVolume;
      if (isMusicPlaying) {
        audioRef.current.play().catch(e => console.log("Erro Play:", e));
      }
    }
  }, [activeSong, musicLoop, musicVolume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.play().catch(() => setIsPlayingLocal(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicPlaying]);

  // Fallback para play inicial
  const [isPlayingLocal, setIsPlayingLocal] = useState(false);
  useEffect(() => {
    const handleFirstClick = () => {
      if (bgMusicEnabled && !isMusicPlaying) {
        toggleMusic();
      }
      window.removeEventListener('click', handleFirstClick);
    };
    window.addEventListener('click', handleFirstClick);
    return () => window.removeEventListener('click', handleFirstClick);
  }, [bgMusicEnabled, isMusicPlaying, toggleMusic]);

  if (!bgMusicEnabled || !activeSong) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex items-end gap-3 group">
      {showVolume && (
        <div className={`p-4 rounded-[2rem] border animate-in slide-in-from-bottom-4 duration-300 shadow-2xl flex flex-col items-center gap-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
           <input 
             type="range" min="0" max="1" step="0.01" 
             value={musicVolume} 
             onChange={e => setMusicVolume(parseFloat(e.target.value))}
             className="h-32 w-2 [appearance:slider-vertical] cursor-pointer accent-blue-600"
           />
           <button onClick={toggleMusicLoop} className={`p-2 rounded-xl transition-all ${musicLoop ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
              <Repeat size={16} />
           </button>
        </div>
      )}

      <div className={`p-2 rounded-[2.5rem] border shadow-2xl flex items-center transition-all ${isMusicPlaying ? 'bg-blue-600 border-blue-500 pr-6' : (theme === 'dark' ? 'bg-slate-900 border-slate-800 pr-4' : 'bg-white border-slate-100 pr-4')}`}>
        <button 
          onClick={toggleMusic}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all transform active:scale-95 ${isMusicPlaying ? 'bg-white text-blue-600' : 'bg-blue-600 text-white shadow-lg'}`}
        >
          {isMusicPlaying ? (
            <div className="flex items-center gap-0.5 h-5">
               <span className="w-1 bg-current rounded-full animate-[music-wave_0.6s_ease-in-out_infinite]"></span>
               <span className="w-1 bg-current rounded-full animate-[music-wave_0.8s_ease-in-out_infinite_0.1s]"></span>
               <span className="w-1 bg-current rounded-full animate-[music-wave_0.7s_ease-in-out_infinite_0.2s]"></span>
            </div>
          ) : (
            <VolumeX size={24} />
          )}
        </button>
        
        <div className="ml-4 overflow-hidden max-w-0 group-hover:max-w-[200px] transition-all duration-500">
           <div className="whitespace-nowrap">
              <p className={`text-[10px] font-black uppercase tracking-widest ${isMusicPlaying ? 'text-blue-100' : 'text-slate-400'}`}>
                {isMusicPlaying ? 'Tocando Agora' : 'Som Ambiente'}
              </p>
              <h4 className={`text-xs font-bold truncate ${isMusicPlaying ? 'text-white' : (theme === 'dark' ? 'text-slate-300' : 'text-slate-800')}`}>
                {activeSong.title}
              </h4>
           </div>
        </div>

        <button 
          onClick={() => setShowVolume(!showVolume)}
          className={`ml-4 p-2 rounded-xl transition-all ${isMusicPlaying ? 'text-blue-200 hover:bg-white/10' : 'text-slate-400 hover:bg-slate-100'}`}
        >
          <Settings2 size={18} />
        </button>
      </div>

      <style>{`
        @keyframes music-wave {
          0%, 100% { height: 6px; }
          50% { height: 18px; }
        }
      `}</style>
    </div>
  );
};

export default BackgroundMusic;
