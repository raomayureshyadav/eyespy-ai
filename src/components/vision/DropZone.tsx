import { useCallback, useRef, useState } from "react";

interface DropZoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export function DropZone({ onFile, disabled }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files?.[0];
      if (file) onFile(file);
    },
    [onFile, disabled],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`relative cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-all ${
        dragging
          ? "border-primary bg-primary/5 border-glow"
          : "border-border hover:border-primary/60 hover:bg-card/50"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
      />

      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>

      <h3 className="font-display text-lg font-bold tracking-wide text-foreground">
        DROP MEDIA TO ANALYZE
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Drag &amp; drop an image or video, or <span className="text-primary underline">browse files</span>
      </p>
      <div className="mt-4 flex justify-center gap-2 font-display text-[10px] tracking-widest text-muted-foreground">
        <span className="rounded border border-border bg-card/50 px-2 py-1">JPG</span>
        <span className="rounded border border-border bg-card/50 px-2 py-1">PNG</span>
        <span className="rounded border border-border bg-card/50 px-2 py-1">MP4</span>
        <span className="rounded border border-border bg-card/50 px-2 py-1">WEBM</span>
      </div>
    </div>
  );
}
