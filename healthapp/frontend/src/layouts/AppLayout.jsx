/**
 * APP LAYOUT (Clinical Operating System Shell)
 * Purpose: Provides a persistent navigation frame and systemic branding for authenticated users.
 * Logic: 
 *   - Orchestrates a responsive dual-pane layout (Sidebar + Main Content).
 *   - Implements Role-Based Navigation: Dynamically generates the menu based on user identity.
 *   - Manages the 'Identity Module' (Profile Dropdown) and 'System Telemetry' visuals.
 */
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
  ShieldCheck, 
  Users, 
  BarChart3,
  CalendarCheck,
  Zap,
  Bell,
  ChevronDown,
  Settings,
  Activity,
  Calendar,
  User
} from 'lucide-react';

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ─── NAVIGATION SCHEMA ────────────────────────────────────────────────────
  
  /**
   * Logic: The menu is partitioned by Role Tiers to ensure clinicians and patients 
   * see only relevant operational nodes.
   */
  const menuItems = {
    patient: [
      { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
      { name: 'Screening Portal', path: '/patient/screening', icon: Activity },
      { name: 'Consultations', path: '/patient/appointments', icon: Calendar },
      { name: 'Medical History', path: '/patient/history', icon: History },
      { name: 'My Profile', path: '/patient/profile', icon: UserCircle },
    ],
    doctor: [
      { name: 'Clinical Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
      { name: 'Patient Roster', path: '/doctor/patients', icon: Users },
      { name: 'Clinical Schedule', path: '/doctor/appointments', icon: CalendarCheck },
      { name: 'Specialist Profile', path: '/doctor/profile', icon: UserCircle },
    ],
    admin: [
      { name: 'System Overview', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Provider Mgmt', path: '/admin/doctors', icon: Stethoscope },
      { name: 'Deep Analytics', path: '/admin/analytics', icon: BarChart3 },
      { name: 'Admin Profile', path: '/admin/profile', icon: UserCircle },
    ]
  };

  const activeMenu = menuItems[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFE] flex">
      {/* ─── SIDEBAR NAVIGATION ──────────────────────────────────────────────── */}
      {/* Logic: Fixed positioning on mobile with transition transforms for the 'Slide-in' feel. */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          {/* Brand Identity Slot */}
          <div className="flex items-center gap-3 px-2 mb-12">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200 rotate-3">
               <ShieldCheck size={24} />
            </div>
            <span className="text-xl font-display font-bold text-slate-900 tracking-tight">Metascale <span className="text-primary-600">Health</span></span>
          </div>

          <nav className="flex-1 space-y-2">
            {activeMenu.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-200 group ${
                  location.pathname === item.path 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon size={20} className={location.pathname === item.path ? 'text-saffron' : 'text-slate-400 group-hover:text-primary-600'} />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* System Integrity Badge (Aesthetic Telemetry) */}
          <div className="mt-auto p-6 bg-slate-900 rounded-[32px] relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Zap size={64}/></div>
             <p className="text-[10px] text-primary-400 font-black uppercase tracking-[0.2em] mb-2">System Status</p>
             <h4 className="text-white font-bold text-sm mb-1">Compute Core Active</h4>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-none">Global Latency: 14ms</span>
             </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ──────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <button className="lg:hidden p-2 text-slate-500" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>

          <div className="flex-1 hidden md:block">
             <div className="relative max-w-md">
                <Bell size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300" />
                <span className="pl-8 text-xs font-black text-slate-400 uppercase tracking-widest">Protocol Version v4.22.8</span>
             </div>
          </div>

          {/* ─── IDENTITY MODULE ────────────────────────────────────────────── */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{user?.full_name}</span>
              <span className="text-[10px] text-primary-600 font-black uppercase tracking-widest">{user?.role} Portal</span>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 active:scale-95"
              >
                <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-primary-500 shadow-lg shadow-primary-200 flex items-center justify-center text-white font-black text-sm">
                   {user?.full_name?.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Logic: Self-contained identity menu. */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-50 mb-2">
                     <p className="font-bold text-slate-900 text-sm truncate">{user?.email}</p>
                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Verified Clinical Identity</p>
                  </div>
                  <Link to={user?.role === 'doctor' ? '/doctor/profile' : '/patient/profile'} onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-700 transition-colors">
                    <Settings size={18} className="text-slate-400" /> Account Settings
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-sm font-bold text-red-600 transition-colors">
                    <LogOut size={18} /> Secure Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Scroll Area */}
        <div className="p-6 lg:p-10 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default AppLayout;

