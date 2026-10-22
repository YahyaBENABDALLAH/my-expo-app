import type { SkPathBuilder } from '@shopify/react-native-skia';
import type { PageHeaderShape } from '@/constants/header-motion';

export type { PageHeaderShape } from '@/constants/header-motion';

export const HEADER_CURVE_START = 400;
export const HEADER_MOTION_PERIOD = 120;

type Cubic = readonly [number, number, number, number, number, number];
export type VectorCommand =
  ['M' | 'L', number, number] | ['C', number, number, number, number, number, number] | ['Z'];

/** Original vector artwork in a 1000 × 100 header. The title's leading 40% stays level. */
export const headerShapeCurves = {
  ribbon: {
    front: [
      [500, 100, 540, 62, 650, 62],
      [760, 62, 880, 94, 1120, 50],
    ],
    back: [
      [510, 100, 560, 84, 700, 84],
      [840, 84, 930, 36, 1120, 64],
    ],
  },
  dunes: {
    front: [
      [470, 100, 500, 78, 600, 78],
      [700, 78, 730, 58, 820, 58],
      [910, 58, 1000, 90, 1120, 82],
    ],
    back: [
      [480, 100, 500, 62, 620, 62],
      [740, 62, 800, 86, 900, 86],
      [1000, 86, 1040, 46, 1120, 56],
    ],
  },
  rain: {
    front: [
      [458, 100, 466, 64, 514, 64],
      [554, 64, 556, 76, 594, 76],
      [636, 76, 644, 56, 686, 56],
      [730, 56, 740, 70, 782, 70],
      [826, 70, 838, 58, 880, 58],
      [922, 58, 930, 72, 976, 72],
      [1030, 72, 1068, 60, 1140, 64],
    ],
    back: [
      [456, 100, 482, 48, 536, 48],
      [584, 48, 598, 58, 644, 58],
      [692, 58, 704, 38, 752, 38],
      [800, 38, 808, 52, 856, 52],
      [904, 52, 920, 40, 968, 40],
      [1020, 40, 1070, 52, 1140, 44],
    ],
  },
} as const satisfies Record<string, { front: readonly Cubic[]; back: readonly Cubic[] }>;

function displacedPoint(x: number, y: number, time: number, shape: PageHeaderShape, layer: number) {
  'worklet';
  const distance = Math.max(0, (x - HEADER_CURVE_START) / 600);
  const ramp = Math.min(1, distance * 4);
  const envelope = ramp * ramp * (3 - 2 * ramp);
  const phase = time * Math.PI * 2;
  let dx = 0;
  let dy = 0;
  switch (shape) {
    case 'rain':
      dx = 3 * Math.sin(phase / 8 + distance * 5 + layer);
      dy =
        4 * Math.sin(phase / 4 - distance * 12 + layer * 2) +
        2 * Math.sin(phase / 2 + distance * 20);
      break;
    case 'ribbon':
      dx = 28 * Math.sin(phase / 12 - distance * 4 + layer * 2);
      dy = 15 * Math.sin(phase / 8 - distance * 5 + layer * 2.2);
      break;
    case 'dunes':
      dx = 10 * Math.sin(phase / 20 - distance * 4 + layer * 2);
      dy = 7 * Math.sin(phase / 15 - distance * 6 + layer * 2.5);
      break;
    default:
      dx = 10 * Math.sin(phase / 8 - distance * 7 + layer * 2);
      dy =
        12 * Math.sin(phase / 8 - distance * 10 + layer * 2.2) +
        3 * Math.sin(phase / 4 - distance * 18);
  }
  return [x + dx * envelope, Math.max(6, Math.min(100, y + dy * envelope))];
}

/** Deform individual control points: motion travels along the surface instead of scaling it. */
export function headerContour(
  shape: PageHeaderShape,
  time: number,
  layer: 0 | 1,
  fillEdge: number,
): VectorCommand[] {
  'worklet';
  const curves = layer === 0 ? headerShapeCurves[shape].front : headerShapeCurves[shape].back;
  const result: VectorCommand[] = [
    ['M', -100, 100],
    ['L', HEADER_CURVE_START, 100],
  ];
  let lastX = 1140;
  for (let index = 0; index < curves.length; index++) {
    const curve = curves[index];
    const a = displacedPoint(curve[0], curve[1], time, shape, layer);
    const b = displacedPoint(curve[2], curve[3], time, shape, layer);
    const c = displacedPoint(curve[4], curve[5], time, shape, layer);
    // Preserve the horizontal tangent where the curve leaves the protected title band.
    if (index === 0) a[1] = 100;
    result.push(['C', a[0], a[1], b[0], b[1], c[0], c[1]]);
    lastX = c[0];
  }
  result.push(['L', lastX, fillEdge], ['L', -100, fillEdge], ['Z']);
  return result;
}

export function drawVectorPath(builder: SkPathBuilder, commands: VectorCommand[]) {
  'worklet';
  for (const command of commands) {
    switch (command[0]) {
      case 'M':
        builder.moveTo(command[1], command[2]);
        break;
      case 'L':
        builder.lineTo(command[1], command[2]);
        break;
      case 'C':
        builder.cubicTo(command[1], command[2], command[3], command[4], command[5], command[6]);
        break;
      case 'Z':
        builder.close();
        break;
    }
  }
}

/** SVG and Skia consume the same control points; SVG rounds below a thousandth of a point. */
export function vectorPathToSvg(commands: VectorCommand[]) {
  'worklet';
  let svg = '';
  for (const command of commands) {
    svg += command[0];
    for (let index = 1; index < command.length; index++) {
      svg += `${Math.round((command[index] as number) * 1000) / 1000} `;
    }
  }
  return svg;
}
