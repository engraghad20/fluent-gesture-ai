import { Languages, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Lang, t } from "@/lib/i18n";

export function Header({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <header className="mb-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="relative flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-secondary/30 to-cyan-glow/20 glow-cyan">
          <Sparkles className="size-5 text-cyan-glow" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-glow">
            {t("appTitle", lang)}
          </h1>
          <p className="text-xs text-muted-foreground">{t("tagline", lang)}</p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setLang(lang === "en" ? "ar" : "en")}
        className="gap-2"
      >
        <Languages className="size-4" />
        {lang === "en" ? "العربية" : "English"}
      </Button>
    </header>
  );
}
