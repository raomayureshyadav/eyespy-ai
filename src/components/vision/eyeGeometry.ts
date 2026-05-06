/** Pure geometry helpers for eye-landmark overlay.
 *  Extracted so the alignment can be unit-tested without rendering React. */

export interface ContainerSize {
  w: number;
  h: number;
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface EyeLayout {
  mediaX: number;
  mediaY: number;
  fittedW: number;
  fittedH: number;
  leftEye: Box;
  rightEye: Box;
}

/** Compute the object-contain fitted media area + heuristic eye boxes.
 *  Mirrors the logic in EyeAnalysisPanel so tests stay in sync. */
export function computeEyeLayout(container: ContainerSize, mediaRatio: number): EyeLayout {
  const { w, h } = container;
  const fittedW = w / h > mediaRatio ? h * mediaRatio : w;
  const fittedH = w / h > mediaRatio ? h : w / mediaRatio;
  const mediaX = (w - fittedW) / 2;
  const mediaY = (h - fittedH) / 2;

  const faceW = fittedW * 0.58;
  const eyeSide = faceW * 0.15;
  const eyeY = mediaY + fittedH * 0.31;
  const leftEyeCx = mediaX + fittedW * 0.34;
  const rightEyeCx = mediaX + fittedW * 0.63;

  return {
    mediaX,
    mediaY,
    fittedW,
    fittedH,
    leftEye: { x: leftEyeCx - eyeSide / 2, y: eyeY - eyeSide / 2, w: eyeSide, h: eyeSide },
    rightEye: { x: rightEyeCx - eyeSide / 2, y: eyeY - eyeSide / 2, w: eyeSide, h: eyeSide },
  };
}

export function boxCenter(b: Box): { x: number; y: number } {
  return { x: b.x + b.w / 2, y: b.y + b.h / 2 };
}

/** Euclidean distance between two points, normalised by the fitted media width.
 *  Returns a fractional offset (0 = perfect, 0.05 = 5% of frame width off). */
export function normalizedOffset(
  expected: { x: number; y: number },
  actual: { x: number; y: number },
  fittedW: number,
): number {
  const dx = expected.x - actual.x;
  const dy = expected.y - actual.y;
  return Math.hypot(dx, dy) / fittedW;
}

/** Threshold above which we consider an overlay misaligned. */
export const ALIGNMENT_TOLERANCE = 0.04; // 4% of frame width
