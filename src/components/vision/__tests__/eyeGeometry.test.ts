import { describe, expect, it } from "vitest";
import {
  ALIGNMENT_TOLERANCE,
  boxCenter,
  computeEyeLayout,
  normalizedOffset,
} from "../eyeGeometry";

/** Ground-truth eye centers (as fractions of the fitted media area) for a
 *  centered, frontal portrait — used as the "expected" reference the overlay
 *  is checked against. Tweak these if the source-of-truth landmarks change. */
const EXPECTED_LEFT_EYE_FRAC = { x: 0.34, y: 0.31 };
const EXPECTED_RIGHT_EYE_FRAC = { x: 0.63, y: 0.31 };

interface Scenario {
  name: string;
  container: { w: number; h: number };
  mediaRatio: number;
}

const scenarios: Scenario[] = [
  { name: "16:9 panel, 16:9 media", container: { w: 1280, h: 720 }, mediaRatio: 16 / 9 },
  { name: "16:9 panel, 4:3 media (pillarbox)", container: { w: 1280, h: 720 }, mediaRatio: 4 / 3 },
  { name: "16:9 panel, 9:16 media (vertical)", container: { w: 1280, h: 720 }, mediaRatio: 9 / 16 },
  { name: "Square panel, 1:1 media", container: { w: 600, h: 600 }, mediaRatio: 1 },
  { name: "Mobile-ish panel, 3:4 media", container: { w: 360, h: 640 }, mediaRatio: 3 / 4 },
];

describe("eye-landmark overlay alignment", () => {
  scenarios.forEach(({ name, container, mediaRatio }) => {
    it(`${name}: rendered eye boxes stay within tolerance of expected landmarks`, () => {
      const layout = computeEyeLayout(container, mediaRatio);

      const expectedLeft = {
        x: layout.mediaX + layout.fittedW * EXPECTED_LEFT_EYE_FRAC.x,
        y: layout.mediaY + layout.fittedH * EXPECTED_LEFT_EYE_FRAC.y,
      };
      const expectedRight = {
        x: layout.mediaX + layout.fittedW * EXPECTED_RIGHT_EYE_FRAC.x,
        y: layout.mediaY + layout.fittedH * EXPECTED_RIGHT_EYE_FRAC.y,
      };

      const offL = normalizedOffset(expectedLeft, boxCenter(layout.leftEye), layout.fittedW);
      const offR = normalizedOffset(expectedRight, boxCenter(layout.rightEye), layout.fittedW);

      // Surface a readable diagnostic if either eye drifts.
      if (offL > ALIGNMENT_TOLERANCE || offR > ALIGNMENT_TOLERANCE) {
        throw new Error(
          `Eye overlay misaligned for "${name}": ` +
            `leftΔ=${(offL * 100).toFixed(2)}% rightΔ=${(offR * 100).toFixed(2)}% ` +
            `(tolerance ${(ALIGNMENT_TOLERANCE * 100).toFixed(1)}%)`,
        );
      }

      expect(offL).toBeLessThanOrEqual(ALIGNMENT_TOLERANCE);
      expect(offR).toBeLessThanOrEqual(ALIGNMENT_TOLERANCE);
    });
  });

  it("flags an obviously bad layout (regression guard for the cheekbone bug)", () => {
    // Reproduce the previous bug: eye boxes positioned ~10% too low.
    const layout = computeEyeLayout({ w: 1280, h: 720 }, 16 / 9);
    const expected = {
      x: layout.mediaX + layout.fittedW * 0.34,
      y: layout.mediaY + layout.fittedH * 0.31,
    };
    const buggyCenter = { x: expected.x, y: expected.y + layout.fittedH * 0.1 };
    const off = normalizedOffset(expected, buggyCenter, layout.fittedW);
    expect(off).toBeGreaterThan(ALIGNMENT_TOLERANCE);
  });

  it("eye boxes fall fully inside the fitted media area", () => {
    for (const { container, mediaRatio } of scenarios) {
      const { mediaX, mediaY, fittedW, fittedH, leftEye, rightEye } = computeEyeLayout(
        container,
        mediaRatio,
      );
      for (const eye of [leftEye, rightEye]) {
        expect(eye.x).toBeGreaterThanOrEqual(mediaX);
        expect(eye.y).toBeGreaterThanOrEqual(mediaY);
        expect(eye.x + eye.w).toBeLessThanOrEqual(mediaX + fittedW + 0.001);
        expect(eye.y + eye.h).toBeLessThanOrEqual(mediaY + fittedH + 0.001);
      }
    }
  });
});
