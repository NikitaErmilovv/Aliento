import { Send } from "lucide-react";
import { cn } from "@/lib/cn";
import { maxShareUrl, telegramUrl } from "@/lib/messengers";

function MaxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm3.2 5.5v7h2.1v-2.4l1.9 2.4H13l-2.2-2.7L13 9.5h-2.1l-1.7 2.2V9.5H7.2zm8.1 0c-1.8 0-3 1.2-3 3.5s1.2 3.5 3 3.5 3-1.2 3-3.5-1.2-3.5-3-3.5zm0 1.7c.7 0 1.1.6 1.1 1.8s-.4 1.8-1.1 1.8-1.1-.6-1.1-1.8.4-1.8 1.1-1.8z" />
    </svg>
  );
}

export function MessengerButtons({
  size = "sm",
  message,
  className,
}: {
  size?: "sm" | "md";
  message?: string;
  className?: string;
}) {
  const tg = telegramUrl(message);
  const max = maxShareUrl(message);

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap", className)}>
      <a
        href={tg}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("btn btn-primary inline-flex items-center justify-center gap-2", size === "sm" && "btn-sm")}
      >
        <Send className="h-4 w-4 shrink-0" strokeWidth={2.25} />
        Telegram
      </a>
      <a
        href={max}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Открыть Max"
        className={cn("btn btn-secondary inline-flex items-center justify-center gap-2", size === "sm" && "btn-sm")}
      >
        <MaxIcon className="h-4 w-4 shrink-0" />
        Max
      </a>
    </div>
  );
}
