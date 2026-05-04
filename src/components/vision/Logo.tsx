export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="text-primary">
          <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
          <path d="M4 18 C 9 10, 27 10, 32 18 C 27 26, 9 26, 4 18 Z" stroke="currentColor" strokeWidth="1.6" fill="none" />
          <circle cx="18" cy="18" r="5" stroke="currentColor" strokeWidth="1.6" fill="none" />
          <circle cx="18" cy="18" r="2" fill="currentColor" />
          <circle cx="20" cy="16" r="0.8" fill="var(--background)" />
        </svg>
        <div className="absolute inset-0 blur-md bg-primary/40 -z-10 rounded-full" />
      </div>
      <div className="font-display leading-none">
        <div className="text-[11px] tracking-[0.3em] text-muted-foreground">VISION</div>
        <div className="text-base font-bold tracking-widest text-foreground">SECURE<span className="text-primary">.AI</span></div>
      </div>
    </div>
  );
}
