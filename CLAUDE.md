# Project Rules

## Stack
- React Native + Expo + Expo Router + TypeScript
- Before writing any code, read the versioned Expo docs at https://docs.expo.dev/versions/v57.0.0/

## Styling
- Use `StyleSheet.create` exclusively — never Tailwind, never `className`
- No inline hex color values anywhere in component files
- All colors must be imported from the theme file (`src/theme/colors.ts` or equivalent)
- Spacing, font sizes, and border widths should come from theme constants, not magic numbers

## Components
- Use `View`, `Text`, `Pressable` — never `div`, `span`, `button`, or other web primitives
- No inline styles except when a value is genuinely dynamic (e.g. derived from state or props)

## Aesthetic: Editorial Fashion Minimalism
- Generous negative space — err on the side of more padding/margin, not less
- Restrained type scale: few sizes, high contrast between hierarchy levels
- Hairline rules (`borderWidth: StyleSheet.hairlineWidth`) for dividers and borders
- Off-white ground: the default background is never pure white (`#fff`) — use the `background` token from the theme
- Neutral, desaturated palette with one restrained accent at most
- No drop shadows, gradients, or decorative illustration — let space and type do the work
- Typography is flush-left by default; centered text only for very short labels or display headings

## File Conventions
- Screens live in `app/` (Expo Router file-based routing)
- Reusable components live in `src/components/`
- Theme tokens live in `src/theme/`
- All new files use `.tsx` for components, `.ts` for pure logic/types
