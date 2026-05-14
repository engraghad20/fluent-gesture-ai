// Map common spoken words/phrases (AR + EN) to large pictograms for deaf users.
// Each entry has keyword regexes (case-insensitive) and a visual.

export interface VisualCue {
  id: string;
  icon: string;        // emoji pictogram
  en: string;          // English label
  ar: string;          // Arabic label
  keywordsEn: RegExp;
  keywordsAr: RegExp;
}

export const VISUAL_CUES: VisualCue[] = [
  {
    id: "greeting",
    icon: "👋",
    en: "Hello / Welcome",
    ar: "مرحبًا / أهلًا",
    keywordsEn: /\b(hello|hi|hey|welcome|good\s*(morning|evening|afternoon))\b/i,
    keywordsAr: /(مرحبا|مرحبًا|اهلا|أهلًا|أهلا|السلام|صباح|مساء)/,
  },
  {
    id: "yes",
    icon: "✅",
    en: "Yes / Confirmed",
    ar: "نعم / مؤكد",
    keywordsEn: /\b(yes|yeah|sure|of course|correct|confirmed|approved|okay|ok)\b/i,
    keywordsAr: /(نعم|أيوه|ايوه|تمام|أكيد|اكيد|موافق|تم|صح|صحيح)/,
  },
  {
    id: "no",
    icon: "❌",
    en: "No / Not allowed",
    ar: "لا / غير مسموح",
    keywordsEn: /\b(no|not\s*allowed|denied|rejected|cannot|can't|sorry)\b/i,
    keywordsAr: /(^|\s)(لا|ممنوع|مرفوض|غير\s*مسموح|آسف|اسف|متأسف)/,
  },
  {
    id: "wait",
    icon: "⏳",
    en: "Please wait",
    ar: "انتظر من فضلك",
    keywordsEn: /\b(wait|hold on|one moment|just a (sec|second|minute)|please wait)\b/i,
    keywordsAr: /(انتظر|انتظري|لحظة|دقيقة|ثانية|من\s*فضلك\s*انتظر)/,
  },
  {
    id: "id",
    icon: "🪪",
    en: "Show ID",
    ar: "أظهر الهوية",
    keywordsEn: /\b(id|identification|passport|license|iqama|emirates id|national id)\b/i,
    keywordsAr: /(هوية|الهوية|جواز|رخصة|إقامة|اقامة|بطاقة)/,
  },
  {
    id: "sign",
    icon: "✍️",
    en: "Please sign",
    ar: "وقّع من فضلك",
    keywordsEn: /\b(sign here|signature|please sign)\b/i,
    keywordsAr: /(وقّع|وقع|توقيع|التوقيع)/,
  },
  {
    id: "pay",
    icon: "💳",
    en: "Payment",
    ar: "الدفع",
    keywordsEn: /\b(pay|payment|card|cash|amount|invoice|bill|price|cost|fee)\b/i,
    keywordsAr: /(ادفع|دفع|الدفع|بطاقة|نقدا|نقدًا|فاتورة|سعر|تكلفة|رسوم|مبلغ)/,
  },
  {
    id: "money",
    icon: "💰",
    en: "Money / Riyals",
    ar: "نقود / ريال",
    keywordsEn: /\b(riyal|riyals|sar|aed|usd|dollars?|money)\b/i,
    keywordsAr: /(ريال|درهم|دولار|نقود|فلوس|مال)/,
  },
  {
    id: "phone",
    icon: "📱",
    en: "Phone number",
    ar: "رقم الجوال",
    keywordsEn: /\b(phone|mobile|number|contact|call you)\b/i,
    keywordsAr: /(جوال|هاتف|رقم|اتصال|تواصل)/,
  },
  {
    id: "appointment",
    icon: "📅",
    en: "Appointment",
    ar: "موعد",
    keywordsEn: /\b(appointment|booking|schedule|date|time|reservation)\b/i,
    keywordsAr: /(موعد|حجز|جدول|تاريخ|وقت)/,
  },
  {
    id: "doctor",
    icon: "🩺",
    en: "Doctor / Clinic",
    ar: "طبيب / عيادة",
    keywordsEn: /\b(doctor|clinic|hospital|nurse|medical)\b/i,
    keywordsAr: /(طبيب|دكتور|عيادة|مستشفى|ممرض|طبي)/,
  },
  {
    id: "help",
    icon: "🆘",
    en: "Help available",
    ar: "المساعدة متاحة",
    keywordsEn: /\b(help|assist|support|need help)\b/i,
    keywordsAr: /(مساعدة|أساعدك|اساعدك|دعم|محتاج)/,
  },
  {
    id: "follow",
    icon: "➡️",
    en: "Follow me",
    ar: "اتبعني",
    keywordsEn: /\b(follow me|come with me|this way|over here)\b/i,
    keywordsAr: /(اتبعني|تعال\s*معي|من\s*هنا|هنا)/,
  },
  {
    id: "sit",
    icon: "🪑",
    en: "Please sit",
    ar: "اجلس من فضلك",
    keywordsEn: /\b(sit down|have a seat|please sit)\b/i,
    keywordsAr: /(اجلس|تفضل\s*بالجلوس|اقعد)/,
  },
  {
    id: "thanks",
    icon: "🙏",
    en: "Thank you",
    ar: "شكرًا",
    keywordsEn: /\b(thank you|thanks|appreciate)\b/i,
    keywordsAr: /(شكرا|شكرًا|مشكور|أقدر)/,
  },
  {
    id: "done",
    icon: "🎉",
    en: "All done",
    ar: "تم بنجاح",
    keywordsEn: /\b(done|completed|finished|success|all set|ready)\b/i,
    keywordsAr: /(تم|انتهى|جاهز|مكتمل|بنجاح)/,
  },
  {
    id: "warning",
    icon: "⚠️",
    en: "Warning",
    ar: "تنبيه",
    keywordsEn: /\b(warning|careful|attention|caution|important)\b/i,
    keywordsAr: /(تنبيه|انتباه|حذار|احذر|مهم)/,
  },
  {
    id: "question",
    icon: "❓",
    en: "Question",
    ar: "سؤال",
    keywordsEn: /\?|\b(what|how|when|where|why|which|who)\b/i,
    keywordsAr: /\؟|\?|(ما|ماذا|كيف|متى|أين|اين|لماذا|ليش|من)/,
  },
];

export function matchVisuals(text: string, lang: "ar" | "en"): VisualCue[] {
  if (!text) return [];
  const matched: VisualCue[] = [];
  const seen = new Set<string>();
  for (const cue of VISUAL_CUES) {
    const re = lang === "ar" ? cue.keywordsAr : cue.keywordsEn;
    if (re.test(text) && !seen.has(cue.id)) {
      matched.push(cue);
      seen.add(cue.id);
    }
  }
  return matched.slice(0, 6);
}