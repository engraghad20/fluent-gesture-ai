import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Eye } from "lucide-react";
import { matchVisuals } from "@/lib/speechVisuals";
import type { Lang } from "@/lib/i18n";

interface Props {
  lang: Lang;
  text: string;
}

export function SignVisual({ lang, text }: Props) {
  const cues = matchVisuals(text, lang);

  return (
    <div className="glass mt-4 rounded-xl p-4">
      <div className="mb-3 flex items-center gap-2">
        <Eye className="size-4 text-cyan-glow" />
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {lang === "ar" ? "رسوم توضيحية للأصم" : "Visual cues for the deaf"}
        </h3>
        {cues.length > 0 && (
          <span className="ml-auto rounded-full bg-cyan-glow/15 px-2 py-0.5 text-xs text-cyan-glow">
            <Sparkles className="mr-1 inline size-3" />
            {cues.length}
          </span>
        )}
      </div>

      {cues.length === 0 ? (
        <div className="flex min-h-[110px] items-center justify-center text-center text-sm text-muted-foreground">
          {lang === "ar"
            ? "ستظهر هنا رسوم توضيحية فورية مع كلام الموظف."
            : "Pictograms will appear here in real time as staff speaks."}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <AnimatePresence mode="popLayout">
            {cues.map(c => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.6, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="flex flex-col items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-glow/15 to-secondary/10 p-3 ring-1 ring-cyan-glow/30"
              >
                <motion.span
                  className="text-5xl drop-shadow-[0_0_18px_rgba(34,211,238,0.6)] md:text-6xl"
                  initial={{ rotate: -8 }}
                  animate={{ rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {c.icon}
                </motion.span>
                <span className="text-center text-xs font-semibold leading-tight text-foreground">
                  {lang === "ar" ? c.ar : c.en}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}