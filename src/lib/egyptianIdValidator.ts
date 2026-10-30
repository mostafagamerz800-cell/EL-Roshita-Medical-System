import { z } from 'zod';
import { EgyptianGovernorate, ValidatedEgyptianId } from '../types/medistream';

/**
 * Egyptian Governorates Civil Registry Codes (أكواد المحافظات المصرية)
 * Standardized according to the Egyptian Civil Status Organization (مصلحة الأحوال المدنية)
 */
export const EGYPTIAN_GOVERNORATES: Record<string, EgyptianGovernorate> = {
  '01': { code: '01', nameAr: 'القاهرة', nameEn: 'Cairo', region: 'Metropolitan' },
  '02': { code: '02', nameAr: 'الإسكندرية', nameEn: 'Alexandria', region: 'Metropolitan' },
  '03': { code: '03', nameAr: 'بورسعيد', nameEn: 'Port Said', region: 'Canal' },
  '04': { code: '04', nameAr: 'السويس', nameEn: 'Suez', region: 'Canal' },
  '11': { code: '11', nameAr: 'دمياط', nameEn: 'Damietta', region: 'Lower Egypt' },
  '12': { code: '12', nameAr: 'الدقهلية', nameEn: 'Dakahlia', region: 'Lower Egypt' },
  '13': { code: '13', nameAr: 'الشرقية', nameEn: 'Sharkia', region: 'Lower Egypt' },
  '14': { code: '14', nameAr: 'القليوبية', nameEn: 'Qalyubia', region: 'Lower Egypt' },
  '15': { code: '15', nameAr: 'كفر الشيخ', nameEn: 'Kafr El Sheikh', region: 'Lower Egypt' },
  '16': { code: '16', nameAr: 'الغربية', nameEn: 'Gharbia', region: 'Lower Egypt' },
  '17': { code: '17', nameAr: 'المنوفية', nameEn: 'Menofia', region: 'Lower Egypt' },
  '18': { code: '18', nameAr: 'البحيرة', nameEn: 'Beheira', region: 'Lower Egypt' },
  '19': { code: '19', nameAr: 'الإسماعيلية', nameEn: 'Ismailia', region: 'Canal' },
  '21': { code: '21', nameAr: 'الجيزة', nameEn: 'Giza', region: 'Metropolitan' },
  '22': { code: '22', nameAr: 'بني سويف', nameEn: 'Beni Suef', region: 'Upper Egypt' },
  '23': { code: '23', nameAr: 'الفيوم', nameEn: 'Faiyum', region: 'Upper Egypt' },
  '24': { code: '24', nameAr: 'المنيا', nameEn: 'Minya', region: 'Upper Egypt' },
  '25': { code: '25', nameAr: 'أسيوط', nameEn: 'Asyut', region: 'Upper Egypt' },
  '26': { code: '26', nameAr: 'سوهاج', nameEn: 'Sohag', region: 'Upper Egypt' },
  '27': { code: '27', nameAr: 'قنا', nameEn: 'Qena', region: 'Upper Egypt' },
  '28': { code: '28', nameAr: 'أسوان', nameEn: 'Aswan', region: 'Upper Egypt' },
  '29': { code: '29', nameAr: 'الأقصر', nameEn: 'Luxor', region: 'Upper Egypt' },
  '31': { code: '31', nameAr: 'البحر الأحمر', nameEn: 'Red Sea', region: 'Frontier' },
  '32': { code: '32', nameAr: 'الوادي الجديد', nameEn: 'New Valley', region: 'Frontier' },
  '33': { code: '33', nameAr: 'مطروح', nameEn: 'Matrouh', region: 'Frontier' },
  '34': { code: '34', nameAr: 'شمال سيناء', nameEn: 'North Sinai', region: 'Frontier' },
  '35': { code: '35', nameAr: 'جنوب سيناء', nameEn: 'South Sinai', region: 'Frontier' },
  '88': { code: '88', nameAr: 'مواليد الخارج', nameEn: 'Born Abroad', region: 'Abroad' },
};

export const EgyptianNationalIdRegex = /^[23]\d{13}$/;

/**
 * Validates days in month with leap year logic
 */
function isValidDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  
  const daysInMonths = [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= daysInMonths[month - 1];
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Calculates Egyptian National ID Luhn/Mod-11 style checksum
 */
export function calculateChecksum(id13: string): number {
  const weights = [2, 7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(id13[i], 10) * weights[i];
  }
  const remainder = sum % 11;
  const checkDigit = (11 - remainder) % 10;
  return checkDigit;
}

/**
 * Extracts and strictly parses Egyptian National ID demographics
 */
export function parseEgyptianNationalId(nationalId: string): ValidatedEgyptianId {
  if (!EgyptianNationalIdRegex.test(nationalId)) {
    throw new Error('National ID must be exactly 14 digits starting with 2 or 3');
  }

  const centuryDigit = parseInt(nationalId.charAt(0), 10);
  const baseCentury = centuryDigit === 2 ? 1900 : 2000;
  const yearShort = parseInt(nationalId.substring(1, 3), 10);
  const birthYear = baseCentury + yearShort;
  const birthMonth = parseInt(nationalId.substring(3, 5), 10);
  const birthDay = parseInt(nationalId.substring(5, 7), 10);

  if (!isValidDate(birthYear, birthMonth, birthDay)) {
    throw new Error(`Invalid Date of Birth decoded: ${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`);
  }

  const dob = new Date(birthYear, birthMonth - 1, birthDay);
  const today = new Date();
  if (dob > today) {
    throw new Error('Decoded Date of Birth cannot be in the future');
  }

  // Calculate age
  let ageYears = today.getFullYear() - birthYear;
  const m = today.getMonth() - (birthMonth - 1);
  if (m < 0 || (m === 0 && today.getDate() < birthDay)) {
    ageYears--;
  }

  // Governorate
  const govCode = nationalId.substring(7, 9);
  const governorate = EGYPTIAN_GOVERNORATES[govCode];
  if (!governorate) {
    throw new Error(`Unknown Egyptian Civil Registry governorate code: ${govCode}`);
  }

  // Gender from 13th digit
  const sequenceStr = nationalId.substring(9, 13);
  const genderDigit = parseInt(nationalId.charAt(12), 10);
  const isMale = genderDigit % 2 !== 0;
  const gender: 'Male' | 'Female' = isMale ? 'Male' : 'Female';
  const genderAr: 'ذكر' | 'أنثى' = isMale ? 'ذكر' : 'أنثى';

  // Checksum
  const checksumDigit = parseInt(nationalId.charAt(13), 10);
  const expectedChecksum = calculateChecksum(nationalId.substring(0, 13));
  const isChecksumValid = checksumDigit === expectedChecksum;

  return {
    nationalId,
    centuryCode: centuryDigit,
    birthYear,
    birthMonth,
    birthDay,
    dateOfBirthIso: `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`,
    ageYears,
    governorateCode: govCode,
    governorateAr: governorate.nameAr,
    governorateEn: governorate.nameEn,
    gender,
    genderAr,
    sequenceNumber: sequenceStr,
    checksumDigit,
    isChecksumValid,
  };
}

/**
 * Production Zod Schema for NestJS & Next.js MediStream OCMS
 */
export const EgyptianNationalIdSchema = z
  .string()
  .trim()
  .regex(EgyptianNationalIdRegex, {
    message: 'National ID must be exactly 14 digits starting with 2 (1900-1999) or 3 (2000-2099)',
  })
  .superRefine((val, ctx) => {
    try {
      parseEgyptianNationalId(val);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid Egyptian National ID demographics';
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: msg,
      });
    }
  });

export const EgyptianIdVerificationRequestSchema = z.object({
  nationalId: EgyptianNationalIdSchema,
  auditOperatorId: z.string().optional().default('CLINICIAN_DESK_01'),
});
