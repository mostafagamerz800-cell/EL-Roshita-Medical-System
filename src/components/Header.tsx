import React from 'react';
import {
  ShieldCheck,
  Activity,
  Cpu,
  Sparkles,
  Database,
  FileText,
  CheckCircle2,
  FileDiff,
  LogOut,
  Stethoscope,
  User,
} from 'lucide-react';
import { UserSession } from './AuthScreen';

interface HeaderProps {
  activeTab: 'ocr' | 'dictation' | 'privacy' | 'code';
  setActiveTab: (tab: 'ocr' | 'dictation' | 'privacy' | 'code') => void;
  geminiActive: boolean;
  userSession?: UserSession | null;
  onSignOut?: () => void;
  onOpenDiffModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  geminiActive,
  userSession,
  onSignOut,
  onOpenDiffModal,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20 ring-1 ring-white/20">
              <Activity className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                  MediStream <span className="text-teal-400 font-extrabold">OCMS</span>
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 hidden sm:inline-block">
                  v2.6
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden xl:block">
                Egyptian National ID OCR & Clinical Voice Dictation Subsystem
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Only when logged in) */}
          {userSession && (
            <nav className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80 overflow-x-auto">
              <button
                onClick={() => setActiveTab('ocr')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'ocr'
                    ? 'bg-teal-500 text-slate-950 font-semibold shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>National ID OCR</span>
              </button>

              <button
                onClick={() => setActiveTab('dictation')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'dictation'
                    ? 'bg-teal-500 text-slate-950 font-semibold shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Voice Dictation</span>
              </button>

              <button
                onClick={() => setActiveTab('privacy')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'privacy'
                    ? 'bg-teal-500 text-slate-950 font-semibold shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Privacy & Audit</span>
              </button>

              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'code'
                    ? 'bg-teal-500 text-slate-950 font-semibold shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Production Code</span>
              </button>
            </nav>
          )}

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* View Changes / Diff Button */}
            {onOpenDiffModal && (
              <button
                onClick={onOpenDiffModal}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-teal-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                title="Inspect line-by-line code changes & differences"
              >
                <FileDiff className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">View</span> Differences
              </button>
            )}

            {/* Authenticated Physician Info */}
            {userSession ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-200 leading-tight">
                    {userSession.name}
                  </span>
                  <span className="text-[10px] text-teal-400 font-mono leading-tight truncate max-w-[140px]">
                    {userSession.department}
                  </span>
                </div>

                <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
                  <Stethoscope className="w-4 h-4" />
                </div>

                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                    title="Sign Out of Session"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-medium">Secure Auth Portal</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
