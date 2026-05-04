import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
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

for (let [compName, compObj] of Object.entries(components)) {
    app.component(compName, compObj);
}

Object.keys(components).forEach((key) => {
    app.component(key, components[key]);
});

app.mount('#app');
