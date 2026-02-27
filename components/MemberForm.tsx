
import React, { useState } from 'react';
import { Member, UserRole, TransactionCategory } from '../types';
import { useAuth } from '../authContext';
import { User, MapPin, Calendar, Fingerprint, Shield, Heart, Briefcase, Save, X, Phone, Users, Star, Activity, Camera, Upload, Link, ShieldCheck } from 'lucide-react';

interface MemberFormProps {
  onSave: (memberData: any) => void;
  onCancel: () => void;
  initialData?: Partial<Member>;
}

const MemberForm: React.FC<MemberFormProps> = ({ onSave, onCancel, initialData }) => {
  const { user, departments, filiais, areas } = useAuth();
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    role: initialData?.role || UserRole.MEMBER,
    filial: initialData?.filial || filiais[0] || '',
    area: initialData?.area || areas[0] || '',
    birthDate: initialData?.birthDate || '',
    baptismDate: initialData?.baptismDate || '',
    biNumber: initialData?.biNumber || '',
    phone: initialData?.phone || '',
    gender: initialData?.gender || 'M',
    department: initialData?.department || 'GERAL',
    spiritualState: initialData?.spiritualState || 'CATECOUMENO',
    civilStatus: initialData?.civilStatus || 'SOLTEIRO',
    participation: initialData?.participation || 'ACTIVO',
    roleInDept: initialData?.roleInDept || '',
    talents: Array.isArray(initialData?.talents) ? initialData.talents.join(', ') : (typeof initialData?.talents === 'string' ? initialData.talents : ''),
    dons: Array.isArray(initialData?.dons) ? initialData.dons.join(', ') : (typeof initialData?.dons === 'string' ? initialData.dons : ''),
    notes: initialData?.notes || '',
    photo: initialData?.photo || '',
  });

  const [photoMode, setPhotoMode] = useState<'upload' | 'url'>('upload');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Nome obrigatório';
    if (!formData.birthDate) newErrors.birthDate = 'Data de nascimento obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const processedData = {
        ...formData,
        talents: formData.talents.split(',').map(s => s.trim()).filter(Boolean),
        dons: formData.dons.split(',').map(s => s.trim()).filter(Boolean),
      };
      onSave(processedData);
    }
  };

  const getRolesForDept = (deptId: string) => {
    const dept = departments.find(d => d.id === deptId);
    return dept ? dept.roles : ["Membro"];
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl max-w-5xl mx-auto animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
      <div className="flex justify-between items-center mb-8 border-b border-slate-50 dark:border-slate-800 pb-6">
        <div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
            {initialData ? 'Editar Membro' : 'Novo Cadastro'}
          </h3>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Formulário de Gestão IESA</p>
        </div>
        <button onClick={onCancel} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:bg-slate-100 transition-all">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Photo Section */}
          <div className="w-full md:w-64 space-y-4">
            <div className="aspect-square rounded-[2rem] bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col items-center justify-center relative group">
              {formData.photo ? (
                <>
                  <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => setFormData(prev => ({ ...prev, photo: '' }))}
                    className="absolute top-4 right-4 p-2 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Camera size={40} strokeWidth={1.5} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Foto do Membro</p>
                </div>
              )}
            </div>
            
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button 
                type="button" 
                onClick={() => setPhotoMode('upload')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${photoMode === 'upload' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-400'}`}
              >
                <Upload size={12} /> Upload
              </button>
              <button 
                type="button" 
                onClick={() => setPhotoMode('url')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${photoMode === 'url' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-400'}`}
              >
                <Link size={12} /> Link/Drive
              </button>
            </div>

            {photoMode === 'upload' ? (
              <label className="block w-full py-3 bg-slate-900 text-white text-center rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-slate-800 transition-all">
                Escolher do Dispositivo
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            ) : (
              <input 
                type="text" 
                value={formData.photo} 
                onChange={e => setFormData(prev => ({ ...prev, photo: e.target.value }))}
                placeholder="Cole o link da foto ou Google Drive"
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informação Básica */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome Completo *</label>
              <div className="relative">
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 border ${errors.name ? 'border-red-300' : 'border-slate-100 dark:border-slate-700'} rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500`} />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Gênero</label>
              <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none">
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Data de Nascimento *</label>
              <div className="relative">
                <input type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none" />
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Telefone</label>
              <div className="relative">
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none" />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">BI / Documento</label>
              <div className="relative">
                <input type="text" value={formData.biNumber} onChange={e => setFormData({...formData, biNumber: e.target.value})} className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none" />
                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-50 dark:border-slate-800">
          {/* Eclesiástico */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Área Geográfica</label>
            <div className="relative">
              <select value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none appearance-none">
                {areas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Departamento</label>
            <div className="relative">
              <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value, roleInDept: ''})} className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none appearance-none">
                <option value="GERAL">Geral</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Cargo no Dept.</label>
            <div className="relative">
              <select value={formData.roleInDept} onChange={e => setFormData({...formData, roleInDept: e.target.value})} className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none appearance-none">
                <option value="">Membro</option>
                {getRolesForDept(formData.department).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Estado Espiritual</label>
            <div className="flex flex-wrap gap-2">
              {['CATECOUMENO', 'BAPTIZADO', 'EM_FALTA', 'DISCIPLINADO'].map(state => (
                <button 
                  key={state}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, spiritualState: state }))}
                  className={`flex-1 py-3 px-2 rounded-xl text-[8px] font-black uppercase transition-all ${formData.spiritualState === state ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
                >
                  {state.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Participação</label>
            <div className="flex flex-wrap gap-2">
              {['ACTIVO', 'PASSIVO', 'TRANSFERIDO', 'FALECIDO'].map(part => (
                <button 
                  key={part}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, participation: part }))}
                  className={`flex-1 py-3 px-2 rounded-xl text-[8px] font-black uppercase transition-all ${formData.participation === part ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
                >
                  {part}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Estado Civil</label>
            <select value={formData.civilStatus} onChange={e => setFormData({...formData, civilStatus: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none">
              <option value="SOLTEIRO">Solteiro(a)</option>
              <option value="CASADO">Casado(a)</option>
              <option value="VIUVO">Viúvo(a)</option>
              <option value="DIVORCIADO">Divorciado(a)</option>
            </select>
          </div>

          {user?.role === UserRole.SUPER_ADMIN && (
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nível de Acesso (Role)</label>
              <div className="relative">
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})} className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none appearance-none">
                  <option value={UserRole.MEMBER}>Membro</option>
                  <option value={UserRole.LEADER}>Líder de Dept.</option>
                  <option value={UserRole.SECRETARY}>Secretário</option>
                  <option value={UserRole.ADMIN}>Administrador</option>
                  <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                </select>
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-50 dark:border-slate-800">
          {/* Talentos e Dons */}
          <div className="space-y-1 md:col-span-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Talentos (separados por vírgula)</label>
            <div className="relative">
              <input type="text" value={formData.talents} onChange={e => setFormData({...formData, talents: e.target.value})} className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none" placeholder="Ex: Canto, Instrumentos, Cozinha..." />
              <Star className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Dons Espirituais</label>
            <div className="relative">
              <input type="text" value={formData.dons} onChange={e => setFormData({...formData, dons: e.target.value})} className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none" placeholder="Ex: Profecia, Cura, Ensino..." />
              <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            </div>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Notas / Observações</label>
            <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none h-24 resize-none" placeholder="Informações adicionais relevantes..." />
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row gap-4">
          <button type="submit" className="flex-1 bg-blue-600 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl transition-all flex items-center justify-center gap-3">
            <Save size={20} /> {initialData ? 'Actualizar Dados' : 'Finalizar Cadastro'}
          </button>
          <button type="button" onClick={onCancel} className="px-10 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;
