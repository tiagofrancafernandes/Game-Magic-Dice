import { createRouter, createWebHistory } from 'vue-router';
import GameView from '../views/GameView.vue';

export default createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [{ path: '/', component: GameView }],
});
