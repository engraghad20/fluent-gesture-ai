export interface VisualCue {
  id: string;
  icon: string;
  en: string;
  ar: string;
  keywordsEn: RegExp;
  keywordsAr: RegExp;
}

const AR_DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;

export const VISUAL_CUES: VisualCue[] = [
  {
    id: "greeting",
    icon: "👋",
    en: "Welcome",
    ar: "ترحيب",
    keywordsEn: /\b(hello|hi|hey|welcome|greetings|good\s*(morning|evening|afternoon)|how\s*are\s*you)\b/i,
    keywordsAr: /(ترحيب|مرحبا|مرحبه|اهلا|اهلن|اهلين|حياك|السلام|صباح\s*الخير|مساء\s*الخير|كيفك|كيف\s*حالك)/i,
  },
  {
    id: "yes",
    icon: "✅",
    en: "Yes",
    ar: "نعم",
    keywordsEn: /\b(yes|yeah|yep|sure|ok|okay|correct|confirmed|approved|agree|accepted|right|true|of\s*course)\b/i,
    keywordsAr: /(نعم|ايه|ايوا|ايوه|اي|تمام|اوكي|اوك|موافق|اكيد|صح|صحيح|مؤكد|قبول|قبلت|تم)/i,
  },
  {
    id: "no",
    icon: "❌",
    en: "No",
    ar: "لا",
    keywordsEn: /\b(no|nope|not|never|cannot|can't|cant|denied|rejected|refused|declined|not\s*allowed|sorry)\b/i,
    keywordsAr: /(^|\s)(لا|كلا|مو|مش|ليس|ممنوع|مرفوض|ارفض|رفض|غير\s*مسموح|ما\s*اقدر|اسف|اعتذر)(\s|$)/i,
  },
  {
    id: "wait",
    icon: "⏳",
    en: "Please wait",
    ar: "انتظر",
    keywordsEn: /\b(wait|waiting|hold\s*on|one\s*moment|a\s*moment|just\s*a\s*(sec|second|minute)|please\s*wait|stay\s*here)\b/i,
    keywordsAr: /(انتظر|انتظري|انتظار|استنى|استني|اصبر|اصبري|لحظة|دقيقة|ثانية|انتبه\s*لحظة)/i,
  },
  {
    id: "id",
    icon: "🪪",
    en: "ID card",
    ar: "الهوية",
    keywordsEn: /\b(id|identity|identification|id\s*card|national\s*id|passport|license|licence|iqama|residency|card)\b/i,
    keywordsAr: /(هوية|الهويه|الهوية|بطاقة|بطاقه|جواز|الجواز|رخصة|رخصه|اقامة|اقامه|إقامة|الاقامة|الاقامه)/i,
  },
  {
    id: "payment",
    icon: "💳",
    en: "Payment",
    ar: "الدفع",
    keywordsEn: /\b(pay|payment|paid|card|cash|visa|mada|apple\s*pay|amount|invoice|bill|fee|fees|price|cost|receipt)\b/i,
    keywordsAr: /(دفع|الدفع|ادفع|تدفع|مدفوع|بطاقة|بطاقه|مدى|فيزا|كاش|نقد|فاتورة|فاتوره|مبلغ|رسوم|سعر|تكلفة|تكلفه|ايصال)/i,
  },
  {
    id: "doctor",
    icon: "🩺",
    en: "Doctor",
    ar: "طبيب",
    keywordsEn: /\b(doctor|physician|clinic|hospital|nurse|medical|medicine|patient|appointment\s*with\s*doctor)\b/i,
    keywordsAr: /(طبيب|الطبيب|دكتور|الدكتور|عيادة|عياده|مستشفى|ممرض|ممرضة|ممرضه|طبي|مريض|دواء)/i,
  },
  {
    id: "appointment",
    icon: "📅",
    en: "Appointment / Time",
    ar: "موعد / وقت",
    keywordsEn: /\b(appointment|booking|reservation|schedule|scheduled|date|time|calendar|today|tomorrow|timer|temporary|minute|hour)\b/i,
    keywordsAr: /(موعد|مواعيد|حجز|محجوز|جدول|تاريخ|وقت|الوقت|تقويم|اليوم|بكرة|بكره|ساعة|ساعه|دقيقة|دقيقه|مؤقت)/i,
  },
  {
    id: "urgent",
    icon: "🙏",
    en: "Urgent / Please",
    ar: "عاجل / رجاءً",
    keywordsEn: /\b(urgent|emergency|important|asap|quickly|immediately|please|kindly|need\s*now|right\s*now)\b/i,
    keywordsAr: /(عاجل|طارئ|طوارئ|ضروري|مهم|بسرعة|فورا|الان|الحين|رجاء|رجاءا|لو\s*سمحت|من\s*فضلك|تكفى|تكفين)/i,
  },
  {
    id: "warning",
    icon: "⚠️",
    en: "Alert / Warning",
    ar: "تنبيه",
    keywordsEn: /\b(alert|warning|careful|attention|caution|notice|important|risk|danger|problem|issue)\b/i,
    keywordsAr: /(تنبيه|تحذير|انتباه|انتبه|انتبهي|حذر|احذر|خطر|مشكلة|مشاكل|ملاحظة|ملاحظه)/i,
  },
];

export function normalizeSpeechText(text: string): string {
  return text
    .toLowerCase()
    .replace(AR_DIACRITICS, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ـ/g, "")
    .replace(/[،؛؟]/g, " ")
    .replace(/[^\p{L}\p{N}\s?'’-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchVisuals(text: string): VisualCue[] {
  const normalized = normalizeSpeechText(text);
  if (!normalized) return [];

  const matched: VisualCue[] = [];
  const seen = new Set<string>();
  for (const cue of VISUAL_CUES) {
    cue.keywordsEn.lastIndex = 0;
    cue.keywordsAr.lastIndex = 0;
    if ((cue.keywordsEn.test(normalized) || cue.keywordsAr.test(normalized)) && !seen.has(cue.id)) {
      matched.push(cue);
      seen.add(cue.id);
    }
  }
  return matched;
}