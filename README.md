# 🎲 Dado Magico

Jogo de dado educativo e ludico para criancas. PWA instalavel no celular.

---

## Stack

- **Vue 3** + Composition API (`<script setup>`)
- **Vite** + `vite-plugin-pwa`
- **TailwindCSS** v3
- **vue-router** v4
- Config persistida no **localStorage**

---

## Setup rapido

```bash
# 1. Instalar dependencias
npm install

# 2. Rodar em desenvolvimento
npm run dev

# 3. Build de producao
npm run build

# 4. Visualizar build
npm run preview
```

---

## Icones PWA (obrigatorio para producao)

O vite-plugin-pwa precisa dos arquivos de icone em `/public/`:

```
public/
  pwa-192x192.png
  pwa-512x512.png
  apple-touch-icon.png   (180x180)
```

Opcao rapida: gerar a partir do `dice.svg` com o pacote `sharp`:

```bash
npm install -D sharp
node -e "
const sharp = require('sharp');
sharp('public/dice.svg').resize(192).png().toFile('public/pwa-192x192.png');
sharp('public/dice.svg').resize(512).png().toFile('public/pwa-512x512.png');
sharp('public/dice.svg').resize(180).png().toFile('public/apple-touch-icon.png');
"
```

Ou use https://realfavicongenerator.net para gerar todos os tamanhos.

---

## Instalar como app no celular (PWA)

1. Rodar `npm run build` e servir o `/dist` com HTTPS (ex: Vercel, Netlify, ou `vite preview`)
2. Abrir no Chrome/Safari no celular
3. Chrome Android: menu "Adicionar a tela inicial"
4. Safari iOS: botao Compartilhar -> "Adicionar a Tela de Inicio"

---

## Empacotamento com Capacitor (futuro - para APK/IPA)

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Dado Magico" "com.tiago.dadomagico" --web-dir=dist
npm run build
npx cap add android
npx cap sync
npx cap open android   # abre no Android Studio para gerar APK
```

---

## Modos de jogo

| Modo | Faces | Visual |
|------|-------|--------|
| Classico 6 | 1 a 6 | Bolinhas coloridas no layout real de dado |
| Classico 3 | 1 a 3 | Bolinhas coloridas (3 faces possiveis) |
| Personalizado | 2, 3 ou 6 valores | Letra ou numero em destaque |

### Distribuicao de lados (modo personalizado)
- 2 valores: 3 lados cada (50% / 50%)
- 3 valores: 2 lados cada (33% cada)
- 6 valores: 1 lado cada (17% cada)

---

## Futuro / ideias anotadas

- [ ] TTS com Web Speech API (`speechSynthesis`) para falar a letra/numero que saiu
- [ ] Efeito sonoro de chacoalhar (Web Audio API)
- [ ] Historico dos ultimos resultados
- [ ] Modo "desafio" com perguntas relacionadas ao valor sorteado

---

## Estrutura

```
src/
  views/
    GameView.vue          - Tela principal
  components/
    DiceFace.vue          - Visual do dado com pips ou valor custom
    ConfigModal.vue       - Modal de configuracao
    CharPicker.vue        - Seletor de letra/numero para modo custom
  composables/
    useDiceConfig.js      - Config + localStorage (estado singleton)
    useDiceRoll.js        - Logica de roll com animacao
  router/
    index.js
  App.vue
  main.js
  style.css
public/
  dice.svg
```
