import type { PageHeaderShape, VectorCommand } from './page-header-shapes';

/** A few filled vector ribbons, or twelve staggered drops. No particle timers or React updates. */
export function headerDetails(shape: PageHeaderShape, time: number): VectorCommand[] {
  'worklet';
  const paths: VectorCommand[] = [];
  const phase = time * Math.PI * 2;
  if (shape === 'smoke') {
    for (let index = 0; index < 3; index++) {
      const p = phase / 12 + index * 2;
      const x = 524 + index * 176 + Math.sin(p) * 18;
      const y = 42 + Math.cos(p + index) * 9;
      const curl = Math.sin(p + 1) * 8;
      paths.push(
        ['M', x - 28, y + 23],
        ['C', x + 2, y + 25, x + 90, y + 14, x + 80, y - 8],
        ['C', x + 66, y - 34 + curl, x + 9, y - 15, x + 38, y - 7],
        ['C', x + 51, y - 3, x + 65, y - 10, x + 57, y - 17],
        ['C', x + 77, y - 15, x + 68, y + 6, x + 45, y + 5],
        ['C', x + 14, y + 4, x + 14, y - 25, x + 46, y - 28],
        ['C', x + 105, y - 35 + curl, x + 115, y + 19, x + 55, y + 24],
        ['C', x + 22, y + 29, x - 5, y + 27, x - 28, y + 23],
        ['Z'],
      );
    }
  } else if (shape === 'water') {
    for (let index = 0; index < 3; index++) {
      const p = phase / 6 + index * 2;
      const x = 490 + index * 180 + Math.sin(p) * 24;
      const y = 30 + index * 6 + Math.cos(p) * 8;
      const swell = Math.sin(p + 1) * 12;
      paths.push(
        ['M', x, y],
        ['C', x + 48, y - 16 - swell, x + 86, y + 10, x + 144, y - 3],
        ['C', x + 91, y + 17, x + 45, y - 9 - swell, x, y],
        ['Z'],
      );
    }
  } else if (shape === 'rain') {
    for (let index = 0; index < 12; index++) {
      const duration = 1.5 + (index % 3) * 0.5;
      const progress = (time / duration + index * 0.381966) % 1;
      const visible = Math.sin(progress * Math.PI);
      const x = 468 + index * 45 - progress * 13;
      const y = 8 + progress * 76;
      const width = 2.8 * visible;
      const length = (10 + (index % 4) * 3) * visible;
      paths.push(
        ['M', x + 3 * visible, y - length],
        ['C', x + width, y - 3 * visible, x + width, y + 2 * visible, x, y + 3 * visible],
        ['C', x - width, y + 3 * visible, x - width, y, x + 3 * visible, y - length],
        ['Z'],
      );
      const ripple = Math.max(0, (progress - 0.72) / 0.28);
      const radius = ripple * 17;
      const thickness = Math.sin(ripple * Math.PI) * 1.4;
      paths.push(
        ['M', x - radius, 86],
        ['C', x - radius, 86 - thickness, x + radius, 86 - thickness, x + radius, 86],
        ['C', x + radius, 86 + thickness, x - radius, 86 + thickness, x - radius, 86],
        ['Z'],
      );
    }
  }
  return paths;
}
