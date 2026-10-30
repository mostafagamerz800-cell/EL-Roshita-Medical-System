/**
 * MediStream OCMS - Egyptian National ID & Clinical Voice Dictation Types
 */

export interface EgyptianGovernorate {
  code: string;
  nameAr: string;
  nameEn: string;
  region: 'Lower Egypt' | 'Upper Egypt' | 'Canal' | 'Frontier' | 'Metropolitan' | 'Abroad';
}

export interface ValidatedEgyptianId {
  nationalId: string;
  centuryCode: number;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  dateOfBirthIso: string;
  ageYears: number;
  governorateCode: string;
  governorateAr: string;
  governorateEn: string;
  gender: 'Male' | 'Female';
  genderAr: 'ذكر' | 'أنثى';
  sequenceNumber: string;
  checksumDigit: number;
  isChecksumValid: boolean;
}

export interface OcrWorkerResult {
  jobId: string;
  processingTimeMs: number;
  yoloObb: {
    detected: boolean;
    cardOrientationDegrees: number;
    cropCoordinates: { x: number; y: number; width: number; height: number };
    confidence: number;
  };
  paddleOcr: {
    fullNameAr: string;
    addressAr: string;
    professionAr: string;
    maritalStatusAr?: string;
    issuingStationAr?: string;
    expiryDate?: string;
    rawTextLines: string[];
    confidence: number;
  };
  yolo11mDigits: {
    rawExtractedId: string;
    digitConfidences: number[];
    overallDigitConfidence: number;
  };
  validation: {
    isValid: boolean;
    errors?: string[];
    demographics?: ValidatedEgyptianId;
  };
  privacyAudit: {
    fileSha256: string;
    tempFileDeletedImmediately: boolean;
    unlinkTimestamp: string;
    storageZeroRetention: boolean;
  };
}

export interface ClinicalVitals {
  blood_pressure?: string;
  heart_rate_bpm?: number;
  respiratory_rate?: number;
  temperature_c?: number;
  oxygen_saturation_percent?: number;
  random_blood_sugar_mg_dl?: number;
}

export interface ClinicalMedication {
  name: string;
  dosage?: string;
  dose?: string;
  route?: string;
  frequency?: string;
  duration?: string;
}

export interface Icd10Entry {
  code: string;
  description: string;
  category: string;
}

export interface StructuredClinicalNote {
  patient_summary: string;
  chief_complaint: string;
  history_of_present_illness: string;
  vitals: ClinicalVitals;
  past_medical_history: string[];
  past_surgical_history: string[];
  allergies: string[];
  current_medications: ClinicalMedication[];
  physical_examination: {
    general?: string;
    cardiovascular?: string;
    respiratory?: string;
    abdomen?: string;
    neurological?: string;
    extremities?: string;
  };
  clinical_assessment: string;
  differential_diagnoses: string[];
  icd10_codes: Icd10Entry[];
  treatment_plan: {
    diagnostics: string[];
    prescriptions: ClinicalMedication[];
    lifestyle_advice: string[];
    follow_up_instructions: string;
  };
  urgency_level: 'ROUTINE' | 'URGENT' | 'EMERGENCY';
  red_flags: string[];
  processing_metadata: {
    audio_sample_rate_hz: number;
    audio_channels: number;
    whisper_model: string;
    gemini_model: string;
    latency_ms: number;
    privacy_audio_purged: boolean;
  };
}

export interface RabbitMqMetric {
  queueName: string;
  messagesInFlight: number;
  messagesProcessedTotal: number;
  consumerCount: number;
  avgLatencyMs: number;
  status: 'CONNECTED' | 'PROCESSING' | 'IDLE';
}

export interface PrivacyAuditEvent {
  id: string;
  timestamp: string;
  jobType: 'OCR_NATIONAL_ID' | 'VOICE_DICTATION_ASR';
  fileSha256: string;
  mimeType: string;
  fileSizeBytes: number;
  status: 'PURGED_IMMEDIATELY';
  deletionLatencyMs: number;
  diskRetentionSec: 0;
}
