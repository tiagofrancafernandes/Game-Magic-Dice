import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: false,
            includeAssets: ['dice.svg', 'apple-touch-icon.png'],
            includeHtmlHeadLinks: false,
            workbox: {
                cleanupOutdatedCaches: true,
                globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,json,woff2,webmanifest}'],
            },
        }),
    ],

    resolve: {
        alias: {
            '@@': fileURLToPath(new URL('./', import.meta.url)),
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
            '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
            '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
            '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
            '@router': fileURLToPath(new URL('./src/router', import.meta.url)),
            '@composables': fileURLToPath(new URL('./src/composables', import.meta.url)),
            '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
            '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
            '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
            '@plugins': fileURLToPath(new URL('./src/plugins', import.meta.url)),
            '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
            '@public': fileURLToPath(new URL('./public', import.meta.url)),
        },
    },
});
