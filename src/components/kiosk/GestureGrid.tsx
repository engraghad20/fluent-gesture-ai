import { motion } from "framer-motion";
import { GESTURES } from "@/lib/vision/gestures";
import { t, type Lang } from "@/lib/i18n";

export function GestureGrid({ lang, recent }: { lang: Lang; recent: string | null }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold tracking-tight">
          {t("gestureLibrary", lang)}
        </h2>
        <span className="text-xs text-muted-foreground">{GESTURES.length}</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {GESTURES.map(g => {
          const active = recent === g.id;
          return (
            <motion.div
              key={g.id}
              animate={active ? { scale: [1, 1.06, 1] } : { scale: 1 }}
              transition={{ duration: 0.6 }}
              className={`relative overflow-hidden rounded-xl border bg-card/40 p-3 text-center transition-colors ${
                active ? "border-cyan-glow/70 glow-cyan" : "border-border/40"
              }`}
            >
              <div className="mb-1.5 text-3xl">{g.icon}</div>
              <div className="text-sm font-medium leading-tight">
                {lang === "ar" ? g.ar : g.en}
              </div>
              <div className="text-[10px] text-muted-foreground" dir={lang === "ar" ? "ltr" : "rtl"}>
                {lang === "ar" ? g.en : g.ar}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
