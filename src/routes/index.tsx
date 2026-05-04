import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/vision/Logo";
import { DropZone } from "@/components/vision/DropZone";
import { EyeAnalysisPanel } from "@/components/vision/EyeAnalysisPanel";
import { ResultsPanel, type DetectionResult } from "@/components/vision/ResultsPanel";
import { Methodology } from "@/components/vision/Methodology";

export const Route = createFileRoute("/")({
  component: Index,
});

interface Upload {
  url: string;
  name: string;
  isVideo: boolean;
}

function Index() {
  const [upload, setUpload] = useState<Upload | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);

  useEffect(() => {
    return () => {
      if (upload) URL.revokeObjectURL(upload.url);
    };
  }, [upload]);

  const handleFile = (file: File) => {
    const isVideo = file.type.startsWith("video/");
    const url = URL.createObjectURL(file);
    setUpload({ url, name: file.name, isVideo });
    setResult(null);
    setAnalyzing(true);

    // Simulated inference. In production this POSTs to the Python backend
    // (see app.py / predict_deepfake) and renders the returned JSON.
    setTimeout(() => {
      // Deterministic-ish "score" from filename so demo feels stable
      const seed = [...file.name].reduce((a, c) => a + c.charCodeAt(0), 0);
      const rand = (offset: number) => ((Math.sin(seed + offset) + 1) / 2);
      const spatial = 0.6 + rand(1) * 0.38;
      const temporal = isVideo ? 0.55 + rand(2) * 0.4 : null;
      const fused = temporal !== null ? (spatial * 0.6 + temporal * 0.4) : spatial;
      const isFake = fused < 0.72;
      setResult({
        label: isFake ? "FAKE" : "REAL",
        confidence: isFake ? 1 - fused * 0.6 : fused,
        spatial,
        temporal,
        blinkRate: isVideo ? 12 + rand(3) * 10 : null,
        pupilConsistency: 0.5 + rand(4) * 0.5,
        reflectionScore: 0.5 + rand(5) * 0.5,
        framesAnalyzed: isVideo ? Math.floor(60 + rand(6) * 240) : 1,
      });
      setAnalyzing(false);
    }, 2400);
  };

  const reset = () => {
    if (upload) URL.revokeObjectURL(upload.url);
    setUpload(null);
    setResult(null);
    setAnalyzing(false);
  };

  return (
    <main className="relative z-10 min-h-screen">
      {/* Header */}
      <header className="border-b border-border/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Logo />
          <div className="hidden items-center gap-6 font-display text-[11px] tracking-widest text-muted-foreground sm:flex">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
              SYSTEM ONLINE
            </span>
            <span>v1.0 · MODEL eye-cnn-v3</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-3 py-1 font-display text-[10px] tracking-widest text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-flicker" />
            FORENSIC DEEPFAKE DETECTION
          </div>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            The eyes don't <span className="text-primary text-glow">lie.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Vision Secure AI inspects the periocular region — pupils, reflections, and blink
            rhythm — to expose synthetic media that fools every other detector.
          </p>
        </div>
      </section>

      {/* Workspace */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        {!upload ? (
          <DropZone onFile={handleFile} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-display text-xs tracking-widest text-muted-foreground">
                  SUBJECT · <span className="text-foreground">{upload.name}</span>
                </div>
                <button
                  onClick={reset}
                  className="font-display text-[11px] tracking-widest text-primary hover:text-primary/80"
                >
                  ↺ NEW SCAN
                </button>
              </div>
              <EyeAnalysisPanel src={upload.url} isVideo={upload.isVideo} analyzing={analyzing} />
            </div>
            <ResultsPanel analyzing={analyzing} result={result} />
          </div>
        )}
      </section>

      <Methodology />

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 font-display text-[11px] tracking-widest text-muted-foreground sm:flex-row">
          <span>VISION SECURE.AI · {new Date().getFullYear()}</span>
          <span>FOR RESEARCH &amp; EDUCATIONAL USE</span>
        </div>
      </footer>
    </main>
  );
}
