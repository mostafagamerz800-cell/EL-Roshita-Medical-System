/**
 * MediStream OCMS - Egyptian National ID OCR & Clinical Voice Dictation Subsystem
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { NationalIdScanner } from './components/NationalIdScanner';
import { VoiceDictationStudio } from './components/VoiceDictationStudio';
import { PrivacyMonitor } from './components/PrivacyMonitor';
import { CodeVault } from './components/CodeVault';
import { AuthScreen, UserSession, DEMO_ACCOUNTS } from './components/AuthScreen';
import { DiffViewerModal } from './components/DiffViewerModal';
import {
  Activity,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  Database,
  Radio,
  Sparkles,
  FileDiff,
  Lock,
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<'ocr' | 'dictation' | 'privacy' | 'code'>('ocr');
  const [isDiffModalOpen, setIsDiffModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-teal-500/30 selection:text-teal-200">
      {/* Top Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        geminiActive={true}
        userSession={currentUser}
        onSignOut={() => setCurrentUser(null)}
        onOpenDiffModal={() => setIsDiffModalOpen(true)}
      />

      {/* Main Container */}
      {!currentUser ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col justify-center">
          <AuthScreen onLogin={(session) => setCurrentUser(session)} />
        </main>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-in fade-in duration-200">
          {/* Microservices Architecture Ribbon */}
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
              <span className="font-semibold text-slate-200">Active Session:</span>
              <span className="text-teal-300 font-medium">
                {currentUser.name} ({currentUser.department})
              </span>
              <span className="text-slate-500 hidden lg:inline">•</span>
              <span className="text-slate-400 hidden lg:inline">
                NestJS Gateway ➔ RabbitMQ ➔ Python GPU Worker (YOLO26m OBB / PaddleOCR / Whisper) ➔ Gemini 3.8 Flash
              </span>
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-slate-400">
                Queue: <span className="text-teal-400 font-bold">ocr.national_id.jobs</span>
              </span>
              <span className="text-slate-400 hidden md:inline">
                ASR: <span className="text-emerald-400 font-bold">asr.voice_dictation.jobs</span>
              </span>
              <button
                onClick={() => setIsDiffModalOpen(true)}
                className="px-2 py-0.5 rounded bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/20 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <FileDiff className="w-3 h-3" />
                <span>Diff Viewer</span>
              </button>
            </div>
          </div>

          {/* Dynamic Tab Views */}
          {activeTab === 'ocr' && <NationalIdScanner />}
          {activeTab === 'dictation' && <VoiceDictationStudio />}
          {activeTab === 'privacy' && <PrivacyMonitor />}
          {activeTab === 'code' && <CodeVault />}
        </main>
      )}

      {/* Code Changes & Diff Modal */}
      <DiffViewerModal
        isOpen={isDiffModalOpen}
        onClose={() => setIsDiffModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            <span className="font-semibold text-slate-300">MediStream OCMS</span>
            <span>—</span>
            <span>Egyptian Civil Status & Clinical Dictation Gateway</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Zod /^[23]\d&#123;13&#125;$/</span>
            <span>•</span>
            <span>16kHz Mono WAV</span>
            <span>•</span>
            <span>Gemini 3.8 Flash</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">Zero Disk Retention</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
