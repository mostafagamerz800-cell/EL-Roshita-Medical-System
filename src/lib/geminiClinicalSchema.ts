import { Type } from '@google/genai';

/**
 * Strict responseSchema for Gemini 3.8 Flash clinical structuring
 * Complies with HL7 FHIR / MediStream OCMS Clinical Note format
 */
export const CLINICAL_NOTE_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    patient_summary: {
      type: Type.STRING,
      description: 'One-sentence concise clinical summary of the patient case.',
    },
    chief_complaint: {
      type: Type.STRING,
      description: 'Primary reason for visit in clinical terminology.',
    },
    history_of_present_illness: {
      type: Type.STRING,
      description: 'Chronological HPI including onset, location, duration, character, aggravating/alleviating factors, radiation, and temporal patterns (OLDCARTS).',
    },
    vitals: {
      type: Type.OBJECT,
      description: 'Extracted vital signs mentioned in the doctor dictation.',
      properties: {
        blood_pressure: {
          type: Type.STRING,
          description: 'Blood pressure reading e.g. "120/80 mmHg"',
        },
        heart_rate_bpm: {
          type: Type.INTEGER,
          description: 'Heart rate in beats per minute',
        },
        respiratory_rate: {
          type: Type.INTEGER,
          description: 'Respiratory rate in breaths per minute',
        },
        temperature_c: {
          type: Type.NUMBER,
          description: 'Body temperature in degrees Celsius',
        },
        oxygen_saturation_percent: {
          type: Type.INTEGER,
          description: 'SpO2 oxygen saturation percentage',
        },
        random_blood_sugar_mg_dl: {
          type: Type.INTEGER,
          description: 'Blood sugar reading in mg/dL',
        },
      },
    },
    past_medical_history: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Chronic conditions and significant past medical diagnoses (e.g. Type 2 DM, HTN, Asthma).',
    },
    past_surgical_history: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Past surgeries and procedural history.',
    },
    allergies: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Drug allergies, environmental allergies, or "No known drug allergies (NKDA)".',
    },
    current_medications: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          dosage: { type: Type.STRING },
          route: { type: Type.STRING },
          frequency: { type: Type.STRING },
          duration: { type: Type.STRING },
        },
        required: ['name'],
      },
      description: 'Medications currently taken by the patient prior to this encounter.',
    },
    physical_examination: {
      type: Type.OBJECT,
      properties: {
        general: { type: Type.STRING },
        cardiovascular: { type: Type.STRING },
        respiratory: { type: Type.STRING },
        abdomen: { type: Type.STRING },
        neurological: { type: Type.STRING },
        extremities: { type: Type.STRING },
      },
      description: 'System-by-system physical examination findings.',
    },
    clinical_assessment: {
      type: Type.STRING,
      description: 'Primary clinical impression / diagnosis by the clinician.',
    },
    differential_diagnoses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Alternative diagnostic possibilities considered.',
    },
    icd10_codes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          code: { type: Type.STRING, description: 'Standard ICD-10-CM code e.g. E11.9, I10, J45.909' },
          description: { type: Type.STRING, description: 'Official clinical diagnostic label' },
          category: { type: Type.STRING, description: 'Diagnostic category or organ system' },
        },
        required: ['code', 'description'],
      },
      description: 'Recommended ICD-10 codes mapped with high clinical confidence.',
    },
    treatment_plan: {
      type: Type.OBJECT,
      properties: {
        diagnostics: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Laboratory investigations, imaging, or ECG ordered.',
        },
        prescriptions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              dose: { type: Type.STRING },
              route: { type: Type.STRING },
              frequency: { type: Type.STRING },
              duration: { type: Type.STRING },
            },
            required: ['name', 'dose', 'frequency'],
          },
          description: 'New medications prescribed during this encounter.',
        },
        lifestyle_advice: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Dietary, physical activity, and patient education instructions.',
        },
        follow_up_instructions: {
          type: Type.STRING,
          description: 'Follow-up timeline and emergency return criteria.',
        },
      },
      required: ['follow_up_instructions'],
    },
    urgency_level: {
      type: Type.STRING,
      description: 'ROUTINE, URGENT, or EMERGENCY triage grade.',
    },
    red_flags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Critical safety warning signs identified in dictation (e.g. crushing chest pain, diaphoresis, acute desaturation, anaphylaxis risk).',
    },
  },
  required: [
    'patient_summary',
    'chief_complaint',
    'history_of_present_illness',
    'clinical_assessment',
    'urgency_level',
  ],
};
