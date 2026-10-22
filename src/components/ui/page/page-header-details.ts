import type { PageHeaderShape, VectorCommand } from './page-header-shapes';

/** A few filled vector ribbons, or twelve staggered drops. No particle timers or React updates. */
export function headerDetails(shape: PageHeaderShape, time: number): VectorCommand[] {
  'worklet';
  const paths: VectorCommand[] = [];
  if (shape === 'rain') {
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
