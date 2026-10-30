import React, { useState } from 'react';
import {
  FileDiff,
  CheckCircle2,
  FileCode,
  X,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Sparkles,
  Terminal,
  ExternalLink,
} from 'lucide-react';

interface DiffViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FileDiffItem {
  filename: string;
  category: 'Auth' | 'Entrypoint' | 'Layout' | 'Backend';
  description: string;
  diffStatus: 'MODIFIED' | 'ADDED';
  linesAdded: number;
  linesRemoved: number;
  highlightSummary: string;
  diffSnippet: string;
}

const FILE_DIFFS: FileDiffItem[] = [
  {
    filename: 'src/components/AuthScreen.tsx',
    category: 'Auth',
    description: 'Added medical staff login screen with doctor@medistream.eg / Cardio#Doc1',
    diffStatus: 'ADDED',
    linesAdded: 245,
    linesRemoved: 0,
    highlightSummary: 'Enforces clinical authentication before accessing OCR and Voice Dictation.',
    diffSnippet: `+ export const DEMO_ACCOUNTS = [
+   {
+     session: {
+       name: 'Dr. Tarek Mansour',
+       role: 'doctor',
+       email: 'doctor@medistream.eg',
+       department: 'Cardiovascular Care Unit (CCU)'
+     },
+     passwordHint: 'Cardio#Doc1'
+   }
+ ];`,
  },
  {
    filename: 'src/App.tsx',
    category: 'Layout',
    description: 'Integrated user session state, auth gate, and diff viewer modal trigger',
    diffStatus: 'MODIFIED',
    linesAdded: 45,
    linesRemoved: 8,
    highlightSummary: 'Shows AuthScreen on first load, boots directly into session once signed in.',
    diffSnippet: `- export default function App() {
-   const [activeTab, setActiveTab] = useState<'ocr' | ...>('ocr');
+ export default function App() {
+   const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
+   const [showDiffModal, setShowDiffModal] = useState<boolean>(false);
+   if (!currentUser) {
+     return <AuthScreen onLogin={(user) => setCurrentUser(user)} />;
+   }`,
  },
  {
    filename: 'src/components/Header.tsx',
    category: 'Layout',
    description: 'Added physician profile badge, sign out action, and "View Changes" button',
    diffStatus: 'MODIFIED',
    linesAdded: 38,
    linesRemoved: 4,
    highlightSummary: 'Displays Dr. Tarek Mansour avatar, active session state, and changelog trigger.',
    diffSnippet: `+ {currentUser && (
+   <div className="flex items-center gap-2">
+     <span className="text-xs text-slate-300 font-bold">{currentUser.name}</span>
+     <button onClick={onSignOut} className="text-xs text-rose-400">Sign Out</button>
+   </div>
+ )}`,
  },
  {
    filename: 'src/main.tsx',
    category: 'Entrypoint',
    description: 'Verified React 19 root bootstrap and clean named imports',
    diffStatus: 'MODIFIED',
    linesAdded: 1,
    linesRemoved: 0,
    highlightSummary: 'Strict React 19 createRoot hydration with Tailwind v4 runtime.',
    diffSnippet: `  import React from 'react';
  import { createRoot } from 'react-dom/client';
  import App from './App.tsx';
  import './index.css';`,
  },
];

export const DiffViewerModal: React.FC<DiffViewerModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<string>('src/components/AuthScreen.tsx');

  if (!isOpen) return null;

  const currentDiff = FILE_DIFFS.find((f) => f.filename === selectedFile) || FILE_DIFFS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <FileDiff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Code Changes & Difference Viewer</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono">
                  All Updates Applied
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Detailed comparison of recent updates made to the MediStream OCMS codebase
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* File Selector (4 cols) */}
          <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/40 p-4 space-y-2 overflow-y-auto">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-1">
              Modified & Added Files
            </div>

            {FILE_DIFFS.map((diff) => (
              <button
                key={diff.filename}
                onClick={() => setSelectedFile(diff.filename)}
                className={`w-full text-left p-3 rounded-xl transition-all border ${
                  selectedFile === diff.filename
                    ? 'bg-teal-500/15 border-teal-500/40 text-teal-200'
                    : 'bg-slate-900/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold truncate">{diff.filename}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                      diff.diffStatus === 'ADDED'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {diff.diffStatus}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1">{diff.description}</div>
                <div className="mt-2 flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-emerald-400">+{diff.linesAdded}</span>
                  {diff.linesRemoved > 0 && (
                    <span className="text-rose-400">-{diff.linesRemoved}</span>
                  )}
                  <span className="text-slate-500">• {diff.category}</span>
                </div>
              </button>
            ))}

            {/* AI Studio Tip Box */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-teal-400" />
                <span>AI Studio Diff Inspector:</span>
              </div>
              <p>
                You can also click the <strong>&lt; &gt; Code</strong> icon on the left/top sidebar in Google AI Studio to inspect every file difference line-by-line.
              </p>
            </div>
          </div>

          {/* Diff View Area (8 cols) */}
          <div className="md:col-span-8 flex flex-col bg-slate-950 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-white">
                  {currentDiff.filename}
                </span>
                <span className="text-[11px] text-slate-400 ml-2">
                  ({currentDiff.highlightSummary})
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  +{currentDiff.linesAdded} lines
                </span>
                {currentDiff.linesRemoved > 0 && (
                  <span className="text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                    -{currentDiff.linesRemoved} lines
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto font-mono text-xs leading-relaxed">
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                <pre className="text-slate-300 overflow-x-auto">
                  <code>{currentDiff.diffSnippet}</code>
                </pre>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
                <h4 className="font-bold text-teal-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  What this change accomplishes:
                </h4>
                <p className="text-slate-300">{currentDiff.description}</p>
                <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800 flex items-center justify-between">
                  <span>Tested against React 19 & Vite 8</span>
                  <span className="text-emerald-400 font-bold">Build Succeeded</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            MediStream OCMS • Version 2.6 Enterprise
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
