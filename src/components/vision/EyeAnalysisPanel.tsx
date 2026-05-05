import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  isVideo: boolean;
  analyzing: boolean;
}

/** Visual overlay of "detected" eye landmarks. Purely cosmetic — the real
 *  detection happens server-side (see app.py). */
export function EyeAnalysisPanel({ src, isVideo, analyzing }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        setSize({ w: r.width, h: r.height });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [src]);

  // Heuristic eye-box positions — placeholder until backend returns real coords.
  // Assumed face occupies a centered region ~45% of frame width. Eye boxes are
  // square, side ≈ 15% of face width, centered on each eye.
  const faceW = size.w * 0.45;
  const faceH = faceW * 1.3;
  const faceCx = size.w * 0.5;
  const faceCy = size.h * 0.5;
  const faceTop = faceCy - faceH / 2;
  // Eyes sit ~38% down the face, separated by ~30% of face width
  const eyeY = faceTop + faceH * 0.38;
  const eyeSide = faceW * 0.15;
  const leftEyeCx = faceCx - faceW * 0.18;
  const rightEyeCx = faceCx + faceW * 0.18;
  const leftEye = { x: leftEyeCx - eyeSide / 2, y: eyeY - eyeSide / 2, w: eyeSide, h: eyeSide };
  const rightEye = { x: rightEyeCx - eyeSide / 2, y: eyeY - eyeSide / 2, w: eyeSide, h: eyeSide };

  return (
    <div
      ref={containerRef}
      className={`relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-black ${
        analyzing ? "scanline" : ""
      }`}
    >
      {isVideo ? (
        <video src={src} className="h-full w-full object-contain" autoPlay loop muted playsInline />
      ) : (
        <img src={src} alt="Subject under analysis" className="h-full w-full object-contain" />
      )}

      {/* Eye landmark overlay */}
      {size.w > 0 && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
          {[leftEye, rightEye].map((eye, i) => (
            <g key={i}>
              <rect
                x={eye.x} y={eye.y} width={eye.w} height={eye.h}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                className={analyzing ? "animate-pulse" : ""}
              />
              {/* corner ticks */}
              {[
                [eye.x, eye.y], [eye.x + eye.w, eye.y],
                [eye.x, eye.y + eye.h], [eye.x + eye.w, eye.y + eye.h],
              ].map(([cx, cy], j) => (
                <g key={j}>
                  <line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} stroke="var(--primary)" strokeWidth="2" />
                  <line x1={cx} y1={cy - 6} x2={cx} y2={cy + 6} stroke="var(--primary)" strokeWidth="2" />
                </g>
              ))}
              <text
                x={eye.x} y={eye.y - 6}
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                fill="var(--primary)"
              >
                EYE_{i === 0 ? "L" : "R"} · 224×224
              </text>
            </g>
          ))}
        </svg>
      )}

      {/* HUD corners */}
      <div className="pointer-events-none absolute inset-0">
        {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((p, i) => (
          <div key={i} className={`absolute h-4 w-4 border-primary ${p} ${
            i === 0 ? "border-t-2 border-l-2" :
            i === 1 ? "border-t-2 border-r-2" :
            i === 2 ? "border-b-2 border-l-2" : "border-b-2 border-r-2"
          }`} />
        ))}
      </div>

      {/* status pill */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded border border-primary/40 bg-background/80 px-3 py-1 font-display text-[10px] tracking-widest text-primary backdrop-blur">
        <span className={`h-1.5 w-1.5 rounded-full bg-primary ${analyzing ? "animate-pulse" : ""}`} />
        {analyzing ? "ANALYZING…" : "LANDMARKS LOCKED"}
      </div>
    </div>
  );
}
