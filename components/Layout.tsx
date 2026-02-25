
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../authContext';
import { 
  LayoutDashboard, Calendar, Users, Wallet, FileText, 
  BookOpen, Film, Settings, LogOut, 
  Menu, X, Moon, Sun, Accessibility, 
  Shield, Heart, Search, Music, CreditCard
} from 'lucide-react';
import { UserRole } from '../types';
import MemberCard from './MemberCard';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, theme, toggleTheme, accessibilityMode, toggleAccessibilityMode, appLogo, appName, registeredUsers } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMyCard, setShowMyCard] = useState(false);

  const currentUserMember = registeredUsers.find(u => u.id === user?.id) || (user as any);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: [] },
    { name: 'Secretaria', href: '/secretary', icon: Users, roles: [UserRole.SUPER_ADMIN, UserRole.SECRETARY, UserRole.LEADER] },
    { name: 'Tesouraria', href: '/treasury', icon: Wallet, roles: [UserRole.SUPER_ADMIN, UserRole.TREASURER, UserRole.SECRETARY] },
    { name: 'Agenda', href: '/events', icon: Calendar, roles: [] },
    { name: 'JIESA', href: '/jiesa', icon: Heart, roles: [UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.SECRETARY, UserRole.ASSISTANT] },
    { name: 'DCIESA', href: '/dciesa', icon: Users, roles: [UserRole.SUPER_ADMIN, UserRole.SUPERVISOR, UserRole.LEADER, UserRole.SECRETARY] },
    { name: 'DEBOS', href: '/debos', icon: Users, roles: [UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.SECRETARY] },
    { name: 'SHIESA', href: '/shiesa', icon: Users, roles: [UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.SECRETARY] },
    { name: 'SOSIESA', href: '/sosiesa', icon: Heart, roles: [UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.SECRETARY] },
    { name: 'Espiritual', href: '/spiritual', icon: BookOpen, roles: [] },
    { name: 'Hinos', href: '/hymns', icon: Music, roles: [] },
    { name: 'Património', href: '/patrimony', icon: Shield, roles: [UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.ASSISTANT] },
    { name: 'Mídia', href: '/media', icon: Film, roles: [UserRole.SUPER_ADMIN, UserRole.LEADER, UserRole.SECRETARY] },
    { name: 'Ajustes', href: '/settings', icon: Settings, roles: [UserRole.SUPER_ADMIN] },
  ];

  const filteredNav = navigation.filter(item => 
    item.roles.length === 0 || (user && (user.role === UserRole.SUPER_ADMIN || item.roles.includes(user.role)))
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0f172a] text-slate-200' : 'bg-slate-50 text-slate-900'} ${accessibilityMode ? 'accessibility-mode' : ''}`}>
      
      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden lg:flex flex-col w-80 sticky top-0 h-screen p-6 z-50`}>
        <div className="flex flex-col h-full rounded-[2.5rem] glass-card shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none transition-all">
          <div className="p-6 flex flex-col items-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-14 h-14 bg-white rounded-2xl p-2 shadow-lg flex items-center justify-center">
                <img src={appLogo} alt="IESA" className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="text-center mt-3">
              <h1 className="font-black text-xl tracking-tighter leading-none dark:text-white uppercase">{appName}</h1>
              <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1.5">Sistema Gestor</p>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar pb-8">
            {filteredNav.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all group ${
                  isActive(item.href) 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 dark:text-slate-400'
                }`}
              >
                <item.icon size={16} className={`transition-transform duration-500 ${isActive(item.href) ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span>{item.name}</span>
              </Link>
            ))}
            <button
              onClick={() => setShowMyCard(true)}
              className="w-full flex items-center gap-3 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 dark:text-slate-400"
            >
              <CreditCard size={16} />
              <span>Meu Cartão</span>
            </button>
          </nav>

          <div className="p-6 mt-auto">
            <div className="bg-slate-500/5 rounded-3xl p-6 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-black text-slate-600 dark:text-slate-400 text-xs">
                  {user?.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black truncate dark:text-white">{user?.name}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{user?.role}</p>
                </div>
              </div>
              <button onClick={logout} className="w-full py-3 bg-white dark:bg-slate-800 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2">
                <LogOut size={14} /> Sair do Portal
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        {/* HEADER BAR */}
        <header className="sticky top-0 z-40 w-full p-4 lg:p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
               <button 
                 onClick={() => setIsSidebarOpen(true)} 
                 className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl active:scale-95 transition-transform"
               >
                  <Menu size={24} />
               </button>
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-full border border-slate-200/50 dark:border-white/5 shadow-sm text-slate-500">
                 <Search size={14} />
                 <input type="text" placeholder="Pesquisa rápida..." className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest w-40" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-1.5 rounded-full border border-slate-200/50 dark:border-white/5 shadow-sm">
               <button onClick={toggleAccessibilityMode} title="Acessibilidade" className={`p-2 rounded-full transition-all ${accessibilityMode ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-white/10'}`}>
                  <Accessibility size={18} />
               </button>
               <button onClick={toggleTheme} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-all">
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
               </button>
             </div>
             
             {/* USER MINI PROFILE */}
             <div className="flex items-center gap-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md pl-4 pr-1.5 py-1.5 rounded-full border border-slate-200/50 dark:border-white/5 shadow-sm">
                <div className="hidden sm:block text-right">
                   <p className="text-[10px] font-black uppercase tracking-tight leading-none dark:text-white truncate max-w-[100px]">{user?.name.split(' ')[0]}</p>
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Online</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-black text-[10px]">
                   {user?.name.charAt(0)}
                </div>
             </div>
          </div>
        </header>

        <div className="flex-1 px-4 lg:px-12 pb-12 overflow-y-auto no-scrollbar animate-reveal">
           {children}
        </div>

        {showMyCard && currentUserMember && (
          <MemberCard member={currentUserMember} onClose={() => setShowMyCard(false)} />
        )}
      </main>

      {/* MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)} />
          <aside className="absolute top-0 left-0 h-full w-[85%] max-w-sm p-4 sm:p-6 transform transition-transform duration-300 animate-in slide-in-from-left">
            <div className={`h-full flex flex-col rounded-[2.5rem] border p-6 sm:p-6 shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-100'}`}>
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white rounded-xl p-2 shadow-sm flex items-center justify-center border border-slate-50">
                     <img src={appLogo} alt="Logo" className="w-full h-full object-contain" />
                   </div>
                   <div className="flex flex-col">
                     <span className="font-black text-base tracking-tighter uppercase leading-none">{appName}</span>
                     <span className="text-[8px] font-bold text-blue-500 uppercase tracking-widest mt-1">Menu Geral</span>
                   </div>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)} 
                  className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-full active:rotate-90 transition-transform"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar pr-2 pb-6">
                {filteredNav.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                      isActive(item.href) 
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                        : 'text-slate-500 active:bg-slate-100 dark:active:bg-slate-800'
                    }`}
                  >
                    <item.icon size={18} className={isActive(item.href) ? 'animate-pulse' : ''} />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="bg-slate-500/5 rounded-3xl p-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-black text-slate-600 dark:text-slate-400 text-xs shadow-inner">
                      {user?.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black truncate dark:text-white uppercase tracking-tight">{user?.name}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate">{user?.role}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setIsSidebarOpen(false); logout(); }} 
                    className="w-full py-3.5 bg-white dark:bg-slate-800 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-700 shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut size={14} /> Encerrar Sessão
                  </button>
                </div>
              </div>

            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Layout;
