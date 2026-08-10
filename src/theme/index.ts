export const colors = {
  text: {
    black: '#000000',
    white: '#FFFFFF',
    gray: '#9B9B9B',
  },
  background: {
    white: '#FFFFFF',
    black: '#000000',
    blackOverlay: '#000000',
  },
  button: {
    black: '#000000',
    // Base color only — the "transparent" gradient/opacity treatment is applied
    // at the component layer, not baked into this token (Figma has no gradient variables).
    whiteTransparent: '#FFFFFF',
  },
  icons: {
    black: '#000000',
    disabled: '#D9D9D9',
  },
  stroke: {
    gray100: '#E0E0E0',
  },
} as const;

export type Colors = typeof colors;
export type ColorGroup = keyof Colors;

export const typography = {
  instrumentTitle: {
    fontFamily: 'Instrument Serif',
    fontSize: 24,
    lineHeight: 31.2,
    fontWeight: '400',
    letterSpacing: 0,
  },
  instrumentBody: {
    fontFamily: 'Instrument Serif',
    fontSize: 16,
    lineHeight: 20.8,
    fontWeight: '400',
    letterSpacing: 0,
  },
  ibmBody: {
    fontFamily: 'IBM Plex Mono',
    fontSize: 12,
    lineHeight: 15.6,
    fontWeight: '400',
    letterSpacing: 0,
  },
  ibmCaption: {
    fontFamily: 'IBM Plex Mono',
    fontSize: 12,
    lineHeight: 15.6,
    fontWeight: '400',
    letterSpacing: 0,
    color: colors.text.gray,
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
} as const;

export type Spacing = typeof spacing;
export type SpacingToken = keyof Spacing;
