
import React, { useState } from 'react';
import { Member, UserRole, TransactionCategory } from '../types';
import { useAuth } from '../authContext';
import { User, MapPin, Calendar, Fingerprint, Shield, Heart, Briefcase, Save, X, Phone, Users, Star, Activity } from 'lucide-react';

interface MemberFormProps {
  onSave: (memberData: any) => void;
  onCancel: () => void;
  initialData?: Partial<Member>;
}

const MemberForm: React.FC<MemberFormProps> = ({ onSave, onCancel, initialData }) => {
  const { departments, filiais, areas } = useAuth();
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
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
    talents: initialData?.talents?.join(', ') || '',
    dons: initialData?.dons?.join(', ') || '',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Nome obrigatório';
    if (!formData.birthDate) newErrors.birthDate = 'Data de nascimento obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Data de Batismo</label>
            <div className="relative">
              <input type="date" value={formData.baptismDate} onChange={e => setFormData({...formData, baptismDate: e.target.value})} className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none" />
              <Heart className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">BI / Documento</label>
            <div className="relative">
              <input type="text" value={formData.biNumber} onChange={e => setFormData({...formData, biNumber: e.target.value})} className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none" />
              <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Telefone</label>
            <div className="relative">
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none" />
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            </div>
          </div>

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
            <select value={formData.spiritualState} onChange={e => setFormData({...formData, spiritualState: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none">
              <option value="CATECOUMENO">Catecúmeno</option>
              <option value="BAPTIZADO">Baptizado</option>
              <option value="EM_FALTA">Em Falta</option>
              <option value="DISCIPLINADO">Disciplinado</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Participação</label>
            <select value={formData.participation} onChange={e => setFormData({...formData, participation: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none">
              <option value="ACTIVO">Activo</option>
              <option value="INACTIVO">Inactivo</option>
              <option value="TRANSFERIDO">Transferido</option>
              <option value="FALECIDO">Falecido</option>
            </select>
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

          {/* Talentos e Dons */}
          <div className="space-y-1 md:col-span-2">
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

          <div className="space-y-1 md:col-span-3">
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
