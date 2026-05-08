import { createApp, watch } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { registerSW } from 'virtual:pwa-register';
import App from './App.vue';
import GameView from './views/GameView.vue';
import ToastPlugin from '@/plugins/toast';
import { Icon } from '@iconify/vue';
import { useI18n } from '@/composables/useI18n';
import './style.css';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [{ path: '/', component: GameView }],
});

const components = {
    Icon: Icon,
    UIcon: Icon,
};

const app = createApp(App);
app.use(router);

app.use(ToastPlugin, {
    autoClose: 8000,
});

Object.keys(components).forEach((key) => {
    app.component(key, components[key]);
});

const { t, currentLanguage } = useI18n();

function syncDocumentLocale(language) {
    const resolvedLanguage = language === 'pt-BR' ? 'pt-BR' : 'en';
    const manifestHref = resolvedLanguage === 'pt-BR' ? '/manifest-pt.webmanifest' : '/manifest-en.webmanifest';
    const appTitle = t('app.title', resolvedLanguage === 'pt-BR' ? 'Dado Mágico' : 'Magic Dice');

    document.documentElement.lang = resolvedLanguage;
    document.title = appTitle;

    const appleTitleMeta = document.querySelector('meta[name="apple-mobile-web-app-title"]');

    if (appleTitleMeta) {
        appleTitleMeta.setAttribute('content', appTitle);
    }

    const manifestLink = document.querySelector('link[rel="manifest"]');

    if (manifestLink) {
        manifestLink.href = manifestHref;
        return;
    }

    const createdManifest = document.createElement('link');
    createdManifest.id = 'app-manifest';
    createdManifest.rel = 'manifest';
    createdManifest.href = manifestHref;

    document.head.appendChild(createdManifest);
}

watch(
    currentLanguage,
    (language) => {
        syncDocumentLocale(language);
    },
    { immediate: true }
);

registerSW({
    immediate: true,
});

app.mount('#app');
