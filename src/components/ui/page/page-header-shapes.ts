export const HEADER_CURVE_START = 400;

/** Trailing contours in a 1000-by-100 header; the leading 40% stays level. */
export const headerShapeCurves = {
  waves: {
    front: 'C450 100 460 48 520 48S590 90 650 90S730 44 790 44S870 90 930 90S1030 50 1100 50',
    back: 'C450 100 470 82 530 82S610 38 680 38S760 88 820 88S900 46 960 46S1050 86 1120 86',
  },
  ribbon: {
    front: 'C500 100 540 62 650 62S880 94 1120 50',
    back: 'C510 100 560 84 700 84S930 36 1120 64',
  },
  dunes: {
    front: 'C470 100 500 78 600 78S730 58 820 58S1000 90 1120 82',
    back: 'C480 100 500 62 620 62S800 86 900 86S1040 46 1120 56',
  },
} as const;

export type PageHeaderShape = keyof typeof headerShapeCurves;
