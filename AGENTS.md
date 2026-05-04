### Tech Stack

- **Framework**: Vue 3.5+ with Composition API
- **Build Tool**: Vite
- **Styling**: TailwindCSS v4
- **Routing**: Vue Router 4
- **Code Style**: Prettier

## Development Commands

```bash
# From project root path...

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

npx prettier --write src/

## If exists a Prettier config file like .prettierrc, use
npx prettier --config ./.prettierrc --write src/
```

## Architecture

### Directory Structure

```
src/
├── composables/       # Reusable composition functions
│   ├── useAuth.ts/js
│   ├── useApi.ts/js
│   ├── useComposableExample.ts/js
├── router/            # Vue Router configuration
│   └── index.ts/js
├── services/          # API communication
│   └── api.ts/js
├── types/             # TypeScript (if use TS) interfaces
│   └── index.ts
├── views/             # Page components
│   ├── ExamplePageView.vue
├── App.vue            # Root component with navigation
└── main.ts/js         # Application entry point
```

### Key Patterns

**Composition API**: All components use `<script setup>`

**Composables**: Data fetching and state management via composition functions

### Path Aliases

Configured in `vite.config.ts/js`:

- `@` → `./src`
- `@composables` → `./src/composables`
- `@views` → `./src/views`
- `@services` → `./src/services`
- `@types` → `./src/types`

## Vue.js Guidelines

### Conditional Classes

**Always use object syntax** instead of ternary operators:

```vue
<!-- ✅ Correct -->
<div :class="{ 'bg-blue-600': isActive, 'bg-gray-200': !isActive }"></div>

<!-- ❌ Wrong -->
<div :class="isActive ? 'bg-blue-600' : 'bg-gray-200'"></div>
```

### Combining Static and Conditional Classes

```vue
<div
    :class="[
        'px-4 py-2 rounded-lg',
        {
            'bg-blue-600 text-white': isActive,
            'bg-gray-200 text-gray-800': !isActive,
        },
    ]"
></div>
```

## TailwindCSS v4 (if installed is v4)

This project uses TailwindCSS v4 with Vite plugin:

- CSS import: `@import "tailwindcss"` (not `@tailwind` directives)
- No `tailwind.config.js` required
- Use `bg-linear-*` instead of `bg-gradient-*`

## Environment Variables

Use environment variables when is useful

```env
VITE_API_URL=http://api.local.tiagoapps.com.br
```

Access in code: `import.meta.env.VITE_API_URL`

### Toast messages

```ts
import { useToast } from '@/composables/useToast';

const toast = useToast();

toast.success('success!');
toast.error('error!');
toast.info('info!');
toast.dark('dark!');
toast.warning('warning!');
```

## Using `Icon` component from `@iconify/vue` package

- Import on demand (or globally register on src/main.ts/js file)
```vue
<script setup>
import { Icon } from '@iconify/vue';
</script>

<template>
    <Icon name="mdi-light:home" />
    <Icon icon="mdi-light:home" :height="24" />
    <Icon icon="mdi-light:home" :width="16" :height="16" />
</template>
```

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
