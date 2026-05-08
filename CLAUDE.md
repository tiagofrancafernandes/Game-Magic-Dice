# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Commands

```bash
# Development
npm run dev          # Start local dev server (http://localhost:5173)
npm run build        # Build for production (/dist folder)
npm run preview      # Preview production build locally

# Install dependencies
npm install
```

## Project Overview

**Dado Magico** is an educational dice game PWA (Progressive Web App) for children, built with Vue 3, Vite, and TailwindCSS.
The app supports pt-BR and en-US, and keeps the browser `lang`, page title, and PWA manifest aligned with the selected locale.

### Tech Stack
- **Vue 3** + Composition API with `<script setup>` syntax
- **Vite** v7 + `vite-plugin-pwa` for PWA capabilities
- **TailwindCSS** v3 (⚠️ **NOT v4** — uses `bg-gradient-*` not `bg-linear-*`; uses full config file)
- **GSAP** for the dice roll animation and motion timing
- **vue-router** v4 (single route for now)
- **@iconify/vue** for icon support
- **vue3-toastify** for toast notifications
- localStorage for config persistence

## Architecture

### Core Pattern: Singleton Composable
The app uses a **singleton composable pattern** for state management instead of a dedicated store. This means:

- **`useDiceConfig.js`** is the single source of truth for configuration state
- The `ref(config)` is shared across all components that import it
- `watch()` automatically persists changes to localStorage
- No Pinia/Vuex needed for this simple app's scope

### File Structure

```
src/
├── components/           # Vue components
│   ├── DiceFace.vue       # Dice visualization (pips or custom values)
│   ├── ConfigModal.vue    # Settings dialog
│   └── CharPicker.vue     # Character/number selector for custom mode
├── composables/          # Composition API logic
│   ├── useDiceConfig.js   # Config state + localStorage sync + roll logic
│   ├── useDiceRoll.js     # Roll animation timing
│   └── useToast.js        # Toast notification helper
├── views/
│   └── GameView.vue       # Main game screen
├── plugins/
│   └── toast.js           # Toast plugin registration
├── router/
│   └── index.js           # Vue Router setup (minimal, 1 route)
├── App.vue                # Root component (just RouterView)
├── main.js                # App initialization
└── style.css              # Global CSS (TailwindCSS)
```

### Game Modes

- **Classic 6**: 1–6 with pips (dots in real dice layout)
- **Classic 3**: 1–3 with pips
- **Custom**: 2, 3, or 6 custom values (letters or numbers) displayed as text

### Key Composables

#### `useDiceConfig()`
Manages all game configuration:
- **`config`** (ref): Reactive config object, auto-synced to localStorage
- **`updateConfig(partial)`**: Merges updates into config and triggers localStorage write
- **`rollValue()`**: Returns a random value based on current mode

#### `useDiceRoll()`
Handles roll animation timing and state, coordinating the GSAP-driven dice spin and the value shuffle.

#### `useToast()`
Wrapper around vue3-toastify for showing notifications.

## PWA Setup

The app is configured as a PWA with `vite-plugin-pwa`:
- Auto-update service workers on deploy
- Locale-specific manifests live in `public/manifest-pt.webmanifest` and `public/manifest-en.webmanifest`
- `main.js` keeps `document.documentElement.lang` and `document.title` in sync with the active language
- **Required for production**: PNG icons in `/public/`:
  - `pwa-192x192.png`
  - `pwa-512x512.png`
  - `apple-touch-icon.png` (180×180)

If icons are missing, the PWA will not install properly on mobile. Use https://realfavicongenerator.net to generate all sizes from a single image.

## Common Development Tasks

### Add a new game mode
1. Update `DEFAULT_CONFIG` in `useDiceConfig.js` with the new mode identifier
2. Add roll logic in `rollValue()` function
3. Update `DiceFace.vue` to render the new mode's visual
4. Add UI controls in `ConfigModal.vue` or create a new component

### Modify animations
TailwindCSS custom animations are defined in `tailwind.config.js`:
- `dice-shake`: 0.65s rotation + scale effect
- `blob`: Organic blob morphing (used for background effects)

Apply these with `class="animate-dice-shake"` or similar.

### Persist new config options
Any property added to `DEFAULT_CONFIG` will automatically sync to localStorage via the `watch()` in `useDiceConfig.js`. No additional setup needed.

## Notes

- **No build files in git**: The `/dist` folder is gitignored. Always run `npm run build` before deploying.
- **Alias paths**: Vite is configured with `@` pointing to `src/` for cleaner imports (`@/components/DiceFace.vue` instead of `../../../components/DiceFace.vue`).
- **Mobile-first design**: All UI is optimized for portrait orientation on phones (see PWA manifest config).
- Android app labels are localized through `android/app/src/main/res/values*/strings.xml`.

## Code Style Guideline (Mandatory)

All code generated, modified, or refactored **must strictly follow** the rules defined in:

**UNIVERSAL-CODE-STYLE-RULES.md**

### Enforcement Rules

- The rules in `UNIVERSAL-CODE-STYLE-RULES.md` are **authoritative and non-negotiable**
- No framework convention, language idiom, or AI default may override these rules
- Brevity, shortcuts, and one-liners are explicitly forbidden when they reduce clarity
- Explicit control flow, block scoping, and early returns are mandatory
- Logical sections must be separated by blank lines
- If multiple valid implementations exist, choose the **most explicit and readable**

### Conflict Resolution

If any instruction, suggestion, or generated code conflicts with the rules in
`UNIVERSAL-CODE-STYLE-RULES.md`, **that file always takes precedence**.

Any output that violates these rules must be considered **invalid and corrected**.

## Future Features (from README)
- TTS with Web Speech API for vocalized results
- Sound effects via Web Audio API
- History of recent rolls
- Challenge mode with questions tied to dice values
