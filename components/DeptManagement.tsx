
import React, { useState } from 'react';
import { useAuth } from '../authContext';
import { 
  Wallet, Calendar, BookOpen, FileText, Plus, Trash2, 
  Save, X, Clock, User as UserIcon, CheckCircle2, AlertCircle,
  GraduationCap, Users, ShieldCheck, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DeptSchedule, BibleLesson, TransactionCategory, UserRole, Course, CourseEnrollment, CommissionMember } from '../types';

interface DeptManagementProps {
  department: string;
}

const DeptManagement: React.FC<DeptManagementProps> = ({ department }) => {
  const { 
    user, theme, registeredUsers, deptSchedules, bibleLessons, 
    courses, courseEnrollments, commissionMembers,
    addDeptSchedule, removeDeptSchedule, addBibleLesson, removeBibleLesson,
    addCourse, removeCourse, enrollInCourse, updateEnrollmentStatus, removeEnrollment,
    addCommissionMember, removeCommissionMember,
    addNotification
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'finances' | 'schedules' | 'lessons' | 'courses' | 'commission'>('finances');
  const [showAddModal, setShowAddModal] = useState(false);

  const deptMembers = registeredUsers.filter(m => m.department === department);
  const deptSchedulesList = deptSchedules.filter(s => s.department === department);
  const deptLessonsList = bibleLessons.filter(l => l.department === department);
  const deptCoursesList = courses.filter(c => c.department === department);
  const deptCommission = commissionMembers.filter(cm => cm.department === department);

  const canManage = [UserRole.SUPER_ADMIN, UserRole.SECRETARY, UserRole.ADMIN, UserRole.SUPERVISOR].includes(user?.role as UserRole) || 
                   (user?.role === UserRole.LEADER && user?.department === department);

  const handleAddSchedule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addDeptSchedule({
      department,
      title: fd.get('title') as string,
      type: fd.get('type') as any,
      date: fd.get('date') as string,
      time: fd.get('time') as string,
      responsible: fd.get('responsible') as string,
      participants: []
    });
    setShowAddModal(false);
    addNotification(`Escala: ${fd.get('title')} adicionada ao departamento ${department}`, user?.name || 'Sistema');
  };

  const handleAddLesson = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addBibleLesson({
      department,
      theme: fd.get('theme') as string,
      date: fd.get('date') as string,
      teacher: fd.get('teacher') as string,
      material: fd.get('material') as string,
      attendance: []
    });
    setShowAddModal(false);
    addNotification(`Lição: ${fd.get('theme')} registada no departamento ${department}`, user?.name || 'Sistema');
  };

  const handleAddCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addCourse({
      name: fd.get('name') as string,
      department,
      startDate: fd.get('startDate') as string,
      description: fd.get('description') as string
    });
    setShowAddModal(false);
  };

  const handleEnroll = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const memberId = fd.get('memberId') as string;
    const courseId = fd.get('courseId') as string;
    const member = registeredUsers.find(u => u.id === memberId);
    const course = courses.find(c => c.id === courseId);

    if (member && course) {
      enrollInCourse({
        courseId,
        courseName: course.name,
        memberId,
        memberName: member.name,
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: canManage ? 'APROVADO' : 'PENDENTE'
      });
    }
    setShowAddModal(false);
  };

  const handleAddCommission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const memberId = fd.get('memberId') as string;
    const member = registeredUsers.find(u => u.id === memberId);
    if (member) {
      addCommissionMember({
        department,
        memberId,
        memberName: member.name,
        role: fd.get('role') as string
      });
    }
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm w-fit overflow-x-auto max-w-full">
        <button onClick={() => setActiveTab('finances')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'finances' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>
          <Wallet size={14} /> Contribuições
        </button>
        <button onClick={() => setActiveTab('schedules')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'schedules' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>
          <Calendar size={14} /> Escalas
        </button>
        <button onClick={() => setActiveTab('lessons')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'lessons' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>
          <BookOpen size={14} /> Lições
        </button>
        <button onClick={() => setActiveTab('courses')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'courses' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>
          <GraduationCap size={14} /> Cursos
        </button>
        <button onClick={() => setActiveTab('commission')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'commission' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>
          <ShieldCheck size={14} /> Comissão
        </button>
      </div>

      {/* Content */}
      <div className="animate-reveal">
        {activeTab === 'finances' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Arrecadado</p>
                <p className="text-3xl font-black text-blue-600">0.00 KZ</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4">Este mês no departamento</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Quotas Pendentes</p>
                <p className="text-3xl font-black text-rose-500">{deptMembers.length}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4">Membros com quotas em atraso</p>
              </div>
              <button className="bg-blue-600 text-white p-8 rounded-[2.5rem] shadow-xl hover:bg-blue-700 transition-all flex flex-col items-center justify-center gap-2">
                <Plus size={32} />
                <span className="font-black uppercase tracking-widest text-xs">Registrar Contribuição</span>
              </button>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                <h4 className="font-black uppercase tracking-tighter text-xl">Histórico de Contribuições</h4>
              </div>
              <div className="p-20 text-center opacity-20">
                <Wallet size={48} className="mx-auto mb-4" />
                <p className="font-black uppercase tracking-widest text-xs">Nenhum registro financeiro interno</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedules' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-black uppercase tracking-tighter text-2xl">Escalas do Departamento</h4>
              <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg">
                <Plus size={16} /> Nova Escala
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deptSchedulesList.map(s => (
                <div key={s.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 relative group">
                  <button onClick={() => removeDeptSchedule(s.id)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={16} />
                  </button>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    s.type === 'ENSAIO' ? 'bg-blue-100 text-blue-600' : 
                    s.type === 'ESTUDO' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h5 className="font-black uppercase tracking-tight text-lg">{s.title}</h5>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.type}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-50 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Clock size={14} /> {s.date} às {s.time}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <UserIcon size={14} /> Resp: {s.responsible}
                    </div>
                  </div>
                </div>
              ))}
              {deptSchedulesList.length === 0 && (
                <div className="col-span-full py-20 text-center opacity-20">
                  <Calendar size={48} className="mx-auto mb-4" />
                  <p className="font-black uppercase tracking-widest text-xs">Nenhuma escala programada</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-black uppercase tracking-tighter text-2xl">Cursos do Departamento</h4>
              <div className="flex gap-2">
                {canManage && (
                  <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg">
                    <Plus size={16} /> Novo Curso
                  </button>
                )}
                <button onClick={() => setShowAddModal(true)} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg">
                  <Plus size={16} /> Inscrever-se
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {deptCoursesList.map(c => (
                <div key={c.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center">
                      <GraduationCap size={28} />
                    </div>
                    {canManage && (
                      <button onClick={() => removeCourse(c.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-all">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  <div>
                    <h5 className="text-xl font-black uppercase tracking-tight dark:text-white">{c.name}</h5>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Início: {c.startDate}</p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Alunos Inscritos</p>
                    <div className="space-y-2">
                      {courseEnrollments.filter(e => e.courseId === c.id).map(e => (
                        <div key={e.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <UserIcon size={14} className="text-slate-400" />
                            <span className="text-xs font-bold dark:text-white">{e.memberName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                              e.status === 'APROVADO' ? 'bg-emerald-100 text-emerald-600' : 
                              e.status === 'PENDENTE' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                            }`}>{e.status}</span>
                            {canManage && e.status === 'PENDENTE' && (
                              <button onClick={() => updateEnrollmentStatus(e.id, 'APROVADO')} className="p-1 text-emerald-500 hover:bg-emerald-50 rounded"><CheckCircle2 size={14}/></button>
                            )}
                            {canManage && (
                              <button onClick={() => removeEnrollment(e.id)} className="p-1 text-rose-400 hover:bg-rose-50 rounded"><Trash2 size={14}/></button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'commission' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-black uppercase tracking-tighter text-2xl">Comissão de Trabalho</h4>
              {canManage && (
                <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg">
                  <Plus size={16} /> Adicionar Membro
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deptCommission.map(cm => (
                <div key={cm.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-6 relative group">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                    <Briefcase size={32} />
                  </div>
                  <div>
                    <h5 className="font-black uppercase tracking-tight dark:text-white">{cm.memberName}</h5>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{cm.role}</p>
                  </div>
                  {canManage && (
                    <button onClick={() => removeCommissionMember(cm.id)} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              {deptCommission.length === 0 && (
                <div className="col-span-full py-20 text-center opacity-20">
                  <ShieldCheck size={48} className="mx-auto mb-4" />
                  <p className="font-black uppercase tracking-widest text-xs">Nenhuma comissão definida</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg p-10 rounded-[3rem] shadow-2xl space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white">
                  {activeTab === 'schedules' ? 'Nova Escala' : 
                   activeTab === 'lessons' ? 'Nova Lição' :
                   activeTab === 'courses' ? (canManage ? 'Novo Curso' : 'Inscrição em Curso') :
                   'Adicionar à Comissão'}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400">
                  <X size={20}/>
                </button>
              </div>

              {activeTab === 'schedules' && (
                <form onSubmit={handleAddSchedule} className="space-y-6">
                  {/* ... same as before ... */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Título da Atividade</label>
                    <input name="title" required className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tipo</label>
                      <select name="type" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none">
                        <option value="ENSAIO">Ensaio</option>
                        <option value="ESTUDO">Estudo Bíblico</option>
                        <option value="ACTIVIDADE">Actividade</option>
                        <option value="SERVICO">Serviço</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Data</label>
                      <input name="date" type="date" required className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Hora</label>
                      <input name="time" type="time" required className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Responsável</label>
                      <input name="responsible" required className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none" />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg transition-all flex items-center justify-center gap-2">
                    <Save size={18}/> Salvar Escala
                  </button>
                </form>
              )}

              {activeTab === 'lessons' && (
                <form onSubmit={handleAddLesson} className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tema da Lição</label>
                    <input name="theme" required className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Data</label>
                      <input name="date" type="date" required className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Professor</label>
                      <input name="teacher" required className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Material de Apoio</label>
                    <input name="material" placeholder="Ex: Bíblia, Manual Vol. 1" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none" />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg transition-all flex items-center justify-center gap-2">
                    <Save size={18}/> Registrar Lição
                  </button>
                </form>
              )}

              {activeTab === 'courses' && canManage && (
                <form onSubmit={handleAddCourse} className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome do Curso</label>
                    {department === 'DCIESA' ? (
                      <select name="name" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none">
                        <option value="Curso Bíblico Infantil Por Correspondência">Curso Bíblico Infantil Por Correspondência</option>
                        <option value="Classe de Férias">Classe de Férias</option>
                        <option value="Classe de 5 dias">Classe de 5 dias</option>
                      </select>
                    ) : (
                      <input name="name" required placeholder="Ex: Curso de Liderança" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Data de Início</label>
                    <input name="startDate" type="date" required className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Descrição</label>
                    <textarea name="description" rows={3} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none resize-none" />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg transition-all flex items-center justify-center gap-2">
                    <Save size={18}/> Criar Curso
                  </button>
                </form>
              )}

              {activeTab === 'courses' && !canManage && (
                <form onSubmit={handleEnroll} className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Escolher Curso</label>
                    <select name="courseId" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none">
                      {deptCoursesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <input type="hidden" name="memberId" value={user?.id} />
                  <button type="submit" className="w-full bg-emerald-600 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg transition-all flex items-center justify-center gap-2">
                    <Plus size={18}/> Solicitar Inscrição
                  </button>
                </form>
              )}

              {activeTab === 'commission' && (
                <form onSubmit={handleAddCommission} className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Membro</label>
                    <select name="memberId" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none">
                      {deptMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Função</label>
                    <input name="role" required placeholder="Ex: Secretário, Tesoureiro..." className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg transition-all flex items-center justify-center gap-2">
                    <Save size={18}/> Adicionar à Comissão
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeptManagement;
