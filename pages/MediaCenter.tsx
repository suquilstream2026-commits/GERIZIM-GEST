
import React, { useState } from 'react';
import { useAuth } from '../authContext';
import { editImagePrompt, animateWithVeo } from '../geminiService';
import { Film, Image as ImageIcon, Sparkles, Upload, Wand2, Play, AlertCircle, Loader2 } from 'lucide-react';

const MediaCenter: React.FC = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
        setResultImage(null);
        setResultVideo(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnimate = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setError(null);
    try {
      // Logic requirement: users must have selected an API key for Veo models
      if (!(window as any).aistudio?.hasSelectedApiKey()) {
        await (window as any).aistudio?.openSelectKey();
      }
      const videoUrl = await animateWithVeo(selectedFile, prompt, aspectRatio);
      setResultVideo(videoUrl);
    } catch (err: any) {
      // Reset key selection if the request fails due to API key issues (e.g. Requested entity was not found)
      if (err.message?.includes("Requested entity was not found.")) {
        await (window as any).aistudio?.openSelectKey();
      }
      setError(err.message || "Erro ao gerar vídeo. Verifique se possui permissões/créditos Veo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedFile || !prompt) return;
    setIsProcessing(true);
    setError(null);
    try {
      const editedUrl = await editImagePrompt(selectedFile, prompt);
      setResultImage(editedUrl);
    } catch (err: any) {
      // Reset key selection if the request fails due to API key issues
      if (err.message?.includes("Requested entity was not found.")) {
        await (window as any).aistudio?.openSelectKey();
      }
      setError(err.message || "Erro ao editar imagem.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Centro de Mídia IESA</h2>
        <p className="text-slate-500 font-medium">Use Inteligência Artificial para animar e editar fotos da igreja.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload and Settings */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs flex items-center gap-2">
              <Upload size={18} className="text-blue-600"/> 1. Carregar Foto
            </h3>
            <div className="relative group cursor-pointer">
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 group-hover:bg-slate-50 transition-all">
                {selectedFile ? (
                  <img src={selectedFile} className="max-h-60 rounded-xl shadow-md" alt="Preview" />
                ) : (
                  <>
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><ImageIcon size={32}/></div>
                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Clique para selecionar imagem</p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500"/> 2. O que deseja fazer?
              </h3>
              <textarea 
                value={prompt} 
                onChange={e => setPrompt(e.target.value)}
                placeholder="Ex: 'Adicione um filtro retro' ou 'Dê vida a esta foto de coral'..."
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Formato do Vídeo (Veo)</label>
                   <select 
                     value={aspectRatio} 
                     onChange={e => setAspectRatio(e.target.value as any)}
                     className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold"
                   >
                     <option value="16:9">Paisagem (16:9)</option>
                     <option value="9:16">Vertical (9:16)</option>
                   </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button 
                  onClick={handleEdit}
                  disabled={isProcessing || !selectedFile || !prompt}
                  className="bg-slate-900 text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl"
                >
                  <Wand2 size={18}/> Editar Imagem
                </button>
                <button 
                  onClick={handleAnimate}
                  disabled={isProcessing || !selectedFile}
                  className="bg-blue-600 text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xl"
                >
                  <Film size={18}/> Animar Vídeo
                </button>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-2 text-xs font-bold border border-red-100">
                  <AlertCircle size={18}/> {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl flex flex-col min-h-[500px]">
          <h3 className="font-black text-blue-400 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
            <Play size={18}/> Resultado da Inteligência Artificial
          </h3>
          
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-[2rem] overflow-hidden bg-black/20">
            {isProcessing ? (
              <div className="flex flex-col items-center gap-4 text-white">
                <Loader2 className="animate-spin text-blue-500" size={48}/>
                <p className="font-black uppercase text-[10px] tracking-[0.2em] animate-pulse">Processando Mídia...</p>
              </div>
            ) : resultVideo ? (
              <video src={resultVideo} controls autoPlay loop className="max-w-full max-h-full rounded-xl shadow-2xl" />
            ) : resultImage ? (
              <img src={resultImage} className="max-w-full max-h-full rounded-xl shadow-2xl" alt="Edited" />
            ) : (
              <p className="text-slate-600 font-black uppercase text-[10px] tracking-[0.2em]">Aguardando processamento</p>
            )}
          </div>

          {(resultVideo || resultImage) && (
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = resultVideo || resultImage!;
                link.download = resultVideo ? 'iesa-video.mp4' : 'iesa-foto-editada.png';
                link.click();
              }}
              className="mt-6 w-full bg-white/10 text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/20 transition-all border border-white/5"
            >
              Baixar Ficheiro
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaCenter;
