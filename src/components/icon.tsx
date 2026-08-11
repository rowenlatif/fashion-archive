import { Path, Svg } from 'react-native-svg';

import { colors } from '@/theme';

// Path data extracted directly from the Figma "PRIMITIVES" page icon set —
// see assets/icons/*.svg for the source exports these were taken from.
const icons = {
  // Default rendered size is 12x12 unless noted — per design rule "when in
  // doubt, 12x12". close and chevron are the two documented exceptions.
  grid: {
    viewBox: '0 0 12.8 12.8',
    strokeWidth: 0.8,
    defaultWidth: 12,
    defaultHeight: 12,
    d: 'M0.4 4.4H12.4M0.4 8.4H12.4M4.4 0.4V12.4M8.4 0.4V12.4M1.73333 0.4H11.0667C11.803 0.4 12.4 0.996954 12.4 1.73333V11.0667C12.4 11.803 11.803 12.4 11.0667 12.4H1.73333C0.996954 12.4 0.4 11.803 0.4 11.0667V1.73333C0.4 0.996954 0.996954 0.4 1.73333 0.4Z',
  },
  calendar: {
    viewBox: '0 0 11.8 12.8',
    strokeWidth: 0.8,
    defaultWidth: 12,
    defaultHeight: 12,
    d: 'M3.45556 0.4V2.8M8.34444 0.4V2.8M0.4 5.2H11.4M1.62222 1.6H10.1778C10.8528 1.6 11.4 2.13726 11.4 2.8V11.2C11.4 11.8627 10.8528 12.4 10.1778 12.4H1.62222C0.947207 12.4 0.4 11.8627 0.4 11.2V2.8C0.4 2.13726 0.947207 1.6 1.62222 1.6Z',
  },
  info: {
    viewBox: '0 0 12.8 12.8',
    strokeWidth: 0.8,
    defaultWidth: 12,
    defaultHeight: 12,
    d: 'M6.4 8.8V6.4M6.4 4H6.406M12.4 6.4C12.4 9.71371 9.71371 12.4 6.4 12.4C3.08629 12.4 0.4 9.71371 0.4 6.4C0.4 3.08629 3.08629 0.4 6.4 0.4C9.71371 0.4 12.4 3.08629 12.4 6.4Z',
  },
  link: {
    viewBox: '0 0 12.8 12.8',
    strokeWidth: 0.8,
    defaultWidth: 12,
    defaultHeight: 12,
    d: 'M5.19319 7.00401C5.45232 7.35079 5.78293 7.63773 6.16259 7.84537C6.54225 8.053 6.96208 8.17647 7.3936 8.20741C7.82512 8.23834 8.25824 8.17602 8.66358 8.02466C9.06893 7.87331 9.43701 7.63646 9.74287 7.33018L11.5531 5.51814C12.1027 4.94855 12.4068 4.18567 12.3999 3.39382C12.393 2.60197 12.0757 1.8445 11.5163 1.28456C10.957 0.724612 10.2002 0.406995 9.40919 0.400114C8.61813 0.393233 7.85602 0.697639 7.28701 1.24777L6.24915 2.28063M7.60681 5.79599C7.34768 5.44921 7.01707 5.16227 6.63741 4.95463C6.25775 4.747 5.83792 4.62353 5.4064 4.59259C4.97488 4.56166 4.54176 4.62398 4.13642 4.77534C3.73107 4.92669 3.36299 5.16354 3.05713 5.46982L1.24692 7.28186C0.69734 7.85145 0.39324 8.61433 0.400114 9.40618C0.406988 10.198 0.724286 10.9555 1.28367 11.5154C1.84305 12.0754 2.59976 12.393 3.39081 12.3999C4.18187 12.4068 4.94397 12.1024 5.51299 11.5522L6.54482 10.5194',
  },
  edit: {
    viewBox: '0 0 12.8 12.8',
    strokeWidth: 0.8,
    defaultWidth: 12,
    defaultHeight: 12,
    d: 'M8.20003 2.20027L10.6001 4.60032M11.9045 3.28749C12.2217 2.97034 12.3999 2.54016 12.4 2.09158C12.4001 1.643 12.2219 1.21277 11.9048 0.89554C11.5876 0.578307 11.1574 0.400056 10.7089 0.4C10.2603 0.399944 9.83007 0.578087 9.51284 0.89524L1.50517 8.90482C1.36586 9.04373 1.26284 9.21475 1.20517 9.40283L0.412561 12.0141C0.397054 12.066 0.395883 12.1211 0.409171 12.1736C0.42246 12.2261 0.449713 12.274 0.488039 12.3123C0.526365 12.3506 0.574335 12.3777 0.626858 12.3909C0.679381 12.4042 0.734499 12.4029 0.786364 12.3873L3.39819 11.5953C3.58609 11.5381 3.7571 11.4357 3.89619 11.2971L11.9045 3.28749Z',
  },
  close: {
    viewBox: '0 0 7.80001 8.80001',
    strokeWidth: 0.8,
    defaultWidth: 7,
    defaultHeight: 8,
    d: 'M7.40001 0.400005L0.400005 8.40001M0.400005 0.400005L7.40001 8.40001',
  },
  chevron: {
    viewBox: '0 0 12.8 6.8',
    strokeWidth: 0.8,
    defaultWidth: 12,
    defaultHeight: 6,
    d: 'M0.4 0.4L6.4 6.4L12.4 0.4',
  },
  plus: {
    viewBox: '0 0 24 24',
    strokeWidth: 1.5,
    defaultWidth: 24,
    defaultHeight: 24,
    d: 'M5 12H19M12 5V19',
  },
  time: {
    viewBox: '0 0 12.8 12.8',
    strokeWidth: 0.8,
    defaultWidth: 12,
    defaultHeight: 12,
    d: 'M6.4 2.8V6.4L8.8 7.6M12.4 6.4C12.4 9.71371 9.71371 12.4 6.4 12.4C3.08629 12.4 0.4 9.71371 0.4 6.4C0.4 3.08629 3.08629 0.4 6.4 0.4C9.71371 0.4 12.4 3.08629 12.4 6.4Z',
  },
  category: {
    viewBox: '0 0 13.8 9.8',
    strokeWidth: 0.8,
    defaultWidth: 12,
    defaultHeight: 12,
    d: 'M4.95 4.9H8.85M0.4 2.97143C0.917172 2.97143 1.41316 3.17462 1.77886 3.53629C2.14455 3.89797 2.35 4.38851 2.35 4.9C2.35 5.41149 2.14455 5.90203 1.77886 6.26371C1.41316 6.62538 0.917172 6.82857 0.4 6.82857V8.11429C0.4 8.45528 0.536964 8.7823 0.780761 9.02342C1.02456 9.26454 1.35522 9.4 1.7 9.4H12.1C12.4448 9.4 12.7754 9.26454 13.0192 9.02342C13.263 8.7823 13.4 8.45528 13.4 8.11429V6.82857C12.8828 6.82857 12.3868 6.62538 12.0211 6.26371C11.6554 5.90203 11.45 5.41149 11.45 4.9C11.45 4.38851 11.6554 3.89797 12.0211 3.53629C12.3868 3.17462 12.8828 2.97143 13.4 2.97143V1.68571C13.4 1.34472 13.263 1.0177 13.0192 0.776577C12.7754 0.535459 12.4448 0.4 12.1 0.4H1.7C1.35522 0.4 1.02456 0.535459 0.780761 0.776577C0.536964 1.0177 0.4 1.34472 0.4 1.68571V2.97143Z',
  },
} as const;

export type IconName = keyof typeof icons;

const tintByColor = {
  black: colors.icons.black,
  gray: colors.text.gray,
  disabled: colors.icons.disabled,
} as const;

export type IconColor = keyof typeof tintByColor;

export type IconProps = {
  name: IconName;
  size?: number;
  color?: IconColor;
  rotation?: 0 | 90 | 180 | 270;
};

export function Icon({ name, size, color = 'black', rotation = 0 }: IconProps) {
  const glyph = icons[name];
  const width = size ?? glyph.defaultWidth;
  const height = size ? size * (glyph.defaultHeight / glyph.defaultWidth) : glyph.defaultHeight;

  return (
    <Svg
      width={width}
      height={height}
      viewBox={glyph.viewBox}
      style={rotation ? { transform: [{ rotate: `${rotation}deg` }] } : undefined}>
      <Path
        d={glyph.d}
        fill="none"
        stroke={tintByColor[color]}
        strokeWidth={glyph.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
