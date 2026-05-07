<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { gsap } from 'gsap';

const props = defineProps({
    value: { type: [Number, String], required: true },
    targetValue: { type: [Number, String], default: null },
    mode: { type: String, required: true },
    customCount: { type: Number, default: 2 },
    customValues: { type: Array, default: () => [] },
    showNumberForEach: { type: Boolean, default: false },
    showItemsCounter: { type: Boolean, default: true },
    isRolling: { type: Boolean, default: false },
    shakeKey: { type: Number, default: 0 },
    rollForce: { type: Number, default: 24 },
});

const emit = defineEmits(['roll-finished']);

const sceneElement = ref(null);

const cubeElement = ref(null);

const shadowElement = ref(null);

let rollTimeline = null;

const CLASSIC_PIP_LAYOUTS = {
    1: [
        { row: 2, col: 2 },
    ],
    2: [
        { row: 1, col: 1 },
        { row: 3, col: 3 },
    ],
    3: [
        { row: 1, col: 1 },
        { row: 2, col: 2 },
        { row: 3, col: 3 },
    ],
    4: [
        { row: 1, col: 1 },
        { row: 1, col: 3 },
        { row: 3, col: 1 },
        { row: 3, col: 3 },
    ],
    5: [
        { row: 1, col: 1 },
        { row: 1, col: 3 },
        { row: 2, col: 2 },
        { row: 3, col: 1 },
        { row: 3, col: 3 },
    ],
    6: [
        { row: 1, col: 1 },
        { row: 2, col: 1 },
        { row: 3, col: 1 },
        { row: 1, col: 3 },
        { row: 2, col: 3 },
        { row: 3, col: 3 },
    ],
};

const CLASSIC_PIP_COLORS = [
    { bg: '#ef4444', border: '#dc2626' },
    { bg: '#3b82f6', border: '#2563eb' },
    { bg: '#22c55e', border: '#16a34a' },
    { bg: '#f97316', border: '#ea580c' },
    { bg: '#a855f7', border: '#9333ea' },
    { bg: '#ec4899', border: '#db2777' },
];

const CLASSIC_CORE_STYLE =
    'absolute inset-[6%] rounded-[24%] bg-[radial-gradient(circle_at_35%_30%,#ffffff_0%,#f8fafc_46%,#e2e8f0_100%)] shadow-[inset_0_10px_18px_rgba(255,255,255,0.9),inset_0_-14px_24px_rgba(148,163,184,0.16)] [transform:translateZ(0px)]';

const CLASSIC_PIP_BASE_CLASS =
    'rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_3px_8px_rgba(15,23,42,0.18)]';

const FACE_ROTATIONS = [
    { rotateX: 0, rotateY: 0 },
    { rotateX: 0, rotateY: 180 },
    { rotateX: 0, rotateY: -90 },
    { rotateX: 0, rotateY: 90 },
    { rotateX: 90, rotateY: 0 },
    { rotateX: -90, rotateY: 0 },
];

const FACE_TRANSFORMS = [
    'translateZ(var(--dice-depth))',
    'rotateY(180deg) translateZ(var(--dice-depth))',
    'rotateY(90deg) translateZ(var(--dice-depth))',
    'rotateY(-90deg) translateZ(var(--dice-depth))',
    'rotateX(-90deg) translateZ(var(--dice-depth))',
    'rotateX(90deg) translateZ(var(--dice-depth))',
];

const FACE_BASE_STYLES = [
    'bg-[linear-gradient(145deg,#ffffff_0%,#f8fafc_56%,#eef2f7_100%)]',
    'bg-[linear-gradient(145deg,#ffffff_0%,#f8fafc_56%,#eef2f7_100%)]',
    'bg-[linear-gradient(145deg,#ffffff_0%,#f8fafc_56%,#eef2f7_100%)]',
    'bg-[linear-gradient(145deg,#ffffff_0%,#f8fafc_56%,#eef2f7_100%)]',
    'bg-[linear-gradient(145deg,#ffffff_0%,#f8fafc_56%,#eef2f7_100%)]',
    'bg-[linear-gradient(145deg,#ffffff_0%,#f8fafc_56%,#eef2f7_100%)]',
];

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function normalizeCustomValues() {
    const sourceValues = props.customValues.slice(0, props.customCount);
    const validValues = sourceValues.filter((value) => String(value).trim() !== '');

    if (validValues.length === 0) {
        return ['?'];
    }

    return validValues;
}

const cubeFaceValues = computed(() => {
    if (props.mode === 'classic6') {
        return [1, 6, 3, 4, 2, 5];
    }

    if (props.mode === 'classic3') {
        return [1, 3, 2, 1, 3, 2];
    }

    const customValues = normalizeCustomValues();
    const values = [];

    for (let index = 0; index < 6; index += 1) {
        values.push(customValues[index % customValues.length]);
    }

    return values;
});

const customFontSize = computed(() => {
    const value = String(props.value);

    if (value.length === 1) {
        return 'clamp(4.75rem, 22vw, 8.5rem)';
    }

    return 'clamp(3rem, 14vw, 6rem)';
});

const cubeDepthStyle = computed(() => {
    return {
        '--dice-depth': 'calc(min(72vw, 320px) / 2)',
    };
});

function getFaceIndexForValue(value) {
    const targetIndex = cubeFaceValues.value.findIndex((faceValue) => faceValue === value);

    if (targetIndex >= 0) {
        return targetIndex;
    }

    return 0;
}

function getFaceRotationByValue(value) {
    const faceIndex = getFaceIndexForValue(value);

    return FACE_ROTATIONS[faceIndex];
}

function getClassicPipLayout(faceValue) {
    const numericValue = Number(faceValue);

    if (Number.isNaN(numericValue)) {
        return [];
    }

    const layout = CLASSIC_PIP_LAYOUTS[numericValue];

    if (!layout) {
        return [];
    }

    return layout.map((position, index) => {
        return {
            key: `${faceValue}-${index}`,
            row: position.row,
            col: position.col,
            color: CLASSIC_PIP_COLORS[index % CLASSIC_PIP_COLORS.length],
        };
    });
}

function getCustomFaceStyle(faceValue, index) {
    const values = normalizeCustomValues();
    const resolvedValue = String(faceValue);
    const resolvedIndex = values.findIndex((value) => String(value) === resolvedValue);

    if (resolvedIndex < 0) {
        return {
            color: '#7c3aed',
            textShadow: '0 2px 0 rgba(255,255,255,0.55), 0 8px 18px rgba(15,23,42,0.16)',
        };
    }

    const paletteIndex = (resolvedIndex + index) % values.length;
    const hue = (paletteIndex * 67) % 360;

    return {
        color: `hsl(${hue} 78% 46%)`,
        textShadow: '0 2px 0 rgba(255,255,255,0.55), 0 8px 18px rgba(15,23,42,0.16)',
    };
}

function setCubeToValue(value) {
    if (!cubeElement.value) {
        return;
    }

    const rotation = getFaceRotationByValue(value);

    gsap.set(cubeElement.value, {
        rotateX: rotation.rotateX,
        rotateY: rotation.rotateY,
        x: 0,
        y: 0,
        scale: 1,
    });
}

function animateRoll() {
    if (!sceneElement.value) {
        return;
    }

    if (!cubeElement.value) {
        return;
    }

    if (!shadowElement.value) {
        return;
    }

    if (rollTimeline) {
        rollTimeline.kill();
        rollTimeline = null;
    }

    const targetRawValue = props.targetValue === null || props.targetValue === undefined ? props.value : props.targetValue;
    const targetRotation = getFaceRotationByValue(targetRawValue);
    const normalizedForce = Math.max(0, Math.min(100, Number(props.rollForce) || 0));
    const spinX = Math.min(3, Math.max(1, Math.round(normalizedForce / 54) + randomBetween(0, 1)));
    const spinY = Math.min(3, Math.max(2, Math.round(normalizedForce / 44) + randomBetween(0, 1)));
    const lift = 8 + normalizedForce * 0.11;
    const sway = randomBetween(-6, 6);
    const duration = 1 + normalizedForce / 145;
    const settleDuration = 0.3 + normalizedForce / 480;

    rollTimeline = gsap.timeline({
        defaults: {
            ease: 'power2.out',
        },
    });

    rollTimeline.to(
        sceneElement.value,
        {
            y: -lift,
            duration: 0.14,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out',
        },
        0
    );

    rollTimeline.to(
        shadowElement.value,
        {
            scaleX: 0.94,
            scaleY: 0.94,
            opacity: 0.6,
            duration: 0.14,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out',
        },
        0
    );

    rollTimeline.to(
        cubeElement.value,
        {
            rotateX: targetRotation.rotateX + 360 * spinX,
            rotateY: targetRotation.rotateY + 360 * spinY,
            x: sway,
            y: randomBetween(-3, 3),
            duration: duration,
        },
        0
    );

    rollTimeline.to(
        cubeElement.value,
        {
            x: 0,
            y: 0,
            duration: settleDuration,
            ease: 'power3.out',
        },
        duration - 0.1
    );

    rollTimeline.add(() => {
        emit('roll-finished');
    });
}

function getFaceClasses(index) {
    return [
        'absolute inset-0 overflow-hidden rounded-[2.5rem] border border-white/90 [backface-visibility:hidden] shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-4px_0_rgba(15,23,42,0.1)]',
        FACE_BASE_STYLES[index] || FACE_BASE_STYLES[0],
    ];
}

onMounted(() => {
    if (sceneElement.value) {
        gsap.set(sceneElement.value, {
            y: 0,
        });
    }

    if (shadowElement.value) {
        gsap.set(shadowElement.value, {
            scaleX: 1,
            scaleY: 1,
            opacity: 0.72,
        });
    }

    setCubeToValue(props.value);
});

watch(
    () => props.shakeKey,
    () => {
        animateRoll();
    }
);

watch(
    () => props.value,
    (value) => {
        if (props.isRolling) {
            return;
        }

        setCubeToValue(value);
    }
);

watch(
    () => [props.mode, props.customCount, props.customValues],
    () => {
        if (props.isRolling) {
            return;
        }

        setCubeToValue(props.value);
    },
    { deep: true }
);

onBeforeUnmount(() => {
    if (rollTimeline) {
        rollTimeline.kill();
        rollTimeline = null;
    }

    if (sceneElement.value) {
        gsap.killTweensOf(sceneElement.value);
    }

    if (cubeElement.value) {
        gsap.killTweensOf(cubeElement.value);
    }

    if (shadowElement.value) {
        gsap.killTweensOf(shadowElement.value);
    }
});
</script>

<template>
    <div
        ref="sceneElement"
        class="relative cursor-pointer select-none touch-none [perspective:1200px]"
        :style="cubeDepthStyle"
    >
        <div
            ref="shadowElement"
            class="pointer-events-none absolute left-1/2 top-[calc(100%-14px)] h-8 w-[72%] -translate-x-1/2 rounded-full bg-slate-950/25 blur-[14px]"
        />

        <div
            ref="cubeElement"
            class="relative transform-gpu [transform-style:preserve-3d] will-change-transform"
            style="
                width: min(72vw, 320px);
                height: min(72vw, 320px);
            "
        >
            <div
                v-for="(faceValue, index) in cubeFaceValues"
                :key="`${faceValue}-${index}`"
                :class="getFaceClasses(index)"
                :style="{
                    transform: FACE_TRANSFORMS[index],
                }"
            >
                <div class="absolute inset-0 rounded-[2.25rem] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0.16)_24%,transparent_70%)]" />

                <div class="absolute inset-0 rounded-[2.25rem] ring-1 ring-black/5" />

                <div class="absolute inset-0 flex items-center justify-center">
                    <template v-if="mode === 'custom'">
                        <span
                            class="font-black leading-none select-none text-center"
                            :style="{
                                ...getCustomFaceStyle(faceValue, index),
                                fontSize: customFontSize,
                            }"
                        >
                            {{ faceValue }}
                        </span>
                    </template>

                    <template v-else>
                        <div class="absolute inset-0 p-[18%]">
                            <div :class="CLASSIC_CORE_STYLE" />

                            <span
                                v-if="showItemsCounter"
                                class="absolute bottom-4 right-4 flex h-7 w-7 items-center justify-center rounded-full border border-white/80 bg-slate-950/85 text-[0.7rem] font-black text-white shadow-[0_4px_12px_rgba(15,23,42,0.24)]"
                            >
                                {{ faceValue }}
                            </span>

                            <div
                                v-if="mode === 'classic6' || mode === 'classic3'"
                                class="absolute inset-[5%] grid grid-cols-3 grid-rows-3 place-items-center"
                            >
                                <span
                                    v-for="pip in getClassicPipLayout(faceValue)"
                                    :key="pip.key"
                                    :class="[
                                        CLASSIC_PIP_BASE_CLASS,
                                        'h-[clamp(24px,7.2vw,48px)] w-[clamp(24px,7.2vw,48px)] border-[4px]',
                                    ]"
                                    :style="{
                                        gridColumnStart: pip.col,
                                        gridRowStart: pip.row,
                                        backgroundColor: pip.color.bg,
                                        borderColor: pip.color.border,
                                    }"
                                />
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
