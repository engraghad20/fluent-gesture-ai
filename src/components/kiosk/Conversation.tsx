import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hand, Volume2 } from "lucide-react";
import { t, type Lang } from "@/lib/i18n";

export interface ConvMessage {
  id: string;
  speaker: "user" | "staff";
  text: string;
  t: number;
  icon?: string;
}

export function Conversation({ lang, messages }: { lang: Lang; messages: ConvMessage[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div className="glass flex h-full min-h-[420px] flex-col rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold tracking-tight">
          {t("conversation", lang)}
        </h2>
        <span className="rounded-full bg-card px-2 py-0.5 text-xs text-muted-foreground">
          {messages.length}
        </span>
      </div>
      <div ref={ref} className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
            {t("emptyConv", lang)}
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map(m => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              className={`flex gap-3 ${m.speaker === "user" ? "" : "flex-row-reverse"}`}
            >
              <div className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                m.speaker === "user"
                  ? "bg-cyan-glow/15 text-cyan-glow"
                  : "bg-secondary/20 text-secondary"
              }`}>
                {m.speaker === "user" ? <Hand className="size-4" /> : <Volume2 className="size-4" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                m.speaker === "user"
                  ? "bg-cyan-glow/10 text-foreground"
                  : "bg-card text-foreground"
              }`}>
                <div className="mb-0.5 flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span>{m.speaker === "user" ? t("user", lang) : t("staff", lang)}</span>
                  <span>·</span>
                  <span>{new Date(m.t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <div className="text-base leading-snug">
                  {m.icon && <span className="mr-1.5">{m.icon}</span>}
                  {m.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
