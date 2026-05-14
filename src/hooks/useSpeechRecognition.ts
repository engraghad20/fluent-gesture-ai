import { useEffect, useRef, useState, useCallback } from "react";

type SR = any;

declare global {
  interface Window {
    SpeechRecognition?: new () => SR;
    webkitSpeechRecognition?: new () => SR;
  }
}

export interface SpeechState {
  listening: boolean;
  supported: boolean;
  interim: string;
  finals: { id: string; text: string; t: number }[];
  error: string | null;
}

export function useSpeechRecognition(lang: "ar-SA" | "en-US") {
  const [state, setState] = useState<SpeechState>({
    listening: false,
    supported: typeof window !== "undefined" &&
      !!(window.SpeechRecognition || window.webkitSpeechRecognition),
    interim: "",
    finals: [],
    error: null,
  });
  const recRef = useRef<SR | null>(null);
  const wantOnRef = useRef(false);
  const langRef = useRef(lang);
  langRef.current = lang;

  const create = useCallback(() => {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) return null;
    const r = new Ctor();
    r.continuous = true;
    r.interimResults = true;
    r.lang = langRef.current;
    r.onresult = (e: any) => {
      let interim = "";
      const newFinals: { id: string; text: string; t: number }[] = [];
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        const t = res[0].transcript;
        if (res.isFinal) {
          newFinals.push({ id: `${Date.now()}-${i}`, text: t.trim(), t: Date.now() });
        } else {
          interim += t;
        }
      }
      setState(s => ({
        ...s,
        interim,
        finals: newFinals.length ? [...s.finals, ...newFinals].slice(-50) : s.finals,
      }));
    };
    r.onerror = (e: any) => {
      const err = e?.error || "unknown";
      setState(s => ({ ...s, error: err }));
      // auto recover from no-speech / network etc.
      if (wantOnRef.current && (err === "no-speech" || err === "network" || err === "audio-capture")) {
        setTimeout(() => safeStart(), 500);
      }
    };
    r.onend = () => {
      setState(s => ({ ...s, listening: false, interim: "" }));
      if (wantOnRef.current) setTimeout(() => safeStart(), 200);
    };
    r.onstart = () => setState(s => ({ ...s, listening: true, error: null }));
    return r;
  }, []);

  const safeStart = useCallback(() => {
    try {
      if (!recRef.current) recRef.current = create();
      if (!recRef.current) return;
      recRef.current.lang = langRef.current;
      recRef.current.start();
    } catch {
      // already started or similar
    }
  }, [create]);

  const start = useCallback(() => {
    wantOnRef.current = true;
    safeStart();
  }, [safeStart]);

  const stop = useCallback(() => {
    wantOnRef.current = false;
    try { recRef.current?.stop(); } catch {}
  }, []);

  // Restart on lang change while listening
  useEffect(() => {
    if (wantOnRef.current && recRef.current) {
      try { recRef.current.stop(); } catch {}
    }
  }, [lang]);

  useEffect(() => () => { wantOnRef.current = false; try { recRef.current?.stop(); } catch {} }, []);

  return { ...state, start, stop };
}
