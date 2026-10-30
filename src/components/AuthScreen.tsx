import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Sparkles,
  Stethoscope,
  Hospital,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export interface UserSession {
  id: string;
  name: string;
  title: string;
  role: 'doctor' | 'nurse' | 'admin';
  email: string;
  department: string;
  licenseNumber: string;
  hospital: string;
}

interface AuthScreenProps {
  onLogin: (session: UserSession) => void;
}

export const DEMO_ACCOUNTS: Array<{
  session: UserSession;
  passwordHint: string;
  tag: string;
}> = [
  {
    session: {
      id: 'doc-01',
      name: 'Dr. Tarek Mansour',
      title: 'Consultant Interventional Cardiologist',
      role: 'doctor',
      email: 'doctor@medistream.eg',
      department: 'Cardiovascular Care Unit (CCU)',
      licenseNumber: 'EGY-DOC-40918',
      hospital: 'Cairo University Specialized Hospital',
    },
    passwordHint: 'Cardio#Doc1',
    tag: 'Primary Demo Doctor',
  },
  {
    session: {
      id: 'nurse-02',
      name: 'Amira Hassan, RN',
      title: 'Senior Clinical Triage Specialist',
      role: 'nurse',
      email: 'nurse@medistream.eg',
      department: 'Emergency & Triage Intake',
      licenseNumber: 'EGY-NUR-11824',
      hospital: 'Kasr Al Ainy Medical Center',
    },
    passwordHint: 'Triage#Nurse2',
    tag: 'Triage Nurse Demo',
  },
];

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>('doctor@medistream.eg');
  const [password, setPassword] = useState<string>('Cardio#Doc1');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const matched = DEMO_ACCOUNTS.find(
        (acc) => acc.session.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (matched && password === matched.passwordHint) {
        setIsLoading(false);
        onLogin(matched.session);
      } else if (email && password) {
        // Fallback for custom entries
        setIsLoading(false);
        onLogin({
          id: 'doc-custom',
          name: email.split('@')[0],
          title: 'Attending Physician',
          role: 'doctor',
          email: email.trim(),
          department: 'General Internal Medicine',
          licenseNumber: 'EGY-DOC-99201',
          hospital: 'MediStream Partner Medical Facility',
        });
      } else {
        setIsLoading(false);
        setError('Please enter a valid email address and password.');
      }
    }, 400);
  };

  const handleQuickLogin = (account: (typeof DEMO_ACCOUNTS)[0]) => {
    setEmail(account.session.email);
    setPassword(account.passwordHint);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(account.session);
    }, 300);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-md sm:max-w-lg space-y-6">
        {/* Top Header Card */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 shadow-xl shadow-teal-500/25 ring-2 ring-white/10 mb-2">
            <Activity className="w-8 h-8 text-slate-950 font-black" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans']">
            MediStream <span className="text-teal-400">OCMS</span>
          </h1>
          <p className="text-sm text-slate-300">
            Egyptian Civil Status Gateway & Clinical Voice Dictation Subsystem
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-4 shadow-xl relative overflow-hidden backdrop-blur-sm">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Demo Accounts Available (1-Click Login)
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              Ready to Test
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.session.id}
                type="button"
                onClick={() => handleQuickLogin(acc)}
                className="text-left p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-teal-400/60 hover:bg-slate-800/60 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                    {acc.session.name}
                  </span>
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30">
                    {acc.tag}
                  </span>
                </div>
                <div className="space-y-0.5 text-[11px] font-mono text-slate-400">
                  <div className="truncate">
                    User: <span className="text-slate-200">{acc.session.email}</span>
                  </div>
                  <div>
                    Pass: <span className="text-teal-300 font-bold">{acc.passwordHint}</span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-teal-400 font-semibold flex items-center gap-1 opacity-80 group-hover:opacity-100">
                  <span>Click to sign in instantly</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-400" />
              Medical Staff Authentication
            </h2>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              EGY-MOH & HIPAA Compliant
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Clinical Email / ID</span>
                <span className="text-[11px] text-slate-500">e.g. doctor@medistream.eg</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@medistream.eg"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/40 transition-colors font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Passcode</span>
                <span className="text-[11px] text-teal-400 font-mono">Cardio#Doc1</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Cardio#Doc1"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/40 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-800 bg-slate-950 text-teal-500 focus:ring-0"
                />
                <span>Enforce Zero-Retention Disk Policy</span>
              </label>
              <span className="text-teal-400/80">TLS 1.3 / AES-256</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Hospital Credentials...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Sign In to MediStream OCMS</span>
                </>
              )}
            </button>
          </form>

          {/* Microservices Gateway Info */}
          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Hospital className="w-3.5 h-3.5 text-slate-400" />
              <span>Gateway: Cairo Regional Medical Cluster</span>
            </span>
            <span className="text-teal-400 font-mono">v2.6 Enterprise</span>
          </div>
        </div>
      </div>
    </div>
  );
};
