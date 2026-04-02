import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Activity, 
  Database, 
  ArrowRight, 
  Stethoscope,
  Info
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Navbar - Matching Prototype */}
      <header className="fixed top-0 w-full z-50 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white via-saffron-light to-saffron-deep shadow-lg ring-2 ring-white/60 flex-shrink-0"></div>
             <div>
                <div className="font-bold text-[13px] uppercase tracking-[0.1em] text-slate-900 leading-none mb-1 font-mono">Metascale Health</div>
                <div className="text-[10px] text-saffron-deep/80 font-bold uppercase tracking-tight">Liver & Diabetes Screener</div>
             </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8 text-[13px] font-bold text-slate-600 uppercase tracking-widest">
              <a href="#features" className="hover:text-saffron-deep transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-saffron-deep transition-colors">How it works</a>
            </nav>
            <div className="flex items-center gap-4 pl-8 border-l border-slate-200">
              <Link to="/login" className="text-[13px] font-bold text-slate-900 uppercase tracking-widest hover:text-saffron-deep transition-colors">Sign In</Link>
              <Link to="/register" className="btn-secondary !py-2 !px-6 !text-xs !bg-white/40 !backdrop-blur-xl">Get Started</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Centered Layout */}
      <section className="pt-48 pb-32 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
           <div className="inline-flex items-center gap-2 bg-saffron-light/20 text-saffron-deep px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-saffron-light/30">
              <Activity size={14} /> Health Awareness Initiative
           </div>
           
           <h1 className="text-5xl lg:text-[5.5rem] font-display font-bold text-slate-900 leading-[1.05] mb-12 tracking-[-0.04em]">
              Health insight for India, <br />
              <span className="text-saffron-gradient">before</span> disease.
           </h1>
           
           <p className="text-xl text-slate-600 font-medium leading-relaxed mb-16 max-w-2xl mx-auto">
              A free, private AI risk screen for liver and diabetes — built for everyday Indians to understand their health markers.
           </p>
           
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/register" state={{ role: "patient" }} className="btn-primary min-w-[240px]">
                 Start free screening <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link to="/login" state={{ role: "doctor" }} className="btn-secondary min-w-[240px]">
                 Doctor Portal Entry
              </Link>
           </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
             <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">Precision Intelligence. Built for Humans.</h2>
             <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">Early detection is the key to longevity. Metascale combines predictive analysis with lifestyle data to keep you ahead.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                title: 'Liver Risk Assessment', 
                desc: 'Analyzes Bilirubin, proteins, and liver enzymes for signs of fatty liver or cirrhosis markers.', 
                icon: Database,
                accent: 'bg-saffron'
              },
              { 
                title: 'Metabolic Screening', 
                desc: 'Estimates diabetes risk using dietary patterns, genetic history, and metabolic indicators.', 
                icon: Stethoscope,
                accent: 'bg-green-600'
              },
              { 
                title: 'Clinical Interface', 
                desc: 'Doctors can review screenings in real-time, providing medical notes and follow-up guidance.', 
                icon: ShieldCheck,
                accent: 'bg-slate-900'
              }
            ].map((feature, i) => (
              <div key={i} className="card hover:shadow-3xl transition-all duration-300 group border-white/40">
                 <div className={`w-14 h-14 ${feature.accent} text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform`}>
                    <feature.icon size={28} />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
                 <p className="text-slate-500 font-medium leading-relaxed mb-6">{feature.desc}</p>
                 <Link to="/register" className="text-saffron-deep font-bold text-sm tracking-widest uppercase flex items-center gap-2 hover:gap-3 transition-all">Explore <ArrowRight size={14} /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-slate-900 text-white relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 border-b border-white/10 pb-16 mb-12">
            <div className="col-span-2">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-saffron shadow-lg shadow-saffron/20"></div>
                  <span className="font-display font-bold text-2xl tracking-tight">Metascale Health</span>
               </div>
               <p className="text-slate-400 font-medium max-w-sm leading-relaxed mb-8">
                  Empowering 1.4 billion people with personalized health risk awareness. Built with precision and a focus on Indian healthcare data.
               </p>
            </div>
            <div>
               <h4 className="font-bold text-sm uppercase tracking-widest text-slate-300 mb-6">Resources</h4>
               <ul className="space-y-4 text-slate-400 font-medium text-sm">
                  <li><a href="#" className="hover:text-saffron transition-colors">Clinical FAQ</a></li>
                  <li><a href="#" className="hover:text-saffron transition-colors">Privacy Charter</a></li>
                  <li><a href="#" className="hover:text-saffron transition-colors">Institutional Access</a></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold text-sm uppercase tracking-widest text-slate-300 mb-6">Portal Access</h4>
               <ul className="space-y-4 text-slate-400 font-medium text-sm">
                  <li><Link to="/login" state={{ role: 'doctor' }} className="hover:text-saffron transition-colors">Doctor Login</Link></li>
                  <li><Link to="/login" state={{ role: 'admin' }} className="hover:text-saffron transition-colors">Admin Dashboard</Link></li>
                  <li><Link to="/register" state={{ role: 'patient' }} className="hover:text-saffron transition-colors">Patient Screening</Link></li>
               </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
             <p className="text-xs text-slate-500 font-medium">© 2026 Metascale Health. All risk analyses are awareness-focused and not medical diagnoses.</p>
             <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-saffron-deep bg-saffron-light/5 px-4 py-2 rounded-full border border-saffron-light/10">
                <Info size={14} /> Knowledge Hub for Health Risk
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
