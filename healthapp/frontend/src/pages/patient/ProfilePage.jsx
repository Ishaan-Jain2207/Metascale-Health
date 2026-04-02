import React, { useState } from 'react';
import { 
  UserCircle, 
  Mail, 
  Phone, 
  Lock, 
  ShieldCheck, 
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    age: user?.age || '',
    gender: user?.gender || '',
    phone: user?.phone || '',
    hospital: user?.hospital || '',
    specialization: user?.specialization || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.put('/auth/update', profileData);
      if (res.data.success) {
        setUser(res.data.data);
        setSuccess('Profile updated successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setError('New passwords do not match');
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.put('/auth/change-password', passwordData);
      if (res.data.success) {
        setSuccess('Password changed successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <UserCircle className="text-primary-600" /> Account Settings
           </h1>
           <p className="text-slate-500 font-medium">Manage your personal profile and security preferences.</p>
        </div>
      </div>

      {(error || success) && (
        <div className={`p-4 rounded-2xl border flex items-center gap-4 animate-in slide-in-from-top-4 duration-300 ${error ? 'bg-red-50 border-red-100 text-red-700' : 'bg-green-50 border-green-100 text-green-700'}`}>
           {error ? <AlertCircle /> : <CheckCircle2 />}
           <p className="font-bold">{error || success}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-12">
         {/* Left Column: Profile Card */}
         <div className="lg:col-span-1 space-y-8">
            <div className="card text-center relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-24 bg-primary-600 opacity-5 group-hover:opacity-10 transition-opacity"></div>
               <div className="relative pt-8 pb-4">
                  <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-4xl mx-auto shadow-xl shadow-primary-50 mb-4 border-4 border-white">
                     {user?.full_name?.charAt(0)}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{user?.full_name}</h2>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">{user?.role}</p>
               </div>
               
               <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600 px-4">
                     <Mail size={16} className="text-slate-400" />
                     <span className="truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600 px-4">
                     <Calendar size={16} className="text-slate-400" />
                     <span>Member since {new Date(user?.created_at).getFullYear()}</span>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6">
               <div className="flex items-center gap-3">
                  <ShieldCheck className="text-primary-400" />
                  <h3 className="font-bold">Privacy Control</h3>
               </div>
               <p className="text-sm text-slate-400 leading-relaxed font-medium">Your data is stored securely using industry-standard AES-256 encryption. We never share results without explicit consent.</p>
               <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                  <Settings size={16} /> Privacy Policy
               </button>
            </div>
         </div>

         {/* Right Column: Forms */}
         <div className="lg:col-span-2 space-y-12">
            {/* Profile Update Section */}
            <section className="space-y-6">
               <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Personal Information
               </h3>
               <form onSubmit={handleProfileUpdate} className="card p-8 lg:p-10 space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                        <input 
                          type="text" 
                          value={profileData.full_name}
                          onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                        <input 
                          type="email" 
                          value={profileData.email} disabled
                          className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Age</label>
                           <input 
                             type="number" 
                             value={profileData.age}
                             onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                             className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gender</label>
                           <select 
                             value={profileData.gender}
                             onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                             className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                           >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                           </select>
                        </div>
                     </div>
                     {user?.role === 'doctor' && (
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Specialization</label>
                           <input 
                             type="text" 
                             value={profileData.specialization}
                             onChange={(e) => setProfileData({...profileData, specialization: e.target.value})}
                             className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                           />
                        </div>
                     )}
                  </div>
                  <div className="flex justify-end">
                     <button type="submit" disabled={loading} className="btn-primary px-10 py-3 flex items-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                        {!loading && <ArrowRight size={18} />}
                     </button>
                  </div>
               </form>
            </section>

            {/* Password Section */}
            <section className="space-y-6">
               <h3 className="text-xl font-bold text-slate-900">Security & Password</h3>
               <form onSubmit={handlePasswordChange} className="card p-8 lg:p-10 space-y-8 border-l-4 border-l-slate-900">
                  <div className="space-y-6">
                     <div className="space-y-2 max-w-sm">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Password</label>
                        <input 
                          type="password" 
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          required
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900"
                        />
                     </div>
                     <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Password</label>
                           <input 
                             type="password" 
                             value={passwordData.newPassword}
                             onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                             required minLength={6}
                             className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Confirm New</label>
                           <input 
                             type="password" 
                             value={passwordData.confirmPassword}
                             onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                             required
                             className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900"
                           />
                        </div>
                     </div>
                  </div>
                  <div className="flex justify-end">
                     <button type="submit" disabled={loading} className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 disabled:bg-slate-400 flex items-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : 'Update Security Credentials'}
                     </button>
                  </div>
               </form>
            </section>
         </div>
      </div>
    </div>
  );
};

export default ProfilePage;
