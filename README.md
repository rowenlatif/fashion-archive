# Fashion Archive
Log what you wore, build a visual record of your wardrobe over time.

## Tech Stack

- **Runtime:** Node 22+ — with Expo CLI running the dev server
- **Framework:** Expo (Expo Router) — React Native with file-based routing
- **Language:** TypeScript
- **Backend:** Supabase — Postgres, auth, storage
- **Images:** fal.ai — background removal
- **Analytics:** PostHog
- **Design:** Figma → theme tokens via Figma MCP

## Project Structure

```
fashion-archive/
├── assets/              # Fonts and static images
├── app/                 # Expo Router — screens as routes
│   ├── _layout.tsx      # Root layout (wraps all screens)
│   └── index.tsx        # Home screen (/)
├── src/
│   ├── components/      # Reusable UI
│   ├── lib/             # Supabase client, fal.ai, PostHog
│   └── theme/           # Design tokens generated from Figma
├── .env.example         # Template for local environment variables
├── app.json             # Expo app config
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## How Expo Router works

Each file inside `app/` becomes a route. To add a new screen, create a file — the filename is the path:

```
app/index.tsx           → /
app/calendar.tsx        → /calendar
app/outfit/[id].tsx     → /outfit/123   (dynamic segment)
```

`_layout.tsx` files wrap every screen in their directory and below. The root `_layout.tsx` holds the navigation container, font loading, and providers. A folder in parentheses — like `app/(tabs)/` — groups screens under a shared layout without adding a segment to the path.

## Running Locally

### Prerequisites

**Node 22+**

macOS, with Homebrew:

```bash
brew install node
```

Or via [nvm](https://github.com/nvm-sh/nvm), if you manage multiple versions:

```bash
nvm install 22 && nvm use 22
```

Verify installation:

```bash
node --version
```

**Xcode** — required for the iOS simulator. Install from the Mac App Store, then open it once to accept the license and let it finish installing components. Confirm a simulator is available:

```bash
xcrun simctl list devices
```

The browser target works without Xcode, but camera and image picker flows need the simulator or a physical device.

### Setup

Clone the repository:

```bash
git clone git@github.com:rowenlatif/fashion-archive.git
cd fashion-archive
```

Install dependencies:

```bash
npm install
```

Add environment variables — copy the template, then fill in the Supabase, fal.ai, and PostHog keys:

```bash
cp .env.example .env
```

Start the development server:

```bash
npx expo start
```

Open the app: press `i` for the iOS simulator or `w` for the browser. Expo hot-reloads — file changes appear immediately.

## Other Commands

| Command | Description |
|---|---|
| `npx expo start` | Start development server |
| `npx expo start -c` | Start with the Metro cache cleared |
| `npx expo start --tunnel` | Start over a tunnel, for a device on another network |
| `npx tsc --noEmit` | Type-check without emitting files |
| `npx expo lint` | Run ESLint |
| `npx expo prebuild` | Generate native `ios/` and `android/` directories |

If the app can't reach the dev server, or Metro serves a stale bundle, `npx expo start -c` clears the cache and usually resolves it.

---

Design and development by [Rowen Latif](https://github.com/rowenlatif)
