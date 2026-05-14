import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/kiosk/Header";
import { VisionHub } from "@/components/kiosk/VisionHub";
import { LiveCaption } from "@/components/kiosk/LiveCaption";
import { Conversation, type ConvMessage } from "@/components/kiosk/Conversation";
import { GestureGrid } from "@/components/kiosk/GestureGrid";
import { Footer } from "@/components/kiosk/Footer";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { speak } from "@/lib/tts";
import { GESTURES, type GestureId } from "@/lib/vision/gestures";
import type { Lang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Raghad Vision AI — Universal Accessibility Kiosk" },
      {
        name: "description",
        content:
          "Real-time bidirectional sign language and speech translation kiosk. Converts hand gestures to voice and live speech into giant accessibility captions.",
      },
    ],
  }),
});

function Index() {
  const [lang, setLang] = useState<Lang>("en");
  const [messages, setMessages] = useState<ConvMessage[]>([]);
  const [recentGesture, setRecentGesture] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.classList.add("dark");
  }, [lang]);

  // Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Tajawal:wght@400;500;700&display=swap";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const speech = useSpeechRecognition(lang === "ar" ? "ar-SA" : "en-US");

  // Pipe finalized speech into conversation
  const lastFinalIdRef = useMemo(() => ({ current: "" }), []);
  useEffect(() => {
    if (!speech.finals.length) return;
    const last = speech.finals[speech.finals.length - 1];
    if (last.id === lastFinalIdRef.current) return;
    lastFinalIdRef.current = last.id;
    if (!last.text) return;
    setMessages(m => [...m, {
      id: last.id,
      speaker: "staff",
      text: last.text,
      t: last.t,
    }]);
  }, [speech.finals, lastFinalIdRef]);

  const onGesture = (id: GestureId) => {
    const g = GESTURES.find(x => x.id === id);
    if (!g) return;
    const text = lang === "ar" ? g.speakAr : g.speakEn;
    setMessages(m => [...m, {
      id: `g-${Date.now()}`,
      speaker: "user",
      text,
      icon: g.icon,
      t: Date.now(),
    }]);
    setRecentGesture(id);
    setTimeout(() => setRecentGesture(curr => curr === id ? null : curr), 1500);
    speak(text, lang === "ar" ? "ar-SA" : "en-US");
  };

  const lastFinal = speech.finals.length ? speech.finals[speech.finals.length - 1].text : "";

  return (
    <div className="mx-auto min-h-screen max-w-[1400px] px-4 py-6 md:px-8 md:py-10">
      <Header lang={lang} setLang={setLang} />

      <main className="grid gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          <VisionHub lang={lang} onGesture={onGesture} />
          <LiveCaption
            lang={lang}
            listening={speech.listening}
            supported={speech.supported}
            interim={speech.interim}
            lastFinal={lastFinal}
            onToggle={() => (speech.listening ? speech.stop() : speech.start())}
          />
        </div>
        <div className="lg:col-span-4">
          <Conversation lang={lang} messages={messages} />
        </div>
        <div className="lg:col-span-12">
          <GestureGrid lang={lang} recent={recentGesture} />
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
