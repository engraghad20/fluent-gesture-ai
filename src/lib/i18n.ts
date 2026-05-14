export type Lang = "en" | "ar";

export const T = {
  appTitle: { en: "Raghad Vision AI", ar: "رغد فيجن AI" },
  tagline: {
    en: "Universal Accessibility Kiosk",
    ar: "كشك التواصل الشامل للوصول",
  },
  visionHub: { en: "Vision Hub", ar: "مركز الرؤية" },
  startCamera: { en: "Start Camera", ar: "تشغيل الكاميرا" },
  stopCamera: { en: "Stop Camera", ar: "إيقاف الكاميرا" },
  detecting: { en: "Detecting…", ar: "جارٍ الكشف…" },
  noHand: { en: "Show your hand to begin", ar: "أظهر يدك للبدء" },
  confidence: { en: "AI Confidence", ar: "ثقة الذكاء الاصطناعي" },
  conversation: { en: "Conversation", ar: "المحادثة" },
  liveCaption: { en: "Live Caption", ar: "الترجمة الحيّة" },
  micOn: { en: "Microphone Active", ar: "الميكروفون يعمل" },
  micOff: { en: "Microphone Off", ar: "الميكروفون متوقف" },
  startMic: { en: "Activate Microphone", ar: "تفعيل الميكروفون" },
  stopMic: { en: "Pause Microphone", ar: "إيقاف الميكروفون" },
  gestureLibrary: { en: "Gesture Library", ar: "مكتبة الإيماءات" },
  user: { en: "User (Sign)", ar: "المستخدم (إيماءة)" },
  staff: { en: "Staff (Voice)", ar: "الموظف (صوت)" },
  language: { en: "Language", ar: "اللغة" },
  emptyConv: { en: "Conversation will appear here.", ar: "ستظهر المحادثة هنا." },
  cameraNeeded: { en: "Camera access required", ar: "يلزم الوصول إلى الكاميرا" },
  cameraDesc: {
    en: "We need your camera to translate sign language in real time. Your video never leaves this device.",
    ar: "نحتاج إلى الكاميرا لترجمة لغة الإشارة لحظيًا. الفيديو لا يغادر جهازك أبدًا.",
  },
  micNeeded: { en: "Microphone permission denied", ar: "تم رفض إذن الميكروفون" },
  fps: { en: "FPS", ar: "إطار/ث" },
  listening: { en: "Listening…", ar: "جارٍ الاستماع…" },
  developedBy: { en: "Developed by", ar: "تطوير" },
} as const;

export type TKey = keyof typeof T;
export const t = (k: TKey, lang: Lang) => T[k][lang];
