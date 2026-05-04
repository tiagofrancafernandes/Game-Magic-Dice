<script setup>
import { ref, computed, onMounted } from 'vue';
import DiceFace from '../components/DiceFace.vue';
import ConfigModal from '../components/ConfigModal.vue';
import { useDiceConfig } from '../composables/useDiceConfig';
import { useDiceRoll } from '../composables/useDiceRoll';

const { config } = useDiceConfig();
const { currentValue, isRolling, shakeKey, roll } = useDiceRoll();

const showConfig = ref(false);

// Rola automaticamente ao montar (inclui reload de pagina)
onMounted(() => {
    setTimeout(() => roll(), 400);
});

// --- Suporte a swipe / arrastar ---
const touchStart = ref({ x: 0, y: 0 });

function onTouchStart(e) {
    const t = e.touches[0];
    touchStart.value = { x: t.clientX, y: t.clientY };
}

function onTouchEnd(e) {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.value.x;
    const dy = t.clientY - touchStart.value.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    // Qualquer toque (tap ou swipe) rola
    if (!isRolling.value) roll();
}

// Badge do modo atual
const modeBadge = computed(() => {
    const map = {
        classic6: { label: 'Classico 6', emoji: '🎲', color: '#7c3aed' },
        classic3: { label: 'Classico 3', emoji: '🎯', color: '#0891b2' },
        custom: { label: 'Personalizado', emoji: '✏️', color: '#059669' },
    };
    return map[config.value.mode];
});
</script>

<template>
    <div
        class="relative flex flex-col items-center justify-center overflow-hidden safe-top safe-bottom"
        style="height: 100%; background: linear-gradient(145deg, #2d1b69 0%, #5b21b6 40%, #4338ca 70%, #1e40af 100%)"
    >
        <!-- Blobs decorativos de fundo -->
        <div
            class="absolute rounded-full pointer-events-none animate-blob"
            style="
                width: 300px;
                height: 300px;
                top: -60px;
                left: -80px;
                background: radial-gradient(circle, rgba(167, 139, 250, 0.35) 0%, transparent 70%);
                filter: blur(40px);
            "
        />
        <div
            class="absolute rounded-full pointer-events-none animate-blob-delay"
            style="
                width: 250px;
                height: 250px;
                bottom: -40px;
                right: -60px;
                background: radial-gradient(circle, rgba(96, 165, 250, 0.3) 0%, transparent 70%);
                filter: blur(40px);
            "
        />
        <div
            class="absolute rounded-full pointer-events-none animate-blob-delay2"
            style="
                width: 200px;
                height: 200px;
                bottom: 30%;
                left: -40px;
                background: radial-gradient(circle, rgba(244, 114, 182, 0.25) 0%, transparent 70%);
                filter: blur(35px);
            "
        />

        <!-- Header: badge do modo + botao config -->
        <div class="absolute top-0 inset-x-0 flex items-center justify-between px-5 pt-4 z-10">
            <!-- Badge modo atual -->
            <div
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold"
                style="
                    background: rgba(255, 255, 255, 0.15);
                    color: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(8px);
                "
            >
                <span>{{ modeBadge.emoji }}</span>
                <span>{{ modeBadge.label }}</span>
            </div>

            <!-- Botao de configuracao -->
            <button
                type="button"
                class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 active:scale-90"
                style="background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(8px)"
                aria-label="Configuracoes"
                @click="showConfig = true"
            >
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
        </div>

        <!-- Area de toque (toda a tela) -->
        <div
            class="flex flex-col items-center justify-center gap-8 w-full flex-1"
            @touchstart.passive="onTouchStart"
            @touchend.passive="onTouchEnd"
            @click="!isRolling && roll()"
        >
            <!-- Dado com efeito de float suave quando parado -->
            <div :class="{ 'animate-float': !isRolling }">
                <DiceFace
                    :value="currentValue"
                    :mode="config.mode"
                    :showNumber="config.showNumber"
                    :isRolling="isRolling"
                    :shakeKey="shakeKey"
                />
            </div>

            <!-- Dica de interacao -->
            <Transition name="hint">
                <p
                    v-if="!isRolling"
                    class="text-sm font-semibold select-none pointer-events-none"
                    style="color: rgba(255, 255, 255, 0.55)"
                >
                    Toque para rolar 👆
                </p>
            </Transition>
        </div>
    </div>

    <!-- Modal de configuracao -->
    <Transition name="modal">
        <ConfigModal v-if="showConfig" @close="showConfig = false" />
    </Transition>
</template>

<style scoped>
.hint-enter-active,
.hint-leave-active {
    transition:
        opacity 0.3s ease,
        transform 0.3s ease;
}
.hint-enter-from,
.hint-leave-to {
    opacity: 0;
    transform: translateY(6px);
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>
