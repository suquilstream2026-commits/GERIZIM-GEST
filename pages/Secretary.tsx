
import React, { useState, useRef } from 'react';
import { useAuth } from '../authContext';
import { UserRole } from '../types';
import { GoogleGenAI } from "@google/genai";
import { 
  Users, Search, ShieldCheck, Mail, Phone, MapPin, 
  Key, Filter, ChevronRight, UserCheck, Heart, Shield,
  Plus, X, Save, Calendar, UserPlus, FileText, Lock,
  Mic, Square, Loader2, Sparkles
} from 'lucide-react';

import MemberManager from '../components/MemberManager';
import FamilyManager from '../components/FamilyManager';
import MemberForm from '../components/MemberForm';

const Secretary: React.FC = () => {
  const { user, registeredUsers, churchCouncil, theme, addCouncilMember, removeCouncilMember, filiais, registerMember } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'council' | 'families'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Estados para Gravação de Voz
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [notes, setNotes] = useState('');

  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
  const isGeneralSecretary = user?.role === UserRole.SECRETARY;
  const isDeptLeader = user?.role === UserRole.LEADER;
  const canRegister = isSuperAdmin || isGeneralSecretary || (isDeptLeader && user?.department);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Erro ao acessar microfone:", err);
      alert("Não foi possível acessar o microfone. Verifique as permissões.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            {
              parts: [
                { inlineData: { data: base64Audio, mimeType: 'audio/webm' } },
                { text: "Transcreva este áudio de notas administrativas de uma igreja para texto em português. Seja conciso e profissional." }
              ]
            }
          ]
        });

        const transcription = response.text;
        setNotes(prev => prev + (prev ? " " : "") + transcription);
      };
    } catch (err) {
      console.error("Erro na transcrição:", err);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleRegister = (memberData: any) => {
    registerMember(memberData);
    setShowAddModal(false);
  };

  const filteredMembers = registeredUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.filial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.department?.toLowerCase().includes(searchTerm.toLowerCase());
    if (!searchTerm && isDeptLeader) return u.department === user?.department;
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-reveal pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-blue-600">Diretório da Igreja</h2>
          <p className="text-slate-500 font-medium">
            {isDeptLeader ? `Gestão de Membros - Departamento ${user?.department}` : 'Corpo de Membros e Conselho da Igreja IESA Gerizim.'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-x-auto">
            <button onClick={() => setActiveTab('all')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === 'all' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>Membros</button>
            <button onClick={() => setActiveTab('families')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === 'families' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>Famílias</button>
            <button onClick={() => setActiveTab('council')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === 'council' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>Conselho</button>
          </div>
        </div>
      </div>

      {activeTab === 'all' && (
        <MemberManager />
      )}

      {activeTab === 'families' && (
        <FamilyManager />
      )}

      {activeTab === 'council' && (
        <div className="space-y-10">
           <div className="bg-slate-900 p-12 rounded-[3.5rem] relative overflow-hidden shadow-2xl">
              <ShieldCheck className="absolute -bottom-10 -right-10 w-64 h-64 text-white opacity-5" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                 <div className="p-8 bg-blue-600 text-white rounded-[2.5rem]">
                    <Shield size={48} />
                 </div>
                 <div className="space-y-3 text-center md:text-left">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Conselho Superior da Igreja</h3>
                    <p className="text-blue-100 max-w-2xl font-medium">A liderança espiritual e administrativa que governa a IESA Gerizim com sabedoria e temor a Deus.</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {churchCouncil.length === 0 ? (
                <div className="col-span-full py-20 text-center opacity-20 flex flex-col items-center gap-4">
                  <UserCheck size={48}/>
                  <p className="font-black uppercase tracking-widest text-xs">Aguardando definição oficial do Conselho</p>
                </div>
              ) : (
                churchCouncil.map(m => (
                  <div key={m.id} className="glass-card p-10 rounded-[3rem] shadow-sm relative overflow-hidden group">
                     <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center font-black text-3xl shadow-xl">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xl font-black uppercase tracking-tight dark:text-white">{m.name}</h4>
                          <span className="px-3 py-1 bg-blue-600/10 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest">{m.roleInDept || 'Conselheiro'}</span>
                        </div>
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <MemberForm 
            onSave={handleRegister}
            onCancel={() => setShowAddModal(false)}
            initialData={isDeptLeader ? { department: user?.department } : {}}
          />
        </div>
      )}
    </div>
  );
};

export default Secretary;
