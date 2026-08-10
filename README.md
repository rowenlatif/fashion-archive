# Fashion Archive

A personal fashion archive — log what you wore, build a visual
record of your wardrobe over time.

> **Status:** in development. Not yet released.

![Fashion Archive](docs/cover.png)

## About

Most closet apps are inventory tools; they optimize for knowing
what you own. Fashion Archive treats a wardrobe as a record instead.
Show what you actually wore, when, and how pieces recur across
outfits over months.

Built as a solo project exploring editorial visual language in a
mobile product, and how far a design-led build can go with AI
tooling in the loop.

## Features

**In progress**
- [ ] Log a daily outfit from saved items
- [ ] Item library with automatic background removal
- [ ] Outfit detail view with related outfits
- [ ] Monthly calendar view
- [ ] Wardrobe stats — wear counts, cost-per-wear, category mix

**Planned**
- [ ] Flat-lay outfit composition
- [ ] Local fashion events — thrift markets, brand popups
- [ ] Profiles

## Design

An editorial print sensibility on mobile: off-white ground,
hairline rules, a five-step type scale, and negative space
carrying most of the hierarchy.

**Cutouts over AI try-on.** Virtual try-on models are capable
now, but the output reads uncanny and fights a minimalist
aesthetic. Garment cutouts arranged as flat-lay compositions are
deterministic, instant, and closer to how fashion is actually
photographed.

**Design tokens generated from Figma.** Colors, type, and spacing
live as Figma variables and are pulled into `theme.ts` via the
Figma MCP server, so the design file stays the source of truth.

![Screens](docs/screens.png)

## Stack

| | |
|---|---|
| App | React Native · Expo · Expo Router · TypeScript |
| Backend | Supabase — Postgres, auth, storage |
| Images | fal.ai — background removal |
| Analytics | PostHog |
| Design | Figma → theme tokens via Figma MCP |

## Running locally

Requires Node 22+ and Xcode (for the iOS simulator).

```bash
git clone git@github.com:rowenlatif/fashion-archive.git
cd fashion-archive
npm install
npx expo start
```

Then press `i` for the iOS simulator or `w` for browser.

Environment variables go in `.env` — see `.env.example`.

## Structure

```
app/           screens (Expo Router file-based routing)
src/
  components/  reusable UI
  theme/       design tokens generated from Figma
assets/        fonts and static images
```

## Roadmap

Core logging and browsing first, then outfit composition, then
events. Social features are deliberately unscoped until the
single-player experience is worth returning to.

---

Design and development by [Rowen Latif](https://github.com/rowenlatif)
