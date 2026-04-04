import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowLeft, 
  Download, 
  Printer, 
  Share2,
  Calendar,
  ClipboardList,
  Info,
  ChevronRight,
  Activity,
  Loader2
} from 'lucide-react';
import api from '../../services/api';

const PredictionResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state || {}; // Using destructuring as per original
  const type = location.state?.type;
  const [aiInsights, setAiInsights] = React.useState('');
  const [loadingAi, setLoadingAi] = React.useState(false);
  const [aiError, setAiError] = React.useState('');

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
           <ClipboardList size={40} />
        </div>
        <div className="space-y-2">
           <h2 className="text-2xl font-bold text-slate-900">No Result Found</h2>
           <p className="text-slate-500 max-w-sm">We couldn't find any screening result in this session. Please start a new screening.</p>
        </div>
        <Link to="/patient/screening" className="btn-primary flex items-center gap-2 px-8">
           <ArrowLeft size={18} /> Back to Screening Portal
        </Link>
      </div>
    );
  }

  const getRiskColor = (band) => {
    switch (band) {
      case 'Minimal': return 'bg-green-100 text-green-700 border-green-200';
      case 'Elevated': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Severe': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getRiskIcon = (band) => {
    if (band === 'Minimal') return <CheckCircle2 className="text-green-600" size={32} />;
    if (band === 'Elevated') return <AlertTriangle className="text-yellow-600" size={32} />;
    return <XCircle className="text-red-600" size={32} />;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateAI = async () => {
    setLoadingAi(true);
    setAiError('');
    try {
       const res = await api.post('/predict/explain', {
          type,
          data: result.features || {},
          result: {
             riskBand: result.riskBand,
             interpretation: result.interpretation,
             confidence: result.confidence
          }
       });
       setAiInsights(res.data.data.explanation);
    } catch (err) {
       setAiError('Failed to generate clinical AI review. Please try again later.');
    } finally {
       setLoadingAi(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Metascale Health - ${type.toUpperCase()} Screening Report`,
          text: `My ${type} screening result is ${result.riskBand}. View clinical details on the platform.`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Report link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 print:p-0">
      <div className="flex items-center justify-between print:hidden">
        <Link to="/patient/dashboard" className="text-slate-500 font-bold hover:text-primary-600 flex items-center gap-2 transition-colors">
          <ArrowLeft size={18} /> Return to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={handleShare} className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
             <Share2 size={16} /> Share
          </button>
          <button onClick={handlePrint} className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm !border-slate-300">
             <Printer size={16} /> Print Report
          </button>
          <button onClick={handlePrint} className="btn-primary flex items-center gap-2 px-4 py-2 text-xs !bg-saffron !border-saffron-deep hover:!bg-saffron-deep shadow-md">
             <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      {/* Main Result Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200 print:shadow-none print:border-none">
         <div className="bg-slate-900 text-white p-8 lg:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
               <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-saffron text-xs font-bold uppercase tracking-widest">
                     Screening Analysis Complete
                  </div>
                  <h1 className="text-4xl font-display font-bold">Metascale Health Report</h1>
                  <p className="text-slate-400 font-medium">Screening Type: <span className="text-white capitalize">{type} Disease Risk</span> • {new Date().toLocaleDateString()}</p>
               </div>
               <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center md:min-w-[180px]">
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">Confidence Score</p>
                  <p className="text-4xl font-display font-bold text-saffron">{(result.confidence * 100).toFixed(1)}%</p>
               </div>
            </div>
         </div>

         <div className="p-8 lg:p-12 space-y-12 bg-white">
            {/* Risk Assessment */}
            <div className="grid md:grid-cols-5 gap-8 items-center">
               <div className="md:col-span-2 flex flex-col items-center text-center space-y-4 p-8 rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50/50">
                  <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center">
                     {getRiskIcon(result.riskBand)}
                  </div>
                  <div>
                     <p className="text-xs text-slate-500 font-bold uppercase mb-1">Risk Band</p>
                     <p className={`text-2xl font-bold py-1 px-4 rounded-full border ${getRiskColor(result.riskBand)}`}>
                        {result.riskBand} Risk
                     </p>
                  </div>
               </div>
               
               <div className="md:col-span-3 space-y-4">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Interpretation</h2>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed font-medium text-lg">
                     "{result.interpretation}"
                  </div>
               </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-6">
               <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="text-saffron" /> Recommendations & Next Steps
               </h3>
               <div className="grid md:grid-cols-2 gap-4">
                  {result.recommendations && result.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all group">
                       <div className="shrink-0 w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                          {i + 1}
                       </div>
                       <p className="text-slate-700 font-medium leading-relaxed group-hover:text-slate-900">{rec}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* AI Clinical Insights Section */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                     <Activity size={20} className="text-saffron-deep" /> AI Clinical Insights Review
                  </h3>
                  {!aiInsights && !loadingAi && (
                    <button 
                      onClick={handleGenerateAI}
                      className="text-xs font-bold font-sans uppercase tracking-widest text-primary-600 bg-primary-50 px-4 py-2.5 rounded-xl hover:bg-primary-100 transition-all shadow-sm active:scale-95"
                    >
                       Generate Detailed AI Review
                    </button>
                  )}
               </div>

               {loadingAi ? (
                 <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 animate-pulse flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="animate-spin text-saffron" size={32} />
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Synthesizing Patient Profile Analysis...</p>
                 </div>
               ) : aiError ? (
                 <div className="p-6 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-sm font-medium flex items-center gap-3">
                    <AlertTriangle size={18} /> {aiError}
                 </div>
               ) : aiInsights ? (
                 <div className="prose prose-slate max-w-none bg-slate-900 text-slate-100 p-8 rounded-3xl border border-slate-800 shadow-xl font-medium leading-relaxed animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex items-center gap-2 text-saffron text-xs font-black uppercase tracking-widest mb-6">
                       <CheckCircle2 size={14} /> AI Report Ready
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-slate-200">
                       {aiInsights}
                    </pre>
                 </div>
               ) : (
                 <div className="bg-slate-50 rounded-2xl p-10 border border-slate-100 border-dashed text-center">
                    <p className="text-slate-500 font-medium mb-1">Detailed AI analysis is available for this screening.</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Calculates clinical observations based on your specific biomarkers.</p>
                 </div>
               )}
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-4 p-6 bg-saffron/5 rounded-2xl border border-saffron/20 text-slate-700">
               <Info className="shrink-0 mt-0.5 text-saffron-deep" size={20} />
               <p className="text-sm font-medium leading-relaxed italic">
                  <strong>Clinical Advisory:</strong> This risk profile is generated by a clinical-grade predictive model. It is not a medical diagnosis. Please present this report to a qualified professional.
               </p>
            </div>
         </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between py-6 print:hidden">
         <div className="flex items-center gap-6">
            <Link 
              to="/patient/appointments" 
              state={{ prefill: { type, risk: result.riskBand } }}
              className="flex items-center gap-2 text-saffron font-bold hover:underline"
            >
               Schedule Consultation <ChevronRight size={16} />
            </Link>
            <Link to="/patient/history" className="flex items-center gap-2 text-slate-600 font-bold hover:underline">
               View Full History <ChevronRight size={16} />
            </Link>
         </div>
         <Link to="/patient/dashboard" className="btn-primary px-8">
            Return to My Dashboard
         </Link>
      </div>
    </div>
  );
};

export default PredictionResult;
