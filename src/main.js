import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { registerSW } from 'virtual:pwa-register';
import App from './App.vue';
import GameView from './views/GameView.vue';
import ToastPlugin from '@/plugins/toast';
import { Icon } from '@iconify/vue';
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

registerSW({
    immediate: true,
});

app.mount('#app');
