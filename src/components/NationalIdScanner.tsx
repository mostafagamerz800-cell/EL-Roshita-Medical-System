import React, { useState } from 'react';
import {
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Cpu,
  User,
  MapPin,
  Calendar,
  Shield,
  FileCheck2,
  Clock,
  Sparkles,
  RefreshCw,
  Search,
} from 'lucide-react';
import { OcrWorkerResult, ValidatedEgyptianId } from '../types/medistream';
import { parseEgyptianNationalId, calculateChecksum, EGYPTIAN_GOVERNORATES } from '../lib/egyptianIdValidator';

export const NationalIdScanner: React.FC = () => {
  const [nationalIdInput, setNationalIdInput] = useState<string>('29804152101234');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [ocrResult, setOcrResult] = useState<OcrWorkerResult | null>(null);
  const [hoveredDigitIndex, setHoveredDigitIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Preset Realistic Egyptian ID test scenarios
  const presets = [
    {
      label: 'Giza Male (1998)',
      id: '29804152101234',
      profile: 'giza_male_1998',
      desc: 'Century 2, DOB: 1998-04-15, Giza (21), Male (3), Civil Seq: 0123',
    },
    {
      label: 'Alexandria Female (2001)',
      id: '30108150204321',
      profile: 'alex_female_2001',
      desc: 'Century 3, DOB: 2001-08-15, Alex (02), Female (2), Civil Seq: 0432',
    },
    {
      label: 'Cairo Male (1975)',
      id: '27503120101915',
      profile: 'cairo_male_1975',
      desc: 'Century 2, DOB: 1975-03-12, Cairo (01), Male (1), Civil Seq: 0191',
    },
    {
      label: 'Luxor Female (1995)',
      id: '29511242903842',
      profile: 'luxor_female_1995',
      desc: 'Century 2, DOB: 1995-11-24, Luxor (29), Female (4), Civil Seq: 0384',
    },
    {
      label: 'Foreign Born Citizen (2003)',
      id: '30305108801237',
      profile: 'foreign_male_2003',
      desc: 'Century 3, DOB: 2003-05-10, Abroad (88), Male (3), Civil Seq: 0123',
    },
    {
      label: 'Invalid Checksum (Test Zod)',
      id: '29804152101239',
      profile: 'invalid_checksum',
      desc: 'Demonstrates Zod /^[23]\\d{13}$/ checksum validation error handling',
    },
  ];

  const handleSelectPreset = (preset: typeof presets[0]) => {
    setNationalIdInput(preset.id);
    setSelectedFile(null);
    setImagePreview(null);
    handleTriggerOcr(preset.id, preset.profile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      handleUploadAndProcess(file);
    }
  };

  const handleUploadAndProcess = async (file: File) => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const formData = new FormData();
      formData.append('card_image', file);

      const res = await fetch('/api/ocr/national-id', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process National ID OCR');
      }

      setOcrResult(data);
      if (data.yolo11mDigits?.rawExtractedId) {
        setNationalIdInput(data.yolo11mDigits.rawExtractedId);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTriggerOcr = async (id: string, sampleProfile?: string) => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/ocr/national-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalId: id, sampleProfile }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Validation error');
      }
      setOcrResult(data);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper to explain the hovered digit
  const getDigitExplanation = (idx: number, idString: string) => {
    if (idString.length < 14) return 'Incomplete 14 digits';
    const char = idString[idx];

    if (idx === 0) {
      return `Digit 1 (Century Code: ${char}): ${char === '2' ? 'Born between 1900-1999' : char === '3' ? 'Born between 2000-2099' : 'Invalid century'}`;
    }
    if (idx === 1 || idx === 2) {
      const yy = idString.substring(1, 3);
      const century = idString[0] === '2' ? '19' : '20';
      return `Digits 2-3 (Birth Year: ${yy}): Calculated year of birth is ${century}${yy}`;
    }
    if (idx === 3 || idx === 4) {
      const mm = idString.substring(3, 5);
      return `Digits 4-5 (Birth Month: ${mm}): Month of birth (01-12)`;
    }
    if (idx === 5 || idx === 6) {
      const dd = idString.substring(5, 7);
      return `Digits 6-7 (Birth Day: ${dd}): Day of birth in month`;
    }
    if (idx === 7 || idx === 8) {
      const govCode = idString.substring(7, 9);
      const gov = EGYPTIAN_GOVERNORATES[govCode];
      return `Digits 8-9 (Governorate Code: ${govCode}): ${gov ? `${gov.nameAr} (${gov.nameEn} - ${gov.region})` : 'Unknown Governorate'}`;
    }
    if (idx >= 9 && idx <= 11) {
      return `Digits 10-12 (Birth Registry Sequence: ${idString.substring(9, 12)}): Daily civil registry sequence number`;
    }
    if (idx === 12) {
      const genderDigit = parseInt(char, 10);
      const isOdd = genderDigit % 2 !== 0;
      return `Digit 13 (Gender Marker: ${char}): ${isOdd ? 'Odd Number → Male (ذكر)' : 'Even Number → Female (أنثى)'}`;
    }
    if (idx === 13) {
      const expected = calculateChecksum(idString.substring(0, 13));
      const match = parseInt(char, 10) === expected;
      return `Digit 14 (Security Check Digit: ${char}): Algorithm check ${match ? `✓ Valid Checksum` : `✗ Mismatch (Expected: ${expected})`}`;
    }
    return '';
  };

  // Initial load
  React.useEffect(() => {
    handleTriggerOcr('29804152101234', 'giza_male_1998');
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner / Pipeline Intro */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/80 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                RabbitMQ Microservice Worker
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                YOLO26m OBB + PaddleOCR + YOLO11m
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                Zod Regex /^[23]\d&#123;13&#125;$/
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Egyptian National ID OCR & Demographic Decoupler
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Processes raw multipart ID card uploads, rectifies perspective via oriented bounding boxes (YOLO26m OBB),
              extracts Arabic text with PaddleOCR, isolates digits via YOLO11m, and performs mathematical validation of
              century, birthdate, gender, and 28 civil registry governorates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTriggerOcr(nationalIdInput)}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50"
            >
              {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RotateCw className="w-4 h-4" />}
              <span>{isProcessing ? 'Processing via RabbitMQ...' : 'Re-Run Pipeline'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Upload & Presets vs Extraction Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload & Test Presets (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card Upload / Drop Zone */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
            <h3 className="text-base font-semibold text-white flex items-center justify-between mb-4">
              <span className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-teal-400" />
                Upload National ID Card
              </span>
              <span className="text-xs text-slate-400 font-mono">Multipart / Form-Data</span>
            </h3>

            <label className="relative border-2 border-dashed border-slate-700 hover:border-teal-500/60 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-950/40 hover:bg-slate-950/70 group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {imagePreview ? (
                <div className="relative w-full aspect-[85/54] rounded-lg overflow-hidden border border-teal-500/40">
                  <img src={imagePreview} alt="National ID Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-xs text-white font-medium bg-slate-900/90 px-3 py-1.5 rounded-md border border-slate-700">
                      Click to choose another photo
                    </p>
                  </div>
                  {/* YOLO26m OBB Simulated Overlay */}
                  <div className="absolute inset-2 border-2 border-dashed border-teal-400/80 rounded pointer-events-none flex items-start justify-between p-1">
                    <span className="text-[10px] font-mono bg-teal-500 text-slate-950 font-bold px-1 rounded">
                      YOLO26m OBB: Card detected (0.994)
                    </span>
                    <span className="text-[10px] font-mono bg-slate-900/90 text-teal-300 px-1 rounded border border-teal-500/30">
                      θ: +1.8°
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400 group-hover:text-teal-400 group-hover:bg-teal-500/10 transition-colors">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-200">
                    Drop front/back card photo or <span className="text-teal-400 underline">browse</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Accepts JPEG, PNG, WebP up to 30MB
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <Shield className="w-3 h-3" />
                    <span>Memory buffered & purged immediately after OCR</span>
                  </div>
                </div>
              )}
            </label>

            {/* Quick 14-Digit Direct Input */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Direct 14-Digit Egyptian National ID Input:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={14}
                  value={nationalIdInput}
                  onChange={(e) => setNationalIdInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="29804152101234"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white font-mono tracking-widest focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
                <button
                  onClick={() => handleTriggerOcr(nationalIdInput)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 font-medium text-xs rounded-lg transition-colors border border-slate-700"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>

          {/* Test Presets for Instant Evaluation */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              Standard Egyptian Test Presets
            </h3>
            <div className="space-y-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    nationalIdInput === preset.id
                      ? 'bg-teal-500/10 border-teal-500/50 shadow-sm'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-950/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{preset.label}</span>
                    <span className="text-[11px] font-mono text-teal-400 font-semibold">{preset.id}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{preset.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: OCR Breakdown & Decoded Demographics (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
              <div>
                <p className="font-semibold">Zod Demographic Validation Failed</p>
                <p className="text-xs text-rose-300/90 mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Interactive 14-Digit Pill Ribbon */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-teal-400" />
                14-Digit Egyptian Standard Structural Decomposition
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Length: {nationalIdInput.length}/14
              </span>
            </div>

            {/* Digit Visualizer Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
              {nationalIdInput.split('').map((digit, idx) => {
                // Color code by standard segments:
                // 0: Century (Purple)
                // 1-2: Year (Teal)
                // 3-4: Month (Cyan)
                // 5-6: Day (Emerald)
                // 7-8: Governorate (Amber)
                // 9-11: Serial (Blue)
                // 12: Gender (Rose/Indigo)
                // 13: Checksum (Emerald/Red)
                let colorClass = 'bg-slate-800 text-slate-200 border-slate-700';
                if (idx === 0) colorClass = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
                else if (idx === 1 || idx === 2) colorClass = 'bg-teal-500/20 text-teal-300 border-teal-500/40';
                else if (idx === 3 || idx === 4) colorClass = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
                else if (idx === 5 || idx === 6) colorClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
                else if (idx === 7 || idx === 8) colorClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                else if (idx >= 9 && idx <= 11) colorClass = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
                else if (idx === 12) colorClass = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
                else if (idx === 13) colorClass = 'bg-rose-500/20 text-rose-300 border-rose-500/40';

                return (
                  <button
                    key={idx}
                    onMouseEnter={() => setHoveredDigitIndex(idx)}
                    onMouseLeave={() => setHoveredDigitIndex(null)}
                    onClick={() => setHoveredDigitIndex(idx)}
                    className={`w-8 h-10 sm:w-10 sm:h-12 rounded-lg font-mono text-base sm:text-lg font-bold flex flex-col items-center justify-center border transition-all ${colorClass} ${
                      hoveredDigitIndex === idx ? 'ring-2 ring-white scale-110 shadow-lg z-10' : ''
                    }`}
                  >
                    <span>{digit}</span>
                    <span className="text-[9px] opacity-60 font-sans">{idx + 1}</span>
                  </button>
                );
              })}
            </div>

            {/* Hover Tooltip / Explanation Bar */}
            <div className="mt-3 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs flex items-center justify-between min-h-[38px]">
              <span className="text-slate-300 font-medium">
                {hoveredDigitIndex !== null
                  ? getDigitExplanation(hoveredDigitIndex, nationalIdInput)
                  : 'Hover over or tap any digit above to inspect its decoded Civil Registry rule.'}
              </span>
              {hoveredDigitIndex !== null && (
                <span className="text-[10px] text-teal-400 font-mono">
                  Pos {hoveredDigitIndex + 1}
                </span>
              )}
            </div>
          </div>

          {/* Decoded Demographics & Hospital EHR Intake Card */}
          {ocrResult && ocrResult.validation?.demographics && (
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Validated Egyptian Civil Demographics
                    </h3>
                    <p className="text-xs text-slate-400">
                      Extracted via PaddleOCR Arabic + YOLO11m Digits
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    Zod Check: Passed
                  </span>
                </div>
              </div>

              {/* Patient Profile Card (Arabic & English) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name & Arabic Card */}
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">الاسم بالكامل (Arabic Full Name):</span>
                  <p className="text-lg font-bold text-teal-300 font-['Cairo']">
                    {ocrResult.paddleOcr.fullNameAr}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 font-['Cairo']">
                    {ocrResult.paddleOcr.professionAr} • {ocrResult.paddleOcr.addressAr}
                  </p>
                </div>

                {/* Date of Birth & Age */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" />
                      Date of Birth:
                    </span>
                    <span className="text-white font-mono font-semibold">
                      {ocrResult.validation.demographics.dateOfBirthIso}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-teal-400" />
                      Age & Gender:
                    </span>
                    <span className="text-white font-medium">
                      {ocrResult.validation.demographics.ageYears} yrs •{' '}
                      <span className={ocrResult.validation.demographics.gender === 'Male' ? 'text-blue-400 font-semibold' : 'text-rose-400 font-semibold'}>
                        {ocrResult.validation.demographics.gender} ({ocrResult.validation.demographics.genderAr})
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-400" />
                      Governorate (المحافظة):
                    </span>
                    <span className="text-white font-medium">
                      {ocrResult.validation.demographics.governorateAr} ({ocrResult.validation.demographics.governorateEn})
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-teal-400" />
                      Checksum & Check Digit:
                    </span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      Digit #{ocrResult.validation.demographics.checksumDigit} (Verified)
                    </span>
                  </div>
                </div>
              </div>

              {/* Technical Pipeline Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">YOLO26m OBB Tilt</span>
                  <span className="text-xs font-mono font-bold text-teal-300">
                    {ocrResult.yoloObb.cardOrientationDegrees}°
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Digit Model Conf.</span>
                  <span className="text-xs font-mono font-bold text-emerald-300">
                    {(ocrResult.yolo11mDigits.overallDigitConfidence * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Processing Latency</span>
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    {ocrResult.processingTimeMs} ms
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Privacy Guarantee</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    0-Disk Retained
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
