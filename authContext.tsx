
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole, AppNotification, ChurchEvent, Song, Member, SpiritualContent, PrayerIntention, SpiritualNote, CBICStudent, Department, HistoryEntry, DeptSchedule, BibleLesson, Family, PastoralNote, Course, CourseEnrollment, CommissionMember } from './types';
import { APP_LOGO, COVER_IMAGE, ACTIVITY_TYPES } from './constants';
import { getDailySpiritualContent } from './geminiService';

interface AuthContextType {
  user: User | null;
  registeredUsers: User[];
  churchCouncil: Member[];
  notifications: AppNotification[];
  events: ChurchEvent[];
  songs: Song[];
  appLogo: string;
  appName: string;
  coverImage: string;
  filiais: string[];
  theme: 'light' | 'dark';
  prayerIntentions: PrayerIntention[];
  spiritualNotes: SpiritualNote[];
  // Added missing properties based on usage in pages
  students: CBICStudent[];
  departments: Department[];
  activityTypes: string[];
  accessibilityMode: boolean;
  activeSongId: string | null;
  isMusicPlaying: boolean;
  musicVolume: number;
  musicLoop: boolean;
  deptSchedules: DeptSchedule[];
  bibleLessons: BibleLesson[];
  families: Family[];
  pastoralNotes: PastoralNote[];
  courses: Course[];
  courseEnrollments: CourseEnrollment[];
  commissionMembers: CommissionMember[];
  // Actions
  toggleTheme: () => void;
  toggleAccessibilityMode: () => void;
  updateAppIdentity: (name: string, logo: string, cover: string) => void;
  registerMember: (userData: Partial<User>) => void;
  updateMember: (id: string, updates: Partial<User>) => void;
  deleteMember: (id: string) => void;
  addHistoryEntry: (memberId: string, entry: Omit<HistoryEntry, 'id'>) => void;
  login: (name: string, password: string) => { success: boolean, message?: string };
  logout: () => void;
  addNotification: (message: string, author: string, type?: 'INFO' | 'ALERT' | 'ACHIEVEMENT') => void;
  addEvent: (event: any) => void;
  removeEvent: (id: string) => void;
  addSong: (song: any) => void;
  removeSong: (id: string) => void;
  addPrayer: (text: string) => void;
  togglePrayer: (id: string) => void;
  removePrayer: (id: string) => void;
  saveSpiritualNote: (content: string) => void;
  setActiveSong: (id: string) => void;
  toggleMusic: () => void;
  setMusicVolume: (v: number) => void;
  toggleMusicLoop: () => void;
  addCouncilMember: (member: Member) => void;
  removeCouncilMember: (id: string) => void;
  // New Actions
  addDeptSchedule: (schedule: Omit<DeptSchedule, 'id'>) => void;
  removeDeptSchedule: (id: string) => void;
  addBibleLesson: (lesson: Omit<BibleLesson, 'id'>) => void;
  removeBibleLesson: (id: string) => void;
  addFamily: (family: Omit<Family, 'id'>) => void;
  updateFamily: (id: string, updates: Partial<Family>) => void;
  removeFamily: (id: string) => void;
  addPastoralNote: (note: Omit<PastoralNote, 'id'>) => void;
  removePastoralNote: (id: string) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  removeCourse: (id: string) => void;
  enrollInCourse: (enrollment: Omit<CourseEnrollment, 'id'>) => void;
  updateEnrollmentStatus: (id: string, status: CourseEnrollment['status']) => void;
  removeEnrollment: (id: string) => void;
  addCommissionMember: (cm: Omit<CommissionMember, 'id'>) => void;
  removeCommissionMember: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FIXED_ADMINS: User[] = [
  { id: 'admin-1', name: 'Joao Suquissa', role: UserRole.SUPER_ADMIN, password: 'Suquissa', filial: 'Centro' },
  { id: 'admin-2', name: 'IESA GERIZIM', role: UserRole.SUPER_ADMIN, password: 'Gerizim2026', filial: 'Centro' }
];

const DEFAULT_DEPARTMENTS: Department[] = [
  { id: 'JIESA', name: 'JIESA', roles: ['Responsável', 'Secretário', 'Tesoureiro'], color: 'bg-blue-600' },
  { id: 'DCIESA', name: 'DCIESA', roles: ['Supervisor', 'Monitor', 'Auxiliar'], color: 'bg-rose-600' },
  { id: 'SHIESA', name: 'SHIESA', roles: ['Responsável', 'Secretária'], color: 'bg-pink-500' },
  { id: 'DEBOS', name: 'DEBOS', roles: ['Responsável', 'Secretário'], color: 'bg-indigo-600' },
  { id: 'EVANGELIZAÇÃO', name: 'Evangelização', roles: ['Coordenador'], color: 'bg-emerald-600' }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => JSON.parse(localStorage.getItem('iesa_user') || 'null'));
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = JSON.parse(localStorage.getItem('iesa_registered_users') || '[]');
    const adminList = [...saved];
    FIXED_ADMINS.forEach(admin => {
      if (!adminList.find((u: any) => u.name === admin.name)) adminList.push(admin);
    });
    return adminList;
  });
  const [notifications, setNotifications] = useState<AppNotification[]>(() => JSON.parse(localStorage.getItem('iesa_notifications') || '[]'));
  const [events, setEvents] = useState<ChurchEvent[]>(() => JSON.parse(localStorage.getItem('iesa_events') || '[]'));
  const [songs, setSongs] = useState<Song[]>(() => JSON.parse(localStorage.getItem('iesa_hinos') || '[]'));
  const [prayerIntentions, setPrayerIntentions] = useState<PrayerIntention[]>(() => JSON.parse(localStorage.getItem('iesa_prayers') || '[]'));
  const [spiritualNotes, setSpiritualNotes] = useState<SpiritualNote[]>(() => JSON.parse(localStorage.getItem('iesa_notes') || '[]'));
  const [churchCouncil, setChurchCouncil] = useState<Member[]>(() => JSON.parse(localStorage.getItem('iesa_council') || '[]'));
  const [deptSchedules, setDeptSchedules] = useState<DeptSchedule[]>(() => JSON.parse(localStorage.getItem('iesa_dept_schedules') || '[]'));
  const [bibleLessons, setBibleLessons] = useState<BibleLesson[]>(() => JSON.parse(localStorage.getItem('iesa_bible_lessons') || '[]'));
  const [families, setFamilies] = useState<Family[]>(() => JSON.parse(localStorage.getItem('iesa_families') || '[]'));
  const [pastoralNotes, setPastoralNotes] = useState<PastoralNote[]>(() => JSON.parse(localStorage.getItem('iesa_pastoral_notes') || '[]'));
  const [courses, setCourses] = useState<Course[]>(() => JSON.parse(localStorage.getItem('iesa_courses') || '[]'));
  const [courseEnrollments, setCourseEnrollments] = useState<CourseEnrollment[]>(() => JSON.parse(localStorage.getItem('iesa_course_enrollments') || '[]'));
  const [commissionMembers, setCommissionMembers] = useState<CommissionMember[]>(() => JSON.parse(localStorage.getItem('iesa_commissions') || '[]'));
  
  const [appLogo, setAppLogo] = useState(() => localStorage.getItem('iesa_app_logo') || APP_LOGO);
  const [appName, setAppName] = useState(() => localStorage.getItem('iesa_app_name') || 'GERIZIM');
  const [coverImage, setCoverImage] = useState(() => localStorage.getItem('iesa_cover_image') || COVER_IMAGE);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('iesa_theme') as any) || 'light');
  const [accessibilityMode, setAccessibilityMode] = useState(() => localStorage.getItem('iesa_accessibility') === 'true');

  const [activeSongId, setActiveSongId] = useState<string | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [musicLoop, setMusicLoop] = useState(false);

  useEffect(() => { localStorage.setItem('iesa_registered_users', JSON.stringify(registeredUsers)); }, [registeredUsers]);
  useEffect(() => { localStorage.setItem('iesa_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('iesa_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('iesa_hinos', JSON.stringify(songs)); }, [songs]);
  useEffect(() => { localStorage.setItem('iesa_prayers', JSON.stringify(prayerIntentions)); }, [prayerIntentions]);
  useEffect(() => { localStorage.setItem('iesa_notes', JSON.stringify(spiritualNotes)); }, [spiritualNotes]);
  useEffect(() => { localStorage.setItem('iesa_council', JSON.stringify(churchCouncil)); }, [churchCouncil]);
  useEffect(() => { localStorage.setItem('iesa_dept_schedules', JSON.stringify(deptSchedules)); }, [deptSchedules]);
  useEffect(() => { localStorage.setItem('iesa_bible_lessons', JSON.stringify(bibleLessons)); }, [bibleLessons]);
  useEffect(() => { localStorage.setItem('iesa_families', JSON.stringify(families)); }, [families]);
  useEffect(() => { localStorage.setItem('iesa_pastoral_notes', JSON.stringify(pastoralNotes)); }, [pastoralNotes]);
  useEffect(() => { localStorage.setItem('iesa_courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('iesa_course_enrollments', JSON.stringify(courseEnrollments)); }, [courseEnrollments]);
  useEffect(() => { localStorage.setItem('iesa_commissions', JSON.stringify(commissionMembers)); }, [commissionMembers]);
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); }, [theme]);
  useEffect(() => { localStorage.setItem('iesa_theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('iesa_accessibility', accessibilityMode.toString()); }, [accessibilityMode]);

  const addNotification = (message: string, author: string, type: any = 'INFO') => {
    const newNote = { id: Math.random().toString(36).substr(2, 9), timestamp: new Date().toISOString(), message, author, type };
    setNotifications(prev => [newNote, ...prev].slice(0, 50));
  };

  const registerMember = (userData: Partial<User>) => {
    const accessCode = `IESA-${Math.floor(1000 + Math.random() * 9000)}`;
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name!,
      role: userData.role || UserRole.MEMBER,
      password: accessCode,
      filial: userData.filial || 'Centro',
      department: userData.department,
      phone: userData.phone,
      birthDate: userData.birthDate,
      notes: userData.notes,
      fatherName: userData.fatherName,
      motherName: userData.motherName,
      registrationDate: new Date().toISOString(),
      history: [{
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        type: 'REGISTRATION',
        description: 'Membro registado no sistema.'
      }],
      ...userData
    };
    setRegisteredUsers(prev => [...prev, newUser]);
    addNotification(`Gestão: ${newUser.name} cadastrado. Código: ${accessCode}`, 'Admin');
  };

  const updateMember = (id: string, updates: Partial<User>) => {
    setRegisteredUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteMember = (id: string) => {
    setRegisteredUsers(prev => prev.filter(u => u.id !== id));
  };

  const addHistoryEntry = (memberId: string, entry: Omit<HistoryEntry, 'id'>) => {
    setRegisteredUsers(prev => prev.map(u => {
      if (u.id === memberId) {
        const history = u.history || [];
        return {
          ...u,
          history: [...history, { ...entry, id: Math.random().toString(36).substr(2, 9) }]
        };
      }
      return u;
    }));
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  useEffect(() => {
    const checkTransitions = () => {
      let changed = false;
      const updatedUsers = registeredUsers.map(u => {
        if (!u.birthDate) return u;
        const age = calculateAge(u.birthDate);
        
        // DCIESA to JIESA transition
        if (u.department === 'DCIESA' && age >= 18) {
          changed = true;
          const history = u.history || [];
          // Avoid duplicate transition entries
          if (history.some(h => h.type === 'TRANSITION' && h.description.includes('JIESA'))) return u;
          
          return {
            ...u,
            department: 'JIESA',
            history: [
              ...history,
              {
                id: Math.random().toString(36).substr(2, 9),
                date: new Date().toISOString(),
                type: 'TRANSITION',
                description: `Transição automática do DCIESA para JIESA (Idade: ${age})`
              }
            ]
          };
        }
        return u;
      });

      if (changed) {
        setRegisteredUsers(updatedUsers);
      }
    };

    const timer = setTimeout(checkTransitions, 1000);
    return () => clearTimeout(timer);
  }, [registeredUsers]);

  const login = (name: string, password: string) => {
    const found = registeredUsers.find(u => u.name.toLowerCase() === name.toLowerCase() && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem('iesa_user', JSON.stringify(found));
      return { success: true };
    }
    return { success: false, message: 'Credenciais inválidas.' };
  };

  const logout = () => { setUser(null); localStorage.removeItem('iesa_user'); };
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleAccessibilityMode = () => setAccessibilityMode(prev => !prev);
  
  const updateAppIdentity = (name: string, logo: string, cover: string) => {
    setAppName(name); setAppLogo(logo); setCoverImage(cover);
    localStorage.setItem('iesa_app_name', name);
    localStorage.setItem('iesa_app_logo', logo);
    localStorage.setItem('iesa_cover_image', cover);
  };

  const addEvent = (e: any) => setEvents(p => [{ ...e, id: Math.random().toString(36).substr(2, 9) }, ...p]);
  const removeEvent = (id: string) => setEvents(p => p.filter(e => e.id !== id));
  const addSong = (s: any) => setSongs(p => [...p, { ...s, id: Math.random().toString(36).substr(2, 9) }]);
  const removeSong = (id: string) => setSongs(p => p.filter(s => s.id !== id));

  const addPrayer = (text: string) => {
    const newP = { id: Math.random().toString(36).substr(2, 9), text, date: new Date().toISOString(), isAnswered: false };
    setPrayerIntentions(prev => [newP, ...prev]);
  };

  const togglePrayer = (id: string) => {
    setPrayerIntentions(prev => prev.map(p => p.id === id ? { ...p, isAnswered: !p.isAnswered } : p));
  };

  const removePrayer = (id: string) => setPrayerIntentions(prev => prev.filter(p => p.id !== id));

  const saveSpiritualNote = (content: string) => {
    const today = new Date().toISOString().split('T')[0];
    setSpiritualNotes(prev => {
      const filtered = prev.filter(n => n.date !== today);
      return [{ id: Math.random().toString(36).substr(2, 9), date: today, content }, ...filtered];
    });
  };

  const setActiveSong = (id: string) => setActiveSongId(id);
  const toggleMusic = () => setIsMusicPlaying(prev => !prev);
  const toggleMusicLoop = () => setMusicLoop(prev => !prev);

  const addCouncilMember = (member: Member) => {
    if (!churchCouncil.find(m => m.id === member.id)) {
      setChurchCouncil(prev => [...prev, member]);
    }
  };
  const removeCouncilMember = (id: string) => setChurchCouncil(prev => prev.filter(m => m.id !== id));

  const addDeptSchedule = (s: Omit<DeptSchedule, 'id'>) => setDeptSchedules(p => [{ ...s, id: Math.random().toString(36).substr(2, 9) }, ...p]);
  const removeDeptSchedule = (id: string) => setDeptSchedules(p => p.filter(s => s.id !== id));
  
  const addBibleLesson = (l: Omit<BibleLesson, 'id'>) => setBibleLessons(p => [{ ...l, id: Math.random().toString(36).substr(2, 9) }, ...p]);
  const removeBibleLesson = (id: string) => setBibleLessons(p => p.filter(l => l.id !== id));

  const addFamily = (f: Omit<Family, 'id'>) => setFamilies(p => [{ ...f, id: Math.random().toString(36).substr(2, 9) }, ...p]);
  const updateFamily = (id: string, updates: Partial<Family>) => setFamilies(p => p.map(f => f.id === id ? { ...f, ...updates } : f));
  const removeFamily = (id: string) => setFamilies(p => p.filter(f => f.id !== id));

  const addPastoralNote = (n: Omit<PastoralNote, 'id'>) => setPastoralNotes(p => [{ ...n, id: Math.random().toString(36).substr(2, 9) }, ...p]);
  const removePastoralNote = (id: string) => setPastoralNotes(p => p.filter(n => n.id !== id));

  const addCourse = (c: Omit<Course, 'id'>) => setCourses(p => [{ ...c, id: Math.random().toString(36).substr(2, 9) }, ...p]);
  const removeCourse = (id: string) => setCourses(p => p.filter(c => c.id !== id));

  const enrollInCourse = (e: Omit<CourseEnrollment, 'id'>) => setCourseEnrollments(p => [{ ...e, id: Math.random().toString(36).substr(2, 9) }, ...p]);
  const updateEnrollmentStatus = (id: string, status: CourseEnrollment['status']) => setCourseEnrollments(p => p.map(e => e.id === id ? { ...e, status } : e));
  const removeEnrollment = (id: string) => setCourseEnrollments(p => p.filter(e => e.id !== id));

  const addCommissionMember = (cm: Omit<CommissionMember, 'id'>) => setCommissionMembers(p => [{ ...cm, id: Math.random().toString(36).substr(2, 9) }, ...p]);
  const removeCommissionMember = (id: string) => setCommissionMembers(p => p.filter(cm => cm.id !== id));

  return (
    <AuthContext.Provider value={{ 
      user, registeredUsers, churchCouncil, notifications, events, songs, appLogo, appName, coverImage, theme,
      filiais: ["Centro", "Kalongombe", "Sicar", "Alviário", "Rua 11", "Bereia"],
      prayerIntentions, spiritualNotes,
      students: [], 
      departments: DEFAULT_DEPARTMENTS,
      activityTypes: ACTIVITY_TYPES,
      accessibilityMode,
      activeSongId,
      isMusicPlaying,
      musicVolume,
      musicLoop,
      deptSchedules, bibleLessons, families, pastoralNotes,
      courses, courseEnrollments, commissionMembers,
      toggleTheme, toggleAccessibilityMode, updateAppIdentity, registerMember, updateMember, deleteMember, addHistoryEntry, login, logout, addNotification, addEvent, removeEvent, addSong, removeSong,
      addPrayer, togglePrayer, removePrayer, saveSpiritualNote, setActiveSong, toggleMusic, setMusicVolume, toggleMusicLoop,
      addCouncilMember, removeCouncilMember,
      addDeptSchedule, removeDeptSchedule, addBibleLesson, removeBibleLesson, addFamily, updateFamily, removeFamily, addPastoralNote, removePastoralNote,
      addCourse, removeCourse, enrollInCourse, updateEnrollmentStatus, removeEnrollment, addCommissionMember, removeCommissionMember
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
