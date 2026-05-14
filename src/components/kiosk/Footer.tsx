import { Github, Linkedin, Twitter } from "lucide-react";
import { t, type Lang } from "@/lib/i18n";

export function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="mt-10 border-t border-border/40 pt-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-center md:text-start">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            {t("developedBy", lang)}
          </div>
          <div className="font-display text-sm font-semibold">
            Raghad Mohammed Yassin Alshawafy
          </div>
        </div>
        <div className="flex items-center gap-2">
          {[
            { href: "https://x.com/engraghad02", icon: Twitter, label: "X" },
            { href: "https://www.linkedin.com/in/raghad-alshawafy/", icon: Linkedin, label: "LinkedIn" },
            { href: "https://github.com/engraghad20", icon: Github, label: "GitHub" },
          ].map(s => (
            <a
              key={s.label}
              href={s.href}
              target="_blank" rel="noreferrer"
              aria-label={s.label}
              className="group flex size-10 items-center justify-center rounded-full border border-border/50 transition-all hover:border-cyan-glow/70 hover:glow-cyan"
            >
              <s.icon className="size-4 text-muted-foreground transition-colors group-hover:text-cyan-glow" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
