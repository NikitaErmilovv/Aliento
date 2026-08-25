import { cn } from "@/lib/cn";

/**
 * Decorative ambient background: soft purple star-glow blobs echoing the
 * Aliento logo glow, plus faint orbiting line-art. Purely presentational.
 */
export function BackgroundGlow({
  className,
  variant = "hero",
}: {
  className?: string;
  variant?: "hero" | "section";
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className={cn(
          "absolute rounded-full blur-[110px]",
          variant === "hero"
            ? "-top-40 left-1/2 h-[560px] w-[720px] -translate-x-1/2 opacity-60"
            : "-top-24 left-1/3 h-[360px] w-[480px] opacity-30"
        )}
        style={{
          background:
            "radial-gradient(circle, rgba(167,148,251,0.55) 0%, rgba(108,83,221,0.28) 45%, rgba(108,83,221,0) 75%)",
        }}
      />
      <div
        className={cn(
          "absolute rounded-full blur-[100px]",
          variant === "hero"
            ? "top-20 right-[-10%] h-[420px] w-[420px] opacity-40"
            : "bottom-0 right-[-5%] h-[280px] w-[320px] opacity-20"
        )}
        style={{
          background:
            "radial-gradient(circle, rgba(199,188,255,0.45) 0%, rgba(78,58,168,0.2) 55%, rgba(78,58,168,0) 80%)",
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.14]"
        viewBox="0 0 1200 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M -50 620 C 250 700, 450 200, 700 120 S 1150 260, 1260 60"
          stroke="white"
          strokeWidth="1"
        />
        <path
          d="M -80 120 C 180 60, 420 480, 760 520 S 1100 420, 1280 620"
          stroke="white"
          strokeWidth="1"
        />
      </svg>

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, black 40%, transparent 100%)",
        }}
      />
    </div>
  );
}
