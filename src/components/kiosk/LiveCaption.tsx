import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t, type Lang } from "@/lib/i18n";

interface Props {
  lang: Lang;
  listening: boolean;
  supported: boolean;
  interim: string;
  lastFinal: string;
  onToggle: () => void;
}

export function LiveCaption({ lang, listening, supported, interim, lastFinal, onToggle }: Props) {
  const text = interim || lastFinal;
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Radio className={`size-5 ${listening ? "text-success" : "text-muted-foreground"}`} />
            {listening && <span className="absolute inset-0 animate-ping rounded-full bg-success/40" />}
          </div>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            {t("liveCaption", lang)}
          </h2>
          <span className="rounded-full bg-card px-2 py-0.5 text-xs">
            {listening ? t("listening", lang) : t("micOff", lang)}
          </span>
        </div>
        <Button
          onClick={onToggle}
          size="sm"
          variant={listening ? "outline" : "default"}
          className={`gap-2 ${!listening ? "glow-cyan" : ""}`}
          disabled={!supported}
        >
          {listening ? <><MicOff className="size-4"/> {t("stopMic", lang)}</> : <><Mic className="size-4"/> {t("startMic", lang)}</>}
        </Button>
      </div>

      <div className="relative min-h-[180px] rounded-xl bg-background/50 p-6">
        <AnimatePresence mode="wait">
          {text ? (
            <motion.p
              key={text.slice(-30)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="font-display text-3xl font-semibold leading-snug text-foreground text-glow md:text-4xl lg:text-5xl"
            >
              {text}
              {interim && <span className="ml-1 inline-block h-8 w-1 animate-pulse bg-cyan-glow align-middle" />}
            </motion.p>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full min-h-[160px] flex-col items-center justify-center text-center"
            >
              <Mic className="mb-3 size-10 text-muted-foreground/60" />
              <p className="text-base text-muted-foreground">
                {supported
                  ? (listening ? t("listening", lang) : t("startMic", lang))
                  : (lang === "ar" ? "المتصفح لا يدعم التعرف على الصوت" : "Browser does not support speech recognition")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
