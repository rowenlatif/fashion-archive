export const colors = {
  text: {
    black: '#000000',
    white: '#FFFFFF',
    gray: '#9B9B9B',
  },
  background: {
    white: '#FFFFFF',
    black: '#000000',
    blackOverlay: 'rgba(0, 0, 0, 0.2)',
  },
  button: {
    black: '#000000',
    white90: 'rgba(255, 255, 255, 0.9)',
    white65: 'rgba(255, 255, 255, 0.65)',
  },
  icons: {
    black: '#000000',
    disabled: '#ACB0B3',
  },
  stroke: {
    gray200: '#E0E0E0',
    gray100: '#E7E7E7',
  },
} as const;

export type Colors = typeof colors;
export type ColorGroup = keyof Colors;

// "Gray Glass" — used on card/panel/sheet backgrounds. Figma has no gradient
// variable type, so this isn't a flat color token; render with expo-linear-gradient.
export const gradients = {
  grayGlass: {
    colors: ['rgba(236, 236, 238, 0.8)', 'rgba(243, 243, 245, 0.8)'],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
} as const;

export const typography = {
  instrumentTitle: {
    fontFamily: 'InstrumentSerif_400Regular',
    fontSize: 24,
    lineHeight: 31.2,
    fontWeight: '400',
    letterSpacing: 0,
  },
  instrumentBody: {
    fontFamily: 'InstrumentSerif_400Regular',
    fontSize: 16,
    lineHeight: 20.8,
    fontWeight: '400',
    letterSpacing: 0,
  },
  // A modest step up from instrumentBody, short of the display-sized title —
  // for labels like "Most Worn This Month" that want slightly more presence.
  instrumentBodyLarge: {
    fontFamily: 'InstrumentSerif_400Regular',
    fontSize: 18,
    lineHeight: 23.4,
    fontWeight: '400',
    letterSpacing: 0,
  },
  ibmBody: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    lineHeight: 15.6,
    fontWeight: '400',
    letterSpacing: 0,
  },
  ibmCaption: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    lineHeight: 15.6,
    fontWeight: '400',
    letterSpacing: 0,
    color: colors.text.gray,
  },
  ibmMicro: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 8,
    lineHeight: 10.4,
    fontWeight: '400',
    letterSpacing: 0,
  },
} as const;

export type Typography = typeof typography;
export type TypographyToken = keyof Typography;

// Provisional 4pt-based scale — Figma has no spacing variables yet (spacing is
// currently screen-dependent). Replace with real tokens once a system emerges.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
  // 56px gap between Home screen sections (header block → grid) — falls
  // between xxxl and huge on the 4pt scale, not yet folded into a named step.
  sectionGap: 56,
  // 20px — Home's calendar view: header-to-content gap, and the gap between
  // the calendar and "most worn" list. Falls between lg and xl, not yet
  // folded into a named step.
  tight: 20,
} as const;

export type Spacing = typeof spacing;
export type SpacingToken = keyof Spacing;

export const shadows = {
  icon: {
    shadowColor: colors.text.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.17,
    shadowRadius: 0,
  },
  button: {
    shadowColor: colors.text.black,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.9,
  },
  card: {
    shadowColor: colors.text.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.17,
    shadowRadius: 9,
  },
  panel: {
    shadowColor: colors.text.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 19.1,
  },
} as const;

export type Shadows = typeof shadows;
export type ShadowToken = keyof Shadows;
