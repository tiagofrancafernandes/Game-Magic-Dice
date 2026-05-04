# 🎲 Dado Mágico

Jogo de dado educativo e lúdico para crianças. PWA instalável no celular.

**[📖 Read in English](./README.md)**

---

## Stack

- **Vue 3** + Composition API (`<script setup>`)
- **Vite** + `vite-plugin-pwa`
- **TailwindCSS** v3
- **vue-router** v4
- **i18n** com suporte a pt-BR e en-US
- Config persistida no **localStorage**

---

## Setup Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em desenvolvimento
npm run dev

# 3. Build de produção
npm run build

# 4. Visualizar build
npm run preview
```

---

## Instalar como App no Celular (PWA)

1. Rodar `npm run build` e servir o `/dist` com HTTPS (ex: Vercel, Netlify, ou `vite preview`)
2. Abrir no Chrome/Safari no celular
3. Chrome Android: menu "Adicionar a tela inicial"
4. Safari iOS: botão Compartilhar → "Adicionar a Tela de Início"

---

## Modos de Jogo

| Modo | Faces | Visual |
|------|-------|--------|
| Clássico 6 | 1 a 6 | Bolinhas coloridas no layout real de dado |
| Clássico 3 | 1 a 3 | Bolinhas coloridas (3 faces possíveis) |
| Personalizado | 2, 3 ou 6 valores | Letra ou número em destaque |

### Distribuição de Lados (Modo Personalizado)
- 2 valores: 3 lados cada (50% / 50%)
- 3 valores: 2 lados cada (33% cada)
- 6 valores: 1 lado cada (17% cada)

---

## Internacionalização (i18n)

O app detecta automaticamente o idioma do seu navegador e exibe:
- **Português (pt-BR)** - Localização completa disponível
- **Inglês (en-US)** - Tradução completa fornecida

Strings suportadas incluem modos de jogo, botões, rótulos da interface e todas as opções de configuração.

---

## Futuro / Ideias Anotadas

- [ ] TTS com Web Speech API (`speechSynthesis`) para falar a letra/número que saiu
- [ ] Efeito sonoro de sacudir (Web Audio API)
- [ ] Histórico dos últimos resultados
- [ ] Modo "desafio" com perguntas relacionadas ao valor sorteado

---

## Estrutura do Projeto

```
src/
  views/
    GameView.vue          - Tela principal do jogo
  components/
    DiceFace.vue          - Visual do dado (bolinhas ou valores customizados)
    ConfigModal.vue       - Modal de configurações
    CharPicker.vue        - Seletor de letra/número para modo personalizado
  composables/
    useDiceConfig.js      - Estado de config + localStorage (singleton)
    useDiceRoll.js        - Lógica de animação do roll
    useI18n.js            - Composable de internacionalização
  locales/
    pt-BR.json            - Traduções em português
    en-US.json            - Traduções em inglês
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

## Contribuindo

Sinta-se livre para fazer fork, submeter issues ou contribuir com melhorias. Todos os modos de jogo e a interface são traduzíveis através do sistema i18n.
