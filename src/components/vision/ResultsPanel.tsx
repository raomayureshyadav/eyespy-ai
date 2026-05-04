export interface DetectionResult {
  label: "REAL" | "FAKE";
  confidence: number; // 0..1
  spatial: number;
  temporal: number | null;
  blinkRate: number | null;
  pupilConsistency: number;
  reflectionScore: number;
  framesAnalyzed: number;
}

interface Props {
  analyzing: boolean;
  result: DetectionResult | null;
}

function Bar({ label, value, color = "primary" }: { label: string; value: number; color?: "primary" | "success" | "destructive" | "warning" }) {
  const pct = Math.round(value * 100);
  const colorClass =
    color === "success" ? "bg-success" :
    color === "destructive" ? "bg-destructive" :
    color === "warning" ? "bg-warning" : "bg-primary";
  return (
    <div>
      <div className="mb-1 flex justify-between font-display text-[11px] tracking-wider text-muted-foreground">
        <span>{label}</span>
        <span className="text-foreground">{pct}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className={`h-full ${colorClass} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function ResultsPanel({ analyzing, result }: Props) {
  if (analyzing) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 font-display text-xs tracking-widest text-primary">⟳ INFERENCE IN PROGRESS</div>
        <div className="space-y-3">
          {["Detecting faces", "Cropping eye regions 224×224", "CNN spatial pass", "Temporal coherence check", "Aggregating verdict"].map((step, i) => (
            <div key={i} className="flex items-center gap-3 font-display text-xs">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" style={{ animationDelay: `${i * 200}ms` }} />
              <span className="text-muted-foreground">{step}…</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card/40 p-10 text-center">
        <div className="mx-auto mb-3 h-10 w-10 rounded-full border border-border" />
        <p className="font-display text-xs tracking-widest text-muted-foreground">
          AWAITING INPUT MEDIA
        </p>
      </div>
    );
  }

  const isReal = result.label === "REAL";
  const verdictColor = isReal ? "success" : "destructive";

  return (
    <div className="space-y-4">
      {/* Verdict card */}
      <div className={`rounded-lg border-2 p-6 ${
        isReal ? "border-success/60 bg-success/5" : "border-destructive/60 bg-destructive/5"
      } animate-pulse-glow`}>
        <div className="mb-2 font-display text-[11px] tracking-[0.3em] text-muted-foreground">VERDICT</div>
        <div className="flex items-end justify-between">
          <div className={`font-display text-5xl font-bold tracking-tight ${
            isReal ? "text-success" : "text-destructive"
          } text-glow`}>
            {result.label}
          </div>
          <div className="text-right">
            <div className="font-display text-3xl font-bold text-foreground">
              {Math.round(result.confidence * 100)}<span className="text-base text-muted-foreground">%</span>
            </div>
            <div className="font-display text-[10px] tracking-widest text-muted-foreground">CONFIDENCE</div>
          </div>
        </div>
      </div>

      {/* Sub-scores */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-5">
        <div className="font-display text-xs tracking-widest text-primary">FORENSIC BREAKDOWN</div>
        <Bar label="Spatial CNN score" value={result.spatial} color={verdictColor} />
        {result.temporal !== null && (
          <Bar label="Temporal coherence" value={result.temporal} color={verdictColor} />
        )}
        <Bar label="Pupil geometry" value={result.pupilConsistency} />
        <Bar label="Corneal reflection match" value={result.reflectionScore} />
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3">
        <Metric label="Frames analyzed" value={result.framesAnalyzed.toString()} />
        <Metric
          label="Blink rate"
          value={result.blinkRate !== null ? `${result.blinkRate.toFixed(1)}/min` : "N/A"}
        />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="font-display text-[10px] tracking-widest text-muted-foreground">{label.toUpperCase()}</div>
      <div className="mt-1 font-display text-xl font-bold text-foreground">{value}</div>
    </div>
  );
}
