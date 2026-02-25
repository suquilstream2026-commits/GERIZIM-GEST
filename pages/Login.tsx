
import React, { useState } from 'react';
import { useAuth } from '../authContext';
import { 
  User as UserIcon, 
  Lock, 
  AlertCircle,
  ChevronRight,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  MailCheck
} from 'lucide-react';
import { COVER_IMAGE } from '../constants';
import { emailService } from '../emailService';

const Login: React.FC = () => {
  const { login, appLogo, appName } = useAuth();
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados para "Esqueci minha senha"
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetUsername, setResetUsername] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleLogin = async () => {
    setError(null);
    if (!loginName || !loginPassword) {
      setError("Preencha Usuário e Senha.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = login(loginName, loginPassword);
      if (!result.success) {
        setError(result.message || 'Erro ao entrar.');
        setLoading(false);
      }
    }, 800);
  };

  const handleResetPassword = async () => {
    if (!resetUsername) {
      setError("Insira o seu nome de usuário.");
      return;
    }
    setLoading(true);
    setError(null);
    
    const success = await emailService.sendPasswordResetEmail(resetUsername);
    if (success) {
      setResetSuccess(true);
    } else {
      setError("Erro ao processar pedido. Tente novamente.");
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setIsForgotPassword(!isForgotPassword);
    setError(null);
    setResetSuccess(false);
    setResetUsername('');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-[#0f172a] overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[20s] animate-pulse-slow"
        style={{ 
          backgroundImage: `url(${COVER_IMAGE})`,
          filter: 'brightness(0.3) saturate(0.8) blur(3px)',
          transform: 'scale(1.1)' 
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0f172a] via-transparent to-red-900/10" />

      <div className="relative z-10 max-w-xl w-full animate-premium">
        <div className="text-center mb-10 space-y-6">
          <div className="inline-flex p-6 bg-white/10 backdrop-blur-3xl rounded-[2.5rem] border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-700">
            <img src={appLogo} alt="IESA" className="w-20 h-20 object-contain drop-shadow-2xl" />
          </div>
          <div>
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
              IESA <span className="text-red-500">{appName}</span>
            </h1>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] mt-4 opacity-70">
              Ecossistema de Gestão Eclesiástica
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-5 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl flex items-center gap-4 text-red-400 text-sm font-bold shadow-2xl animate-shake">
            <AlertCircle size={20} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/10 space-y-10">
          
          {resetSuccess ? (
            <div className="text-center space-y-8 animate-reveal">
              <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <MailCheck size={48} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Instruções Enviadas!</h2>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  As instruções de recuperação foram enviadas para o e-mail associado à conta <span className="text-white font-bold">{resetUsername}</span>.
                </p>
              </div>
              <button 
                onClick={toggleMode}
                className="w-full bg-white/10 text-white p-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:bg-white/20 transition-all flex items-center justify-center gap-3"
              >
                <ArrowLeft size={18} /> Voltar ao Login
              </button>
            </div>
          ) : isForgotPassword ? (
            <div className="space-y-8 animate-reveal">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Recuperar Conta</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Insira o seu utilizador para prosseguir</p>
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Utilizador Associado</label>
                <div className="relative group">
                  <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors" size={20} />
                  <input 
                    type="text" value={resetUsername} 
                    onChange={e => setResetUsername(e.target.value)} 
                    className="w-full p-6 pl-16 bg-white/5 border border-white/10 rounded-[2rem] font-bold text-white focus:ring-4 focus:ring-red-500/20 focus:border-red-500/40 outline-none transition-all placeholder:text-slate-600"
                    placeholder="Seu nome de usuário"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleResetPassword} 
                  disabled={loading} 
                  className="w-full bg-red-600 text-white p-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-red-700 shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-4"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Solicitar Instruções <ChevronRight size={18}/></>}
                </button>
                <button 
                  onClick={toggleMode}
                  className="w-full p-4 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={14} /> Cancelar e Voltar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-5">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">Utilizador Corporativo</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors" size={20} />
                    <input 
                      type="text" value={loginName} 
                      onChange={e => setLoginName(e.target.value)} 
                      className="w-full p-6 pl-16 bg-white/5 border border-white/10 rounded-[2rem] font-bold text-white focus:ring-4 focus:ring-red-500/20 focus:border-red-500/40 outline-none transition-all placeholder:text-slate-600"
                      placeholder="Usuário atribuído"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-6">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Senha de Segurança</label>
                    <button 
                      onClick={toggleMode}
                      className="text-[9px] font-black uppercase text-red-500 hover:text-red-400 transition-colors tracking-widest"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-500 transition-colors" size={20} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={loginPassword} 
                      onChange={e => setLoginPassword(e.target.value)} 
                      className="w-full p-6 pl-16 bg-white/5 border border-white/10 rounded-[2rem] font-bold text-white focus:ring-4 focus:ring-red-500/20 focus:border-red-500/40 outline-none transition-all placeholder:text-slate-600"
                      placeholder="••••••••"
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleLogin} 
                disabled={loading} 
                className="w-full bg-red-600 text-white p-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-red-700 hover:shadow-[0_20px_40px_rgba(220,38,38,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-4"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Aceder ao Painel <ChevronRight size={18}/></>}
              </button>

              <div className="flex flex-col items-center gap-4 pt-4">
                <p className="text-slate-500 font-bold text-[9px] uppercase tracking-widest text-center">
                  Acesso restrito a membros autorizados.<br/>Contacte a Secretaria Geral para credenciais.
                </p>
                <div className="flex items-center gap-3 opacity-20">
                   <div className="w-12 h-[1px] bg-white"></div>
                   <p className="text-[8px] font-black text-white uppercase tracking-[0.5em]">IESA GEST 2025</p>
                   <div className="w-12 h-[1px] bg-white"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
