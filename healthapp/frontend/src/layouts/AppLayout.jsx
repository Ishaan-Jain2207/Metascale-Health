import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  UserCircle, 
  ClipboardList, 
  History, 
  LogOut, 
  Menu, 
  X, 
  Stethoscope, 
  Users, 
  BarChart3,
  CalendarCheck,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
/* eslint-enable no-unused-vars */

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = {
    patient: [
      { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
      { name: 'Screening', path: '/patient/screening', icon: ClipboardList },
      { name: 'History', path: '/patient/history', icon: History },
      { name: 'Appointments', path: '/patient/appointments', icon: CalendarCheck },
      { name: 'Profile', path: '/patient/profile', icon: UserCircle },
    ],
    doctor: [
      { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
      { name: 'Patients', path: '/doctor/patients', icon: Users },
      { name: 'Schedule', path: '/doctor/appointments', icon: CalendarCheck },
      { name: 'Profile', path: '/doctor/profile', icon: UserCircle },
    ],
    admin: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Doctors', path: '/admin/doctors', icon: Stethoscope },
      { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
      { name: 'Profile', path: '/admin/profile', icon: UserCircle },
    ]
  };

  const navItems = menuItems[user?.role] || [];

  return (
    <div className="min-h-screen bg-ink flex overflow-x-hidden text-white selection:bg-saffron/30">
      {/* High-Contrast Mesh Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-saffron/5 blur-[120px] rounded-full opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-white/[0.02] blur-[100px] rounded-full opacity-20"></div>
      </div>

      {/* Sidebar for Desktop & Tablet */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-ink-mid border-r border-white/5 transform transition-transform duration-500 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-5xl`}>
        <div className="h-full flex flex-col relative z-10">
          <div className="p-10 flex flex-col gap-6 border-b border-white/5">
            <Link to="/" className="flex items-center gap-4 group">
               <div className="w-12 h-12 rounded-2xl bg-saffron flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Activity className="text-ink" size={24} />
               </div>
               <div>
                  <h1 className="font-display font-black text-xl tracking-tight uppercase leading-none">Metascale</h1>
                  <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.4em] mt-1">Terminal Hub</p>
               </div>
            </Link>
          </div>

          <nav className="flex-1 px-6 py-10 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-6 py-4 rounded-[24px] group transition-all duration-300 ${
                  location.pathname === item.path 
                    ? 'bg-saffron text-ink shadow-2xl' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <div className="flex items-center gap-4">
                   <item.icon size={20} className={location.pathname === item.path ? 'text-ink' : 'group-hover:text-saffron transition-colors'} />
                   <span className="font-black text-[10px] uppercase tracking-widest">{item.name}</span>
                </div>
                {location.pathname === item.path && <ChevronRight size={14} />}
              </Link>
            ))}
          </nav>

          <div className="p-8 border-t border-white/5 bg-white/[0.02]">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-4 px-6 py-4 text-white/20 hover:text-rose-400 hover:bg-rose-500/10 rounded-[20px] transition-all group font-black text-[10px] uppercase tracking-[0.3em]"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span>Detach Identifier</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Header - High-Contrast Dark Glass */}
        <header className="h-24 glass-dark !bg-ink/60 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between px-6 md:px-12 sticky top-0 z-40">
          <div className="flex items-center gap-6">
             <button 
               className="md:hidden w-12 h-12 bg-white/5 text-white/60 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-xl"
               onClick={() => setIsSidebarOpen(true)}
             >
               <Menu size={24} />
             </button>
             <div className="hidden lg:flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                <Zap size={14} className="text-saffron animate-pulse" /> Personnel Node {user?.role?.toUpperCase()} Active
             </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="text-right hidden sm:block">
                <div className="text-[11px] font-black text-white uppercase tracking-widest">{user?.full_name}</div>
                <div className="text-[9px] text-saffron/40 font-black uppercase tracking-[0.3em] italic">{user?.role}</div>
             </div>
             <motion.div 
               whileHover={{ scale: 1.1 }}
               className="w-14 h-14 bg-white/5 border border-white/10 text-saffron rounded-[20px] flex items-center justify-center font-black text-xl shadow-4xl cursor-pointer"
             >
               {user?.full_name?.charAt(0)}
             </motion.div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 md:p-12 overflow-x-hidden">
           {children}
        </main>
        
        {/* Global Footer - System Integrity */}
        <footer className="footer bg-transparent border-t border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40 grayscale select-none">
           <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-saffron" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Protocol Verification Active</span>
           </div>
           <div className="text-[10px] font-black uppercase tracking-widest text-white/20">
              © 2026 Metascale Network Hub. All Clinical Vectors Secured.
           </div>
        </footer>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/80 backdrop-blur-xl z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;
