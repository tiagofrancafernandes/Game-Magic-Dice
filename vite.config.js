import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

import path from 'path';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['dice.svg', 'apple-touch-icon.png'],
            manifest: {
                name: 'Dado Magico',
                short_name: 'Dado',
                description: 'Jogo de dado educativo e ludico para criancas',
                theme_color: '#7c3aed',
                background_color: '#4c1d95',
                display: 'standalone',
                orientation: 'portrait',
                start_url: '/',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        // purpose: 'any maskable',
                        purpose: 'maskable',
                    },
                ],
            },
            workbox: {
                cleanupOutdatedCaches: true,
                // globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
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
