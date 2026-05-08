# 🎲 Dado Mágico

An educational and playful dice game for children. Progressive Web App (PWA) installable on mobile devices.

**[📖 Leia em Português](./README.pt-BR.md)**

---

## Stack

- **Vue 3** + Composition API (`<script setup>`)
- **Vite** + `vite-plugin-pwa`
- **TailwindCSS** v3
- **vue-router** v4
- **i18n** support for pt-BR and en-US, including locale-aware page title, HTML `lang`, web manifest, and Android app name
- Config persisted with **localStorage**

---

## Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## Install as Mobile App (PWA)

1. Run `npm run build` and serve `/dist` with HTTPS (e.g., Vercel, Netlify, or `vite preview`)
2. Open on Chrome/Safari on mobile
3. **Chrome Android**: Menu → "Add to home screen"
4. **Safari iOS**: Share button → "Add to Home Screen"

---

## Game Modes

| Mode | Faces | Display |
|------|-------|---------|
| Classic 6 | 1 to 6 | Colorful dots in authentic dice layout |
| Classic 3 | 1 to 3 | Colorful dots (3 possible faces) |
| Custom | 2, 3 or 6 values | Letter or number highlighted |

### Side Distribution (Custom Mode)
- 2 values: 3 sides each (50% / 50%)
- 3 values: 2 sides each (33% each)
- 6 values: 1 side each (17% each)

---

## Internationalization (i18n)

The app automatically detects your browser language and displays:
- **Portuguese (pt-BR)** - Full localization available
- **English (en-US)** - Complete translation provided

Supported strings include game modes, buttons, UI labels, and all configuration options.

The selected language also updates the browser tab title, the `html lang` attribute, the active PWA manifest, and the Android app label.

---

## Future Features

- [ ] TTS with Web Speech API (`speechSynthesis`) to vocalize rolled values
- [ ] Shake sound effect using Web Audio API
- [ ] History of recent rolls
- [ ] Challenge mode with questions tied to dice values

---

## Project Structure

```
src/
  views/
    GameView.vue          - Main game screen
  components/
    DiceFace.vue          - Dice visual (pips or custom values)
    ConfigModal.vue       - Settings dialog
    CharPicker.vue        - Character/number selector for custom mode
  composables/
    useDiceConfig.js      - Config state + localStorage (singleton)
    useDiceRoll.js        - Roll animation logic
    useI18n.js            - Internationalization composable
  locales/
    pt-BR.json            - Portuguese translations
    en-US.json            - English translations
  router/
    index.js
  App.vue
  main.js
  style.css
public/
  dice.svg
  pwa-192x192.png
  pwa-512x512.png
  apple-touch-icon.png
```

---

## Contributing

Feel free to fork, submit issues, or contribute enhancements. All game modes and UI are translatable through the i18n system.
