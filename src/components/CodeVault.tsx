import React, { useState } from 'react';
import {
  FileCode,
  Copy,
  CheckCircle2,
  Download,
  FolderTree,
  Terminal,
  ExternalLink,
  Layers,
} from 'lucide-react';
import {
  NESTJS_MODULE_CODE,
  NESTJS_OCR_SERVICE_CODE,
  NESTJS_VOICE_SERVICE_CODE,
  NESTJS_CONTROLLERS_CODE,
  NEXTJS14_ROUTE_HANDLERS_CODE,
  PYTHON_WORKER_CODE,
  DOCKER_COMPOSE_CODE,
} from '../lib/codeTemplates';

export const CodeVault: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'nestjs' | 'nextjs' | 'python' | 'docker'>('nestjs');
  const [selectedFile, setSelectedFile] = useState<string>('national-id-ocr.service.ts');
  const [copied, setCopied] = useState<boolean>(false);

  const fileMap: Record<string, { title: string; category: string; code: string; ext: string }> = {
    'national-id-ocr.service.ts': {
      title: 'national-id-ocr.service.ts (NestJS OCR Service with RabbitMQ + Zod)',
      category: 'nestjs',
      code: NESTJS_OCR_SERVICE_CODE,
      ext: 'ts',
    },
    'voice-dictation.service.ts': {
      title: 'voice-dictation.service.ts (NestJS 16kHz WAV + Gemini 2.5 Flash)',
      category: 'nestjs',
      code: NESTJS_VOICE_SERVICE_CODE,
      ext: 'ts',
    },
    'medistream-ocms.module.ts': {
      title: 'medistream-ocms.module.ts (NestJS Module & RabbitMQ Clients)',
      category: 'nestjs',
      code: NESTJS_MODULE_CODE,
      ext: 'ts',
    },
    'controllers.ts': {
      title: 'controllers.ts (NestJS Multipart Multer Upload Controllers)',
      category: 'nestjs',
      code: NESTJS_CONTROLLERS_CODE,
      ext: 'ts',
    },
    'nextjs-ocr-route.ts': {
      title: 'app/api/ocr/national-id/route.ts (Next.js 14 App Router Handler)',
      category: 'nextjs',
      code: NEXTJS14_ROUTE_HANDLERS_CODE,
      ext: 'ts',
    },
    'worker_ocr.py': {
      title: 'worker_ocr.py (Python YOLO26m OBB + PaddleOCR + YOLO11m)',
      category: 'python',
      code: PYTHON_WORKER_CODE,
      ext: 'py',
    },
    'docker-compose.yml': {
      title: 'docker-compose.yml (RabbitMQ + GPU Workers + NestJS)',
      category: 'docker',
      code: DOCKER_COMPOSE_CODE,
      ext: 'yml',
    },
  };

  const currentFile = fileMap[selectedFile] || fileMap['national-id-ocr.service.ts'];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentFile.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/80 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                Production Artifacts
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                NestJS 10+ & Next.js 14 App Router
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <FileCode className="w-6 h-6 text-teal-400" />
              MediStream OCMS Production Code Vault
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Complete, ready-to-deploy TypeScript and Python source code for your NestJS microservices and Next.js 14 frontend,
              featuring RabbitMQ message contracts, Zod schemas, Gemini 2.5 Flash responseSchema, and Privacy-by-Design file shredding.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4 text-teal-400" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: File Tree (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              <FolderTree className="w-4 h-4 text-teal-400" />
              <span>Module Tree</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1 block">
                NestJS Microservice
              </span>
              <button
                onClick={() => setSelectedFile('national-id-ocr.service.ts')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-2 ${
                  selectedFile === 'national-id-ocr.service.ts'
                    ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>national-id-ocr.service.ts</span>
              </button>

              <button
                onClick={() => setSelectedFile('voice-dictation.service.ts')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-2 ${
                  selectedFile === 'voice-dictation.service.ts'
                    ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>voice-dictation.service.ts</span>
              </button>

              <button
                onClick={() => setSelectedFile('medistream-ocms.module.ts')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-2 ${
                  selectedFile === 'medistream-ocms.module.ts'
                    ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>medistream-ocms.module.ts</span>
              </button>

              <button
                onClick={() => setSelectedFile('controllers.ts')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-2 ${
                  selectedFile === 'controllers.ts'
                    ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>controllers.ts</span>
              </button>

              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-3 block">
                Next.js 14 App Router
              </span>
              <button
                onClick={() => setSelectedFile('nextjs-ocr-route.ts')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-2 ${
                  selectedFile === 'nextjs-ocr-route.ts'
                    ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>app/api/ocr/route.ts</span>
              </button>

              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-3 block">
                Python GPU Workers
              </span>
              <button
                onClick={() => setSelectedFile('worker_ocr.py')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-2 ${
                  selectedFile === 'worker_ocr.py'
                    ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>worker_ocr.py (YOLO26m)</span>
              </button>

              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-3 block">
                Infrastructure
              </span>
              <button
                onClick={() => setSelectedFile('docker-compose.yml')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-2 ${
                  selectedFile === 'docker-compose.yml'
                    ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>docker-compose.yml</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Code Viewer (9 cols) */}
        <div className="lg:col-span-9 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
          <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="text-xs font-mono text-slate-300 ml-2 font-medium">
                {currentFile.title}
              </span>
            </div>
            <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
              {currentFile.ext.toUpperCase()}
            </span>
          </div>

          <div className="p-4 overflow-x-auto bg-slate-950/90 font-mono text-xs text-slate-200 leading-relaxed max-h-[620px] overflow-y-auto">
            <pre>
              <code>{currentFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
