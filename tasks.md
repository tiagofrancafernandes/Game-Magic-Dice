# 🎲 Dado Mágico - Project Tasks & Status

Jogo de dado educativo e lúdico para crianças. PWA instalável no celular.

---

## ✅ Completed Tasks (Sprint 1)

- [x] **Task 1**: Gerar ícones PWA - ✅ CONCLUÍDA
  - Ícones gerados: pwa-192x192.png, pwa-512x512.png, apple-touch-icon.png
  - Seção removida do README (não é mais necessária)

- [x] **Task 2**: Implementar internacionalização - ✅ CONCLUÍDA
  - Suporte completo a pt-BR e en-US
  - Detecção automática de idioma do navegador
  - Composable `useI18n()` com persistência em localStorage
  - Todas as strings da UI traduzidas

- [x] **Task 3**: Criar README em inglês - ✅ CONCLUÍDA
  - README.md em inglês (principal)
  - README.pt-BR.md em português (versão traduzida)
  - Cross-references entre versões

- [x] **Task 4**: Capacitor Android Setup - ✅ AVALIADA
  - Capacitor inicializado e configurado
  - Plataforma Android adicionada
  - Próximos passos: abrir no Android Studio para gerar APK

- [x] **Task 5**: TailwindCSS v4 Migration - ✅ AVALIADA
  - Análise de viabilidade concluída
  - Migração é viável mas recomendada para próxima iteração
  - Documentação dos passos de migração em tasks/task5.md

---

## Stack

- **Vue 3** + Composition API (`<script setup>`)
- **Vite** + `vite-plugin-pwa`
- **TailwindCSS** v3
- **vue-router** v4
- **i18n** (pt-BR e en-US) com detecção automática
- Config persistida no **localStorage**
- **Capacitor** com suporte Android

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

## Instalar como App no Celular (PWA)

1. Rodar `npm run build` e servir o `/dist` com HTTPS (ex: Vercel, Netlify, ou `vite preview`)
2. Abrir no Chrome/Safari no celular
3. Chrome Android: menu "Adicionar a tela inicial"
4. Safari iOS: botao Compartilhar -> "Adicionar a Tela de Inicio"

---

## Modos de Jogo

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

## Estrutura do Projeto

```
src/
  views/
    GameView.vue          - Tela principal do jogo
  components/
    DiceFace.vue          - Visual do dado com bolinhas ou valores customizados
    ConfigModal.vue       - Modal de configurações
    CharPicker.vue        - Seletor de letra/número para modo personalizado
  composables/
    useDiceConfig.js      - Estado de config + localStorage (singleton)
    useDiceRoll.js        - Lógica de animação do roll
    useI18n.js            - Sistema de internacionalização
    useToast.js           - Notificações toast
  locales/
    pt-BR.json            - Traduções em português
    en-US.json            - Traduções em inglês
  plugins/
    toast.js              - Configuração do plugin de toast
  router/
    index.js              - Configuração de rotas
  App.vue
  main.js
  style.css
public/
  dice.svg
  pwa-192x192.png
  pwa-512x512.png
  apple-touch-icon.png
android/                  - Projeto Capacitor Android (estrutura nativa)
capacitor.config.json     - Configuração do Capacitor
```
