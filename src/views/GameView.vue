<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import DiceFace from '../components/DiceFace.vue';
import ConfigModal from '../components/ConfigModal.vue';
import { useDiceConfig } from '../composables/useDiceConfig';
import { useDiceRoll } from '../composables/useDiceRoll';
import { useI18n } from '../composables/useI18n';

const { config } = useDiceConfig();
const { currentValue, targetValue, isRolling, shakeKey, rollForce, roll, completeRoll } = useDiceRoll();
const { t } = useI18n();

const showConfig = ref(false);

const isPressing = ref(false);

const showForceMeter = ref(false);

const forcePercent = ref(0);

const pressStartTime = ref(0);

const pressStartY = ref(0);

const pressCurrentY = ref(0);

let holdTimer = null;

let holdFrame = null;

let autoRollTimer = null;

// Rola automaticamente ao montar (inclui reload de pagina)
onMounted(() => {
    autoRollTimer = window.setTimeout(() => {
        roll(24);
    }, 400);
});

onBeforeUnmount(() => {
    if (autoRollTimer) {
        window.clearTimeout(autoRollTimer);
        autoRollTimer = null;
    }

    clearHoldTimer();
    stopHoldLoop();
});

function clampForce(force) {
    if (force < 0) {
        return 0;
    }

    if (force > 100) {
        return 100;
    }

    return force;
}

function updateForce(force) {
    forcePercent.value = clampForce(force);
}

function clearHoldTimer() {
    if (!holdTimer) {
        return;
    }

    window.clearTimeout(holdTimer);
    holdTimer = null;
}

function stopHoldLoop() {
    if (!holdFrame) {
        return;
    }

    window.cancelAnimationFrame(holdFrame);
    holdFrame = null;
}

function calculateSwipeForce() {
    const swipeDistance = pressStartY.value - pressCurrentY.value;
    const swipeDuration = Math.max(Date.now() - pressStartTime.value, 1);
    const swipeVelocity = swipeDistance / swipeDuration;
    const velocityForce = swipeVelocity * 120;
    const distanceForce = swipeDistance * 0.22;
    const combinedForce = velocityForce + distanceForce;

    return clampForce(combinedForce);
}

function startHoldLoop() {
    if (!isPressing.value) {
        return;
    }

    const nextForce = forcePercent.value + 0.34;

    updateForce(nextForce);

    holdFrame = window.requestAnimationFrame(startHoldLoop);
}

function beginPress(event) {
    if (isRolling.value) {
        return;
    }

    isPressing.value = true;
    showForceMeter.value = false;
    updateForce(0);

    pressStartTime.value = Date.now();
    pressStartY.value = event.clientY;
    pressCurrentY.value = event.clientY;

    clearHoldTimer();
    stopHoldLoop();

    holdTimer = window.setTimeout(() => {
        if (!isPressing.value) {
            return;
        }

        showForceMeter.value = true;
        startHoldLoop();
    }, 1100);

    if (event.currentTarget && event.currentTarget.setPointerCapture) {
        event.currentTarget.setPointerCapture(event.pointerId);
    }
}

function movePress(event) {
    if (!isPressing.value) {
        return;
    }

    pressCurrentY.value = event.clientY;

    const swipeForce = calculateSwipeForce();

    if (swipeForce <= forcePercent.value) {
        return;
    }

    updateForce(swipeForce);
}

function finishPress(event) {
    if (!isPressing.value) {
        return;
    }

    isPressing.value = false;

    clearHoldTimer();
    stopHoldLoop();

    const holdDuration = Date.now() - pressStartTime.value;
    const swipeDistance = pressStartY.value - pressCurrentY.value;
    const hasSwipe = swipeDistance > 40;
    const swipeForce = calculateSwipeForce();

    const tapForce = 20 + Math.random() * 12;

    showForceMeter.value = false;

    if (event && event.currentTarget && event.currentTarget.releasePointerCapture) {
        event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (holdDuration < 1100 && !hasSwipe) {
        roll(tapForce);

        return;
    }

    const finalForce = Math.max(forcePercent.value, swipeForce, 24);

    roll(finalForce);
}

// Badge do modo atual
const modeBadge = computed(() => {
    const mode = config.value.mode;
    const colorMap = {
        classic6: '#7c3aed',
        classic3: '#0891b2',
        custom: '#059669',
    };

    return {
        label: t(`modes.${mode}.label`),
        emoji: t(`modes.${mode}.emoji`),
        color: colorMap[mode],
    };
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
                :aria-label="t('gameView.configButton')"
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
            class="relative flex w-full flex-1 flex-col items-center justify-center gap-8"
        >
            <DiceFace
                :value="currentValue"
                :targetValue="targetValue"
                :mode="config.mode"
                :customCount="config.customCount"
                :customValues="config.customValues"
                :showNumberForEach="config.showNumberForEach"
                :showItemsCounter="config.showItemsCounter"
                :isRolling="isRolling"
                :shakeKey="shakeKey"
                :rollForce="rollForce"
                @pointerdown.prevent="beginPress"
                @pointermove.prevent="movePress"
                @pointerup.prevent="finishPress"
                @pointercancel.prevent="finishPress"
                @roll-finished="completeRoll"
            />

            <!-- Dica de interacao -->
            <Transition name="hint">
                <p
                    class="text-sm font-semibold select-none pointer-events-none pt-3"
                    style="color: rgba(255, 255, 255, 0.55)"
                    :class="{
                        'opacity-0': isRolling,
                        'opacity-100': !isRolling,
                    }"
                >
                    {{ t('gameView.touchHint') }}
                </p>
            </Transition>

            <Transition name="force-meter">
                <div
                    v-if="showForceMeter"
                    class="pointer-events-none absolute bottom-6 left-0 right-0 flex justify-center px-5"
                >
                    <div
                        class="w-full max-w-sm rounded-3xl border border-white/15 bg-slate-950/40 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.28)] backdrop-blur-md"
                    >
                        <div class="flex items-center justify-between">
                            <span class="text-[0.65rem] font-bold uppercase tracking-[0.32em] text-white/60">
                                {{ t('gameView.forceLabel') }}
                            </span>

                            <span class="text-sm font-black text-white">
                                {{ Math.round(forcePercent) }}%
                            </span>
                        </div>

                        <div class="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                            <div
                                class="h-full rounded-full bg-[linear-gradient(90deg,#38bdf8_0%,#8b5cf6_52%,#22c55e_100%)] transition-[width] duration-100"
                                :style="{
                                    width: `${Math.round(forcePercent)}%`,
                                }"
                            />
                        </div>
                    </div>
                </div>
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

.force-meter-enter-active,
.force-meter-leave-active {
    transition:
        opacity 0.22s ease,
        transform 0.22s ease;
}

.force-meter-enter-from,
.force-meter-leave-to {
    opacity: 0;
    transform: translateY(22px);
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
