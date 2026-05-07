<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { gsap } from 'gsap';

const props = defineProps({
    value: { type: [Number, String], required: true },
    targetValue: { type: [Number, String], default: null },
    mode: { type: String, required: true },
    showNumberForEach: { type: Boolean, default: false },
    showItemsCounter: { type: Boolean, default: true },
    isRolling: { type: Boolean, default: false },
    shakeKey: { type: Number, default: 0 },
});

const sceneElement = ref(null);

const diceElement = ref(null);

const valueElement = ref(null);

let rollTimeline = null;

// Cores vibrantes e distintas para cada pip (idx 0-5)
const PIP_COLORS = [
    { bg: '#ef4444', border: '#dc2626', label: '#fff' }, // vermelho
    { bg: '#3b82f6', border: '#2563eb', label: '#fff' }, // azul
    { bg: '#22c55e', border: '#16a34a', label: '#fff' }, // verde
    { bg: '#f97316', border: '#ea580c', label: '#fff' }, // laranja
    { bg: '#a855f7', border: '#9333ea', label: '#fff' }, // roxo
    { bg: '#ec4899', border: '#db2777', label: '#fff' }, // rosa
];

/**
 * Posicoes dos pips: [top%, left%]
 * Baseado no layout real de um dado fisico
 */
const PIP_POSITIONS = {
    1: [[50, 50]],
    2: [
        [28, 72],
        [72, 28],
    ],
    3: [
        [28, 72],
        [50, 50],
        [72, 28],
    ],
    4: [
        [28, 28],
        [28, 72],
        [72, 28],
        [72, 72],
    ],
    5: [
        [28, 28],
        [28, 72],
        [50, 50],
        [72, 28],
        [72, 72],
    ],
    6: [
        [25, 28],
        [50, 28],
        [75, 28],
        [25, 72],
        [50, 72],
        [75, 72],
    ],
};

const pips = computed(() => {
    if (props.mode === 'custom') {
        return [];
    }

    const positions = PIP_POSITIONS[props.value];

    if (!positions) {
        return [];
    }

    return positions.map((pos, idx) => ({
        top: pos[0],
        left: pos[1],
        color: PIP_COLORS[idx],
        number: idx + 1,
        key: `${props.shakeKey}-${idx}`,
    }));
});

const isClassic = computed(() => props.mode !== 'custom');

// Tamanho da fonte do valor custom
const customFontSize = computed(() => {
    const v = String(props.value);

    if (v.length === 1) {
        return 'clamp(5rem, 22vw, 9rem)';
    }

    return 'clamp(3rem, 14vw, 6rem)';
});

const FACE_ROTATIONS = {
    classic6: {
        1: { rotateX: 0, rotateY: 0 },
        2: { rotateX: 0, rotateY: 180 },
        3: { rotateX: 0, rotateY: -90 },
        4: { rotateX: 0, rotateY: 90 },
        5: { rotateX: -90, rotateY: 0 },
        6: { rotateX: 90, rotateY: 0 },
    },
    classic3: {
        1: { rotateX: 0, rotateY: 0 },
        2: { rotateX: 0, rotateY: 180 },
        3: { rotateX: 0, rotateY: -90 },
    },
    custom: {
        rotateX: -16,
        rotateY: 22,
    },
};

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getTargetRotation() {
    if (props.mode === 'custom') {
        return FACE_ROTATIONS.custom;
    }

    const modeRotations = FACE_ROTATIONS[props.mode];

    if (!modeRotations) {
        return FACE_ROTATIONS.custom;
    }

    const resolvedValue =
        props.targetValue === null || props.targetValue === undefined ? props.value : props.targetValue;

    const target = modeRotations[resolvedValue];

    if (!target) {
        return FACE_ROTATIONS.custom;
    }

    return target;
}

function pulseValue() {
    if (!valueElement.value) {
        return;
    }

    gsap.killTweensOf(valueElement.value);

    gsap.fromTo(
        valueElement.value,
        {
            scale: 0.82,
            opacity: 0.65,
        },
        {
            scale: 1,
            opacity: 1,
            duration: 0.35,
            ease: 'back.out(3)',
        }
    );
}

function animateRoll() {
    if (!sceneElement.value) {
        return;
    }

    if (!diceElement.value) {
        return;
    }

    if (rollTimeline) {
        rollTimeline.kill();
    }

    const targetRotation = getTargetRotation();
    const spinX = randomBetween(720, 1080);
    const spinY = randomBetween(720, 1260);
    const lift = randomBetween(18, 30);

    rollTimeline = gsap.timeline({
        defaults: {
            ease: 'power3.out',
        },
    });

    rollTimeline.set(sceneElement.value, {
        y: 0,
    });

    rollTimeline.to(
        sceneElement.value,
        {
            y: -lift,
            duration: 0.24,
            ease: 'power2.out',
        },
        0
    );

    rollTimeline.to(
        sceneElement.value,
        {
            y: 0,
            duration: 0.48,
            ease: 'bounce.out',
        },
        0.24
    );

    rollTimeline.to(
        diceElement.value,
        {
            rotateX: targetRotation.rotateX + spinX,
            rotateY: targetRotation.rotateY + spinY,
            scale: 1.05,
            duration: 1,
        },
        0
    );

    rollTimeline.to(
        diceElement.value,
        {
            scale: 1,
            duration: 0.2,
            ease: 'power2.out',
        },
        0.86
    );

    rollTimeline.add(() => {
        gsap.set(diceElement.value, {
            rotateX: targetRotation.rotateX,
            rotateY: targetRotation.rotateY,
            scale: 1,
        });
    });
}

onMounted(() => {
    if (sceneElement.value) {
        gsap.set(sceneElement.value, {
            perspective: 1400,
        });
    }

    if (diceElement.value) {
        gsap.set(diceElement.value, {
            rotateX: FACE_ROTATIONS.custom.rotateX,
            rotateY: FACE_ROTATIONS.custom.rotateY,
            scale: 1,
            transformStyle: 'preserve-3d',
            transformOrigin: 'center center',
        });
    }
});

watch(
    () => props.shakeKey,
    () => {
        animateRoll();
    }
);

watch(
    () => props.isRolling,
    (isRolling, wasRolling) => {
        if (!wasRolling || isRolling) {
            return;
        }

        pulseValue();
    }
);

onBeforeUnmount(() => {
    if (rollTimeline) {
        rollTimeline.kill();
        rollTimeline = null;
    }

    if (!sceneElement.value) {
        return;
    }

    gsap.killTweensOf(sceneElement.value);

    if (!diceElement.value) {
        return;
    }

    gsap.killTweensOf(diceElement.value);
});
</script>

<template>
    <div
        ref="sceneElement"
        class="relative cursor-pointer select-none touch-none [perspective:1400px]"
    >
        <!-- Face do dado -->
        <div
            ref="diceElement"
            class="relative overflow-hidden transition-transform duration-75 active:scale-95 transform-gpu"
            style="
                width: min(72vw, 320px);
                height: min(72vw, 320px);
                background: #ffffff;
                border-radius: 2.5rem;
                box-shadow:
                    0 30px 80px rgba(0, 0, 0, 0.25),
                    0 8px 20px rgba(0, 0, 0, 0.12),
                    inset 0 2px 0 rgba(255, 255, 255, 0.95),
                    inset 0 -3px 0 rgba(0, 0, 0, 0.06);
                border: 3px solid rgba(255, 255, 255, 0.7);
            "
        >
            <!-- Brilho sutil no canto superior esquerdo -->
            <div
                class="absolute top-0 left-0 rounded-br-full pointer-events-none"
                style="
                    width: 45%;
                    height: 45%;
                    background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.7) 0%, transparent 70%);
                "
            />

            <!-- MODO CLASSICO: pips posicionados absolutamente -->
            <template v-if="isClassic">
                <TransitionGroup name="pip">
                    <div
                        v-for="pip in pips"
                        :key="pip.key"
                        class="absolute rounded-full flex items-center justify-center"
                        style="
                            width: min(13vw, 58px);
                            height: min(13vw, 58px);
                            transform: translate(-50%, -50%);
                            box-shadow:
                                0 3px 8px rgba(0, 0, 0, 0.2),
                                inset 0 1px 0 rgba(255, 255, 255, 0.4);
                        "
                        :style="{
                            top: pip.top + '%',
                            left: pip.left + '%',
                            backgroundColor: pip.color.bg,
                            border: `3px solid ${pip.color.border}`,
                        }"
                    >
                        <span
                            v-if="showNumberForEach"
                            class="font-black leading-none select-none"
                            style="
                                font-size: clamp(0.75rem, 3.5vw, 1.1rem);
                                color: #fff;
                                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                            "
                        >
                            {{ pip.number }}
                        </span>
                    </div>
                </TransitionGroup>

                <!-- Badge numero total (exibido quando showItemsCounter ativo) -->
                <Transition name="badge">
                    <div
                        v-if="showItemsCounter"
                        ref="valueElement"
                        class="absolute bottom-3 right-3 flex items-center justify-center rounded-full"
                        style="
                            width: 36px;
                            height: 36px;
                            background: #7c3aed;
                            box-shadow: 0 2px 8px rgba(124, 58, 237, 0.5);
                        "
                    >
                        <span class="text-white font-black leading-none" style="font-size: 1rem">
                            {{ value }}
                        </span>
                    </div>
                </Transition>
            </template>

            <!-- MODO CUSTOM: valor em destaque centralizado -->
            <template v-else>
                <div class="absolute inset-0 flex items-center justify-center">
                    <span
                        ref="valueElement"
                        class="font-black leading-none select-none transition-all duration-75"
                        style="color: #7c3aed"
                        :style="{ fontSize: customFontSize }"
                    >
                        {{ value }}
                    </span>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
/* Animacao de entrada dos pips ao trocar o valor */
.pip-enter-active {
    animation: pip-in 0.2s ease-out;
}

.pip-leave-active {
    animation: pip-out 0.1s ease-in;
}

@keyframes pip-in {
    from {
        transform: translate(-50%, -50%) scale(0.2);
        opacity: 0;
    }
    60% {
        transform: translate(-50%, -50%) scale(1.15);
    }
    to {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
}

@keyframes pip-out {
    to {
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
    }
}

/* Animacao do badge do numero total */
.badge-enter-active,
.badge-leave-active {
    transition: all 0.2s ease;
}
.badge-enter-from,
.badge-leave-to {
    opacity: 0;
    transform: scale(0.4);
}

/* Keyframe do shake (referenciado inline via style) */
@keyframes dice-shake {
    0%,
    100% {
        transform: rotate(0deg) scale(1);
    }
    10% {
        transform: rotate(-12deg) scale(1.06);
    }
    20% {
        transform: rotate(12deg) scale(1.09);
    }
    30% {
        transform: rotate(-10deg) scale(1.07);
    }
    40% {
        transform: rotate(10deg) scale(1.1);
    }
    50% {
        transform: rotate(-7deg) scale(1.08);
    }
    60% {
        transform: rotate(7deg) scale(1.06);
    }
    70% {
        transform: rotate(-4deg) scale(1.04);
    }
    80% {
        transform: rotate(4deg) scale(1.02);
    }
    90% {
        transform: rotate(-2deg) scale(1.01);
    }
}
</style>
