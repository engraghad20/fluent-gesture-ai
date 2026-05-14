let voicesLoaded = false;
function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise(resolve => {
    const v = window.speechSynthesis.getVoices();
    if (v.length) { voicesLoaded = true; return resolve(v); }
    window.speechSynthesis.onvoiceschanged = () => {
      voicesLoaded = true;
      resolve(window.speechSynthesis.getVoices());
    };
  });
}

export async function speak(text: string, lang: "ar-SA" | "en-US") {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const voices = voicesLoaded ? window.speechSynthesis.getVoices() : await loadVoices();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 1.0;
  u.pitch = 1.0;
  const preferred = voices.find(v => v.lang === lang) || voices.find(v => v.lang.startsWith(lang.split("-")[0]));
  if (preferred) u.voice = preferred;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}
