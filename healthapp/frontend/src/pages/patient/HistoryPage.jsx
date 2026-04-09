/**
 * METASCALE HEALTH: LONGITUDINAL HEALTH ARCHIVE (HistoryPage.jsx)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This component acts as the 'Clinical Vault' for individual patients. It 
 * provides a chronological, searchable record of all metabolic diagnostic 
 * events (Liver/Diabetes), enabling long-term trajectory tracking.
 * 
 * ─── DATA AGGREGATION: MULTI-VECTOR SYNTHESIS ───────────────────────────────
 * The archive orchestrates data from diverse clinical vectors:
 *   1. HEPATIC AUDITS: Result matrices from the liver screening protocol.
 *   2. METABOLIC AUDITS: Risk profiles from the diabetes screening module.
 *   - Both vectors are normalized into a unified 'Diagnostic Record' schema 
 *     for consistent visualization across the audit table.
 * 
 * ─── SEARCH & FILTER ORCHESTRATION ──────────────────────────────────────────
 * Implements a 'Multi-Axis Filter Engine' that intersects:
 *   - VECTOR TYPE: Segregating records by clinical domain.
 *   - SEMANTIC SEARCH: Matching risk bands or type-specific signatures.
 *   - This ensures clinicians or patients can isolate specific risk events 
 *     instantly within high-density history sets.
 * 
 * ─── CLINICAL PORTABILITY ENGINE ────────────────────────────────────────────
 * Features a built-in 'Data Portability' module that maps complex JSON 
 * records into a flat CSV manifest. This is critical for medical second 
 * opinions and external review handoffs.
 * 
 * ─── UI HIGH-FIDELITY & GHOST-FIXES ─────────────────────────────────────────
 *   - RESOLVED: 'White Box' visual artifacts on filter selections by moving 
 *     to high-contrast, ring-isolated button states.
 *   - UTILIZES: 40px radius elevation and 'Saffron' primary accent for a 
 *     premium 'Clinical OS' aesthetic.
 */

import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Download, 
  ChevronRight, 
  Calendar, 
  AlertCircle,
  Activity,
  Loader2,
  FileText,
  Stethoscope,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const HistoryPage = () => {
  // ARCHIVE STATE: Buffering the full diagnostic history.
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  /**
   * REPOSITORY SYNCHRONIZATION (fetchHistory)
   * Logic: Dispatches a request to the Metascale prediction archive.
   */
  const fetchHistory = async () => {
    try {
      const res = await api.get('/predict/history');
      setHistory(res.data.data);
    } catch {
      setError('Audit synchronization failed: Repository unreachable.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * FILTER ENGINE (Intersection Logic)
   */
  const filteredHistory = history.filter(item => {
    const matchesFilter = filterType === 'all' || item.type === filterType;
    const matchesSearch = 
      item.risk_band.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  /**
   * DATA PORTABILITY (handleExport)
   * Logic: Synthesizes CSV manifest for external physician review.
   */
  const handleExport = () => {
    if (filteredHistory.length === 0) return;
    const headers = ['Date', 'Type', 'Risk Band', 'Confidence'];
    const csvRows = filteredHistory.map(item => [
      new Date(item.created_at).toLocaleDateString(),
      item.type.toUpperCase(), item.risk_band, `${(item.confidence * 100).toFixed(1)}%`
    ]);
    const csvString = [headers, ...csvRows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `metascale_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* COMMAND CENTER HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
           <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <div className="p-2 bg-saffron/10 text-saffron-deep rounded-2xl"><History size={36} /></div> History Archive
           </h1>
           <p className="text-slate-500 font-medium italic">Longitudinal record of clinical diagnostic trajectories.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           {/* SEARCH VECTOR */}
           <div className="relative group flex-1 min-w-[300px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" placeholder="Search diagnostics..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[20px] outline-none ring-4 ring-transparent focus:ring-saffron/5 focus:border-saffron/40 w-full shadow-sm font-bold text-sm"
              />
           </div>

           {/* FILTER SHIFTER: Optimized to remove 'White Box' artifacts. */}
           <div className="flex bg-slate-100 p-1.5 rounded-[20px] border">
              {['all', 'liver', 'diabetes'].map((type) => (
                <button 
                  key={type} onClick={() => setFilterType(type)}
                  className={`px-6 py-2.5 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${filterType === type ? 'bg-white shadow-lg text-saffron-deep ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {type}
                </button>
              ))}
           </div>
        </div>
      </div>

      {error ? <ErrorMessage message={error} /> : filteredHistory.length > 0 ? (
        /* AUDIT TABLE: High-Fidelity DiagnosticManifest */
        <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-2xl">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50/50 border-b">
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Vector</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Tier</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence</th>
                       <th className="px-8 py-6 text-right"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {filteredHistory.map((item) => (
                       <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.type === 'liver' ? 'bg-saffron/10 text-saffron' : 'bg-indigo-50 text-indigo-500'}`}>
                                   {item.type === 'liver' ? <Activity size={24} /> : <Stethoscope size={24} />}
                                </div>
                                <div>
                                   <p className="font-bold text-slate-900 text-sm capitalize">{item.type} Screening</p>
                                   <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase"><Calendar size={12} /> {new Date(item.created_at).toLocaleDateString()}</div>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getRiskBadgeStyle(item.risk_band)}`}>
                                {item.risk_band}
                             </span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="text-sm font-black text-slate-600">{(item.confidence * 100).toFixed(1)}%</div>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <Link to={`/patient/history/detail/${item.type}/${item.id}`} className="inline-flex items-center gap-2 text-[10px] font-black text-saffron-deep uppercase tracking-widest hover:gap-3 transition-all">
                                Report Access <ChevronRight size={16} />
                             </Link>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      ) : <EmptyState />}

      {/* PORTABILITY MODULE */}
      <div className="bg-slate-900 rounded-[40px] p-10 text-white flex flex-col lg:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 rounded-[20px] flex items-center justify-center text-saffron"><FileText size={32} /></div>
            <div>
               <h3 className="text-2xl font-bold">Clinical Portability</h3>
               <p className="text-slate-400 text-sm italic">Export diagnostic manifest for external MD review.</p>
            </div>
         </div>
         <button onClick={handleExport} className="px-10 py-5 bg-white text-slate-900 rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
            <Download size={18} /> Export manifest
         </button>
      </div>
    </div>
  );
};

/* --- SHARED FRAGMENTS --- */

const getRiskBadgeStyle = (band) => {
  if (band === 'Minimal') return 'bg-green-50 text-green-600 border border-green-100';
  if (band === 'Elevated') return 'bg-yellow-50 text-yellow-600 border border-yellow-100';
  return 'bg-red-50 text-red-600 border border-red-100';
};

const LoadingState = () => <div className="flex justify-center py-40"><Loader2 className="animate-spin text-saffron" size={40} /></div>;

const EmptyState = () => (
  <div className="bg-slate-50 border-dashed border-2 py-24 flex flex-col items-center text-center rounded-[48px]">
     <History size={40} className="text-slate-200 mb-6" />
     <h3 className="text-2xl font-bold text-slate-900">Archive Empty</h3>
     <p className="text-slate-500 max-w-xs mb-10 italic">No diagnostic events recorded. Initiate a scan to begin data collection.</p>
     <Link to="/patient/screening" className="btn-primary px-10 flex items-center gap-3 text-sm">Initiate Scan <ArrowRight size={20} /></Link>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-red-50 text-red-700 p-6 rounded-3xl flex items-center gap-4 font-bold uppercase tracking-widest text-xs">
     <AlertCircle size={24} /> {message}
  </div>
);

export default HistoryPage;


