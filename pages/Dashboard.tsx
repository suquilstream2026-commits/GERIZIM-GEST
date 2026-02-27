
import React, { useEffect, useState } from 'react';
import { useAuth } from '../authContext';
import { 
  Users, TrendingUp, Calendar, Globe, MapPin, Clock, 
  ShieldCheck, ArrowRight, BookOpen, ChevronRight, 
  BarChart3, Star, Trophy, GraduationCap, ArrowUpRight,
  TrendingDown, Zap, Bell, Baby, Heart
} from 'lucide-react';
import { motion } from 'motion/react';
import { getChurchNewsSearch } from '../geminiService';
import { Link } from 'react-router-dom';
import { UserRole, CBICStudent } from '../types';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

const Dashboard: React.FC = () => {
  const { user, registeredUsers, events, theme, appName, coverImage, students, notifications } = useAuth();
  const [news, setNews] = useState<{ text: string, sources: string[] } | null>(null);
  const [loadingNews, setLoadingNews] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'month' | 'year' | 'all'>('all');

  useEffect(() => {
    async function fetchNews() {
      const data = await getChurchNewsSearch();
      setNews(data);
      setLoadingNews(false);
    }
    fetchNews();
  }, []);

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const filterByTime = (dateStr?: string) => {
    if (!dateStr) return true;
    const date = new Date(dateStr);
    const now = new Date();
    if (timeFilter === 'month') {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }
    if (timeFilter === 'year') {
      return date.getFullYear() === now.getFullYear();
    }
    return true;
  };

  const filteredUsers = registeredUsers.filter(u => filterByTime(u.registrationDate));

  const stats = {
    total: registeredUsers.length,
    dciesa: registeredUsers.filter(u => u.department === 'DCIESA').length,
    jiesa: registeredUsers.filter(u => u.department === 'JIESA').length,
    areas: [...new Set(registeredUsers.map(u => u.area).filter(Boolean))].length,
    events: events.length,
    growth: registeredUsers.filter(u => {
      if (!u.registrationDate) return false;
      const reg = new Date(u.registrationDate);
      const now = new Date();
      return reg.getMonth() === now.getMonth() && reg.getFullYear() === now.getFullYear();
    }).length
  };

  const pastoralAlerts = {
    newMembers: registeredUsers.filter(u => {
      const reg = new Date(u.registrationDate || '');
      const diff = Date.now() - reg.getTime();
      return diff < 7 * 24 * 60 * 60 * 1000; // Last 7 days
    }),
    absent: registeredUsers.filter(u => u.participation === 'PASSIVO'),
    birthdays: registeredUsers.filter(u => {
      if (!u.birthDate) return false;
      const birth = new Date(u.birthDate);
      return birth.getMonth() === new Date().getMonth();
    }),
    transitions: registeredUsers.filter(u => {
      if (u.department !== 'DCIESA' || !u.birthDate) return false;
      const age = calculateAge(u.birthDate);
      return age === 17;
    })
  };

  // Data for Charts
  const deptData = [
    { name: 'JIESA', value: filteredUsers.filter(u => u.department === 'JIESA').length },
    { name: 'DCIESA', value: filteredUsers.filter(u => u.department === 'DCIESA').length },
    { name: 'SHIESA', value: filteredUsers.filter(u => u.department === 'SHIESA').length },
    { name: 'DEBOS', value: filteredUsers.filter(u => u.department === 'DEBOS').length },
    { name: 'GERAL', value: filteredUsers.filter(u => !u.department || u.department === 'GERAL').length },
  ];

  const areaData = [
    { name: 'Centro', value: filteredUsers.filter(u => u.area === 'Centro').length },
    { name: 'Alviário', value: filteredUsers.filter(u => u.area === 'Alviário').length },
    { name: 'Kalongombe', value: filteredUsers.filter(u => u.area === 'Kalongombe').length },
    { name: 'Rua 11', value: filteredUsers.filter(u => u.area === 'Rua 11').length },
    { name: 'Sicar', value: filteredUsers.filter(u => u.area === 'Sicar').length },
    { name: 'Bereia', value: filteredUsers.filter(u => u.area === 'Bereia').length },
  ];

  const ageData = [
    { name: '0-7', value: filteredUsers.filter(u => u.birthDate && calculateAge(u.birthDate) <= 7).length },
    { name: '8-11', value: filteredUsers.filter(u => u.birthDate && calculateAge(u.birthDate) > 7 && calculateAge(u.birthDate) <= 11).length },
    { name: '12-17', value: filteredUsers.filter(u => u.birthDate && calculateAge(u.birthDate) > 11 && calculateAge(u.birthDate) <= 17).length },
    { name: '18-35', value: filteredUsers.filter(u => u.birthDate && calculateAge(u.birthDate) > 17 && calculateAge(u.birthDate) <= 35).length },
    { name: '36+', value: filteredUsers.filter(u => u.birthDate && calculateAge(u.birthDate) > 35).length },
  ];

  const COLORS = ['#3b82f6', '#f43f5e', '#ec4899', '#6366f1', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto animate-reveal pb-20">
      
      {/* Hero Section */}
      <div className="relative h-[400px] w-full rounded-[3.5rem] overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${coverImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 lg:p-20">
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-blue-600/90 backdrop-blur-xl text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
              <Zap size={14} fill="white" /> Dashboard Estratégico IESA
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none">
              Olá, <span className="text-blue-500">{user?.name?.split(' ')[0] || 'Usuário'}</span>.
            </h1>
            <p className="text-lg lg:text-xl text-slate-200 font-medium opacity-80 max-w-2xl">Gestão em tempo real do corpo de membros e crescimento da igreja.</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[
          { label: 'Total Membros', value: stats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Crianças (DCIESA)', value: stats.dciesa, icon: Baby, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
          { label: 'Jovens (JIESA)', value: stats.jiesa, icon: Heart, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Áreas da Igreja', value: stats.areas, icon: MapPin, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Eventos Próximos', value: stats.events, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
          { label: 'Crescimento Mês', value: `+${stats.growth}`, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-xl transition-all duration-500">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <button onClick={() => setTimeFilter('month')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${timeFilter === 'month' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>Este Mês</button>
          <button onClick={() => setTimeFilter('year')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${timeFilter === 'year' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>Este Ano</button>
          <button onClick={() => setTimeFilter('all')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${timeFilter === 'all' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>Todo Histórico</button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Membros</p>
            <p className="text-xl font-black dark:text-white">{filteredUsers.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Activos</p>
            <p className="text-xl font-black text-emerald-500">{filteredUsers.filter(u => u.participation === 'ACTIVO').length}</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Dept Chart */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-black uppercase tracking-tighter dark:text-white mb-8 flex items-center gap-3">
            <Users size={20} className="text-blue-500" /> Por Departamento
          </h3>
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '12px' }}
                  cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f8fafc' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-black uppercase tracking-tighter dark:text-white mb-8 flex items-center gap-3">
            <MapPin size={20} className="text-rose-500" /> Por Área Geográfica
          </h3>
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={areaData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {areaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age Chart */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-black uppercase tracking-tighter dark:text-white mb-8 flex items-center gap-3">
            <TrendingUp size={20} className="text-emerald-500" /> Por Faixa Etária
          </h3>
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={ageData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800 }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Painel Pastoral Inteligente */}
        <div className="xl:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black uppercase tracking-tighter dark:text-white flex items-center gap-3">
              <ShieldCheck size={32} className="text-blue-600" /> Painel Pastoral
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Novos Membros */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs font-black uppercase tracking-widest text-blue-600">Novos Membros (7 dias)</p>
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black"
                >
                  {pastoralAlerts.newMembers.length}
                </motion.span>
              </div>
              <div className="space-y-4">
                {pastoralAlerts.newMembers.slice(0, 3).map(m => (
                  <div key={m.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-xs">{m.name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight dark:text-white">{m.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.area}</p>
                    </div>
                  </div>
                ))}
                {pastoralAlerts.newMembers.length === 0 && <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center py-4">Nenhum novo membro</p>}
              </div>
            </motion.div>

            {/* Aniversariantes */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs font-black uppercase tracking-widest text-rose-600">Aniversariantes do Mês</p>
                <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-[10px] font-black">{pastoralAlerts.birthdays.length}</span>
              </div>
              <div className="space-y-4">
                {pastoralAlerts.birthdays.slice(0, 3).map(m => (
                  <div key={m.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 flex items-center justify-center font-black text-xs">{m.name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight dark:text-white">{m.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.birthDate}</p>
                    </div>
                  </div>
                ))}
                {pastoralAlerts.birthdays.length === 0 && <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center py-4">Sem aniversariantes</p>}
              </div>
            </div>

            {/* Membros Ausentes */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs font-black uppercase tracking-widest text-amber-600">Membros Ausentes / Passivos</p>
                <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black">{pastoralAlerts.absent.length}</span>
              </div>
              <div className="space-y-4">
                {pastoralAlerts.absent.slice(0, 3).map(m => (
                  <div key={m.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center font-black text-xs">{m.name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight dark:text-white">{m.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.phone || 'Sem contacto'}</p>
                    </div>
                  </div>
                ))}
                {pastoralAlerts.absent.length === 0 && <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center py-4">Todos os membros activos</p>}
              </div>
            </div>

            {/* Transições DCIESA */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs font-black uppercase tracking-widest text-indigo-600">Próximas Transições (17 anos)</p>
                <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black">{pastoralAlerts.transitions.length}</span>
              </div>
              <div className="space-y-4">
                {pastoralAlerts.transitions.slice(0, 3).map(m => (
                  <div key={m.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center font-black text-xs">{m.name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight dark:text-white">{m.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">DCIESA → JIESA em breve</p>
                    </div>
                  </div>
                ))}
                {pastoralAlerts.transitions.length === 0 && <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center py-4">Sem transições pendentes</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Notícias do Reino */}
        <div className="glass-card p-10 rounded-[3rem] shadow-sm space-y-8">
          <h3 className="text-xl font-black uppercase tracking-tighter dark:text-white flex items-center gap-3">
             <Globe size={22} className="text-blue-500" /> Notícias do Reino
          </h3>
          {loadingNews ? (
             <div className="py-10 text-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : (
             <div className="space-y-6">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">{news?.text}</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
