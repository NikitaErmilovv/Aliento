"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toggleDemoModeAction } from "@/actions/admin";
import { cn } from "@/lib/cn";

export function DemoModeToggle({ demoMode }: { demoMode: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="mx-3 mb-4 rounded-xl border border-border bg-surface p-3 lg:mx-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-foreground">Режим данных</p>
          <p className="mt-0.5 text-[10px] leading-relaxed text-muted-dim">
            {demoMode ? "Демо-данные включены" : "Только реальные данные"}
          </p>
        </div>
        <button
          type="button"
          disabled={pending}
          role="switch"
          aria-checked={demoMode}
          aria-label={demoMode ? "Выключить демо-данные" : "Включить демо-данные"}
          onClick={() => {
            startTransition(async () => {
              await toggleDemoModeAction(!demoMode);
              router.refresh();
            });
          }}
          className={cn(
            "relative h-7 w-12 shrink-0 rounded-full border transition-colors disabled:opacity-60",
            demoMode ? "border-accent-400 bg-accent-500/30" : "border-border bg-background-elevated"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-accent-300 transition-transform",
              demoMode ? "left-[calc(100%-1.375rem)]" : "left-0.5"
            )}
          />
        </button>
      </div>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-muted-dim">
        <span className={cn(!demoMode && "text-accent-300")}>Реал</span>
        <span className={cn(demoMode && "text-accent-300")}>Демо</span>
      </div>
    </div>
  );
}
