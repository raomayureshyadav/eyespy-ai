const items = [
  {
    n: "01",
    title: "Face & Eye Localization",
    body: "OpenCV with MTCNN (or Haar Cascades) isolates the face, then crops both eye regions to a normalized 224×224 patch — the canonical input for our CNN.",
  },
  {
    n: "02",
    title: "Spatial CNN Inference",
    body: "A convolutional feature extractor scrutinizes pupil geometry, iris texture, and corneal light reflections. Generative models routinely fail to produce physically consistent specular highlights between left & right eyes.",
  },
  {
    n: "03",
    title: "Temporal Analysis (Video)",
    body: "Frames are sampled across the clip. Blink frequency, duration, and inter-eye synchrony are checked against natural human distributions. Deepfakes commonly exhibit suppressed or unnatural blinking.",
  },
  {
    n: "04",
    title: "Probabilistic Verdict",
    body: "Spatial and temporal scores are fused into a single calibrated probability — surfaced as REAL or FAKE with a confidence percentage.",
  },
];

export function Methodology() {
  return (
    <section className="border-t border-border bg-card/30 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-2xl">
          <div className="font-display text-xs tracking-[0.3em] text-primary">// METHODOLOGY</div>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How the eye reveals the lie.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Vision Secure AI focuses on the periocular region — the most information-dense area of
            the human face. Our pipeline mirrors techniques validated on the
            <span className="text-foreground"> DFDC</span> and
            <span className="text-foreground"> FaceForensics++</span> benchmark datasets.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((it) => (
            <div key={it.n} className="group rounded-lg border border-border bg-card p-6 transition hover:border-primary/60 hover:bg-card/80">
              <div className="mb-3 flex items-center gap-3">
                <span className="font-display text-2xl font-bold text-primary text-glow">{it.n}</span>
                <h3 className="font-display text-lg font-bold tracking-wide text-foreground">{it.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{it.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-primary/30 bg-primary/5 p-5">
          <div className="font-display text-[11px] tracking-widest text-primary">TRAINING CORPUS</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Models are trained and evaluated on combined samples from
            <span className="font-display text-foreground"> DFDC</span> (Facebook Deepfake Detection Challenge,
            ~100k clips) and
            <span className="font-display text-foreground"> FaceForensics++</span> (1000 sequences across
            DeepFakes, Face2Face, FaceSwap, NeuralTextures manipulations) — establishing robustness
            across diverse generation methods.
          </p>
        </div>
      </div>
    </section>
  );
}
