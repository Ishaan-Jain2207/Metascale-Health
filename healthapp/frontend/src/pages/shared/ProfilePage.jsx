/**
 * METASCALE HEALTH: IDENTITY PERSISTENCE HUB (ProfilePage.jsx)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This component acts as the 'Single Source of Truth' for patient and doctor 
 * identities. It manages the synchronization between the global AuthContext, 
 * the local component state, and the persistent clinical repository.
 * 
 * ─── CLINICAL SYNCHRONIZATION LOGIC ─────────────────────────────────────────
 * The profile is partitioned into three specialized domains:
 *   1. IDENTITY CLUSTER: Name, Email (Immutable Clinical ID), and Account Type.
 *   2. BIOMETRIC CLUSTER: Age and Biological Gender markers used to refine 
 *      screening accuracy.
 *   3. SECURITY DOMAIN: Hardened credential rotation (SHA-256 password sync).
 * 
 * ─── DATA PERSISTENCE FLOW ──────────────────────────────────────────────────
 *   - HYDRATION: On mount, the component pulls current identity from 
 *     the AuthContext.
 *   - SYNCHRONIZATION: Dispatches PUT requests to the authorization endpoint 
 *     and simultaneously updates the local browser storage via AuthContext 
 *     to ensure zero-lag identity propagation.
 * 
 * ─── HIGH-FIDELITY DESIGN ───────────────────────────────────────────────────
 * Utilizes a 'Glassmorphic Clinical' design with Framer Motion animations 
 * (staggered entry), high-contrast accessibility (slate-900), and 
 * semantic status indicators (Saffron fill).
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  Lock, 
  Phone, 
  ShieldCheck, 
  Mail, 
  Calendar, 
  Camera, 
  Star,
  Zap,
  Loader2,
  CheckCircle2,
  AlertCircle,
  CircleUser as UserCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ProfilePage = () => {
  const { user, updateUserInfo } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // ─── IDENTITY STATE ───────────────────────────────────────────────────────
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    age: user?.age || '',
    gender: user?.gender || 'male',
    specialization: user?.specialization || ''
  });

  // ─── SECURITY STATE ───────────────────────────────────────────────────────
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  /**
   * IDENTITY SYNCHRONIZATION (handleProfileUpdate)
   * Logic: Dispatches profile mutations to the clinical oracle.
   */
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.data.success) {
        updateUserInfo(res.data.data);
        setSuccess('Clinical identity synchronized successfully.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Synchronization protocol failure.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * SECURITY HARDENING (handlePasswordChange)
   * Logic: Rotates cryptographic access signatures.
   */
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Credential mismatch: Confirmation signature does not match.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.put('/auth/change-password', passwordData);
      if (res.data.success) {
        setSuccess('Security credentials rotated and hardened.');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Access rotation protocol failed.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-20 max-w-6xl mx-auto"
    >
      {/* IDENTITY HEADER */}
      <motion.div variants={itemVariants} className="relative bg-slate-900 rounded-[48px] p-10 md:p-16 text-white shadow-2xl border border-white/5 overflow-hidden">
         <div className="absolute -top-24 -left-24 w-64 h-64 bg-saffron/10 blur-[120px]"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-32 h-32 md:w-44 md:h-44 bg-white/10 rounded-[40px] flex items-center justify-center border border-white/20 shadow-2xl relative group overflow-hidden">
               <span className="text-6xl font-black">{user?.full_name?.charAt(0)}</span>
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                  <Camera size={24} /> <span className="text-[10px] font-black uppercase mt-2">Edit</span>
               </div>
            </div>
            <div className="text-center md:text-left">
               <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                  <Star size={14} className="text-saffron" /> Verified {user?.role}
               </div>
               <h1 className="text-4xl md:text-6xl font-black tracking-tight">{user?.full_name}</h1>
               <p className="text-white/40 font-medium text-lg mt-2 flex items-center justify-center md:justify-start gap-4 uppercase tracking-widest text-[9px]">
                  <Mail size={16} /> {user?.email} • <Calendar size={16} /> Joined {new Date(user?.created_at).toLocaleDateString()}
               </p>
            </div>
         </div>
      </motion.div>

      <AnimatePresence>
        {(error || success) && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`p-6 rounded-[32px] border flex gap-4 ${error ? 'bg-red-50 border-red-100 text-red-600' : 'bg-green-50 border-green-100 text-green-600'}`}>
             {error ? <AlertCircle /> : <CheckCircle2 />}
             <p className="font-black uppercase tracking-widest text-xs">{error || success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-12">
         {/* SIDEBAR: NAVIGATION */}
         <div className="lg:col-span-1 space-y-8">
             <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Clinical Settings</h3>
                <div className="space-y-4">
                   <SidebarItem icon={<User size={18} />} label="Identity" active />
                   <SidebarItem icon={<Phone size={18} />} label="Contact" />
                   <SidebarItem icon={<Lock size={18} />} label="Security" />
                   <SidebarItem icon={<Settings size={18} />} label="Preferences" />
                </div>
             </div>
             <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform"><ShieldCheck size={200} /></div>
                <h4 className="font-black text-2xl uppercase tracking-tighter mb-4">Secure Storage</h4>
                <p className="text-white/70 text-xs italic mb-8">Metascale employs industry-standard encryption for diagnostic data integrity.</p>
                <button className="bg-white text-slate-900 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">Privacy Policy</button>
             </div>
         </div>

         {/* MAIN: CONFIGURATION FORMS */}
         <div className="lg:col-span-2 space-y-12">
            <motion.section variants={itemVariants} className="space-y-6">
               <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">Clinical Identity <div className="h-px flex-1 bg-slate-100"></div></h3>
               <div className="bg-white p-10 rounded-[48px] shadow-2xl border border-slate-100">
                  <form onSubmit={handleProfileUpdate} className="space-y-10">
                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Legal Name</label>
                           <input type="text" value={profileData.full_name} onChange={(e) => setProfileData({...profileData, full_name: e.target.value})} className="input-field" />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical ID (Email)</label>
                           <input type="email" value={profileData.email} disabled className="input-field bg-slate-50 cursor-not-allowed text-slate-400" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Age</label>
                              <input type="number" value={profileData.age} onChange={(e) => setProfileData({...profileData, age: e.target.value})} className="input-field" />
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bio Gender</label>
                              <select value={profileData.gender} onChange={(e) => setProfileData({...profileData, gender: e.target.value})} className="input-field">
                                 <option value="male">Male</option><option value="female">Female</option>
                              </select>
                           </div>
                        </div>
                        {user?.role === 'doctor' && (
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expertise</label>
                              <input type="text" value={profileData.specialization} onChange={(e) => setProfileData({...profileData, specialization: e.target.value})} className="input-field" />
                           </div>
                        )}
                     </div>
                     <div className="flex justify-end pt-4">
                        <button type="submit" disabled={loading} className="btn-primary px-12 py-5 font-black text-[10px] uppercase tracking-widest flex items-center gap-4">
                           {loading ? <Loader2 className="animate-spin" /> : <Zap size={20} />} Sync Identity
                        </button>
                     </div>
                  </form>
               </div>
            </motion.section>

            <motion.section variants={itemVariants} className="space-y-6">
               <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">Security Matrix <div className="h-px flex-1 bg-slate-100"></div></h3>
               <div className="bg-slate-900 p-10 rounded-[48px] shadow-2xl border border-white/5 text-white">
                  <form onSubmit={handlePasswordChange} className="space-y-10">
                     <div className="space-y-4 max-w-sm">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Current Signature</label>
                        <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} required className="input-field bg-white/5 border-white/10 text-white" />
                     </div>
                     <div className="grid md:grid-cols-2 gap-8 border-t border-white/5 pt-10">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">New Credential</label>
                           <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} required className="input-field bg-white/5 border-white/10 text-white" />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Confirm Credential</label>
                           <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} required className="input-field bg-white/5 border-white/10 text-white" />
                        </div>
                     </div>
                     <div className="flex justify-end pt-4">
                        <button type="submit" disabled={loading} className="px-12 py-5 bg-white text-slate-900 rounded-[24px] font-black uppercase tracking-widest hover:bg-saffron hover:text-white transition-all">
                           Update Security Matrix
                        </button>
                     </div>
                  </form>
               </div>
            </motion.section>
         </div>
      </div>
    </motion.div>
  );
};

const SidebarItem = ({ icon, label, active }) => (
  <button className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${active ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
     {icon} {label}
  </button>
);

export default ProfilePage;
