<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    modelValue: { type: String, default: '' },
    slotIndex: { type: Number, required: true },
});

const emit = defineEmits(['update:modelValue']);

const showGrid = ref(false);

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const NUMBERS = '0123456789'.split('');
const ALL_CHARS = [...LETTERS, ...NUMBERS];

const activeTab = ref('letters'); // 'letters' | 'numbers'

const displayChars = computed(() => (activeTab.value === 'letters' ? LETTERS : NUMBERS));

function select(char) {
    emit('update:modelValue', char);
    showGrid.value = false;
}

function onInput(e) {
    const raw = e.target.value;
    const clean = raw
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(-1);
    emit('update:modelValue', clean);
    e.target.value = clean;
}

function onKeydown(e) {
    // Permite apenas alfanumerico, backspace e delete
    const allowed = /^[a-zA-Z0-9]$/.test(e.key) || ['Backspace', 'Delete', 'Tab'].includes(e.key);
    if (!allowed) e.preventDefault();
}

const slotColors = [
    { bg: '#ef444420', border: '#ef4444', text: '#dc2626' },
    { bg: '#3b82f620', border: '#3b82f6', text: '#2563eb' },
    { bg: '#22c55e20', border: '#22c55e', text: '#16a34a' },
    { bg: '#f9731620', border: '#f97316', text: '#ea580c' },
    { bg: '#a855f720', border: '#a855f7', text: '#9333ea' },
    { bg: '#ec489920', border: '#ec4899', text: '#db2777' },
];

const slotColor = computed(() => slotColors[props.slotIndex % slotColors.length]);
</script>

<template>
    <div class="relative">
        <!-- Campo de visualizacao / input -->
        <div class="flex items-center gap-2">
            <!-- Display clicavel com o valor atual -->
            <button
                type="button"
                class="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl transition-all duration-150 border-2"
                :style="{
                    background: slotColor.bg,
                    borderColor: slotColor.border,
                    color: slotColor.text,
                }"
                @click="showGrid = !showGrid"
                :aria-label="`Valor do slot ${slotIndex + 1}: ${modelValue || 'vazio'}`"
            >
                {{ modelValue || '?' }}
            </button>

            <!-- Input de texto (digitar manualmente) -->
            <div class="flex-1 relative">
                <input
                    type="text"
                    :value="modelValue"
                    maxlength="1"
                    class="w-full h-11 rounded-xl border-2 px-3 text-center text-lg font-bold uppercase transition-all duration-150 outline-none"
                    :style="{
                        borderColor: modelValue ? slotColor.border : '#e5e7eb',
                        color: slotColor.text,
                    }"
                    placeholder="Digite ou escolha"
                    @input="onInput"
                    @keydown="onKeydown"
                />
            </div>

            <!-- Botao de limpar -->
            <button
                v-if="modelValue"
                type="button"
                class="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                @click="emit('update:modelValue', '')"
                aria-label="Limpar"
            >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <!-- Grid de selecao (expande abaixo) -->
        <Transition name="grid-expand">
            <div
                v-if="showGrid"
                class="mt-2 rounded-2xl border border-gray-200 bg-white shadow-xl p-3 z-10"
                style="position: relative"
            >
                <!-- Tabs letras / numeros -->
                <div class="flex gap-1 mb-2 p-1 bg-gray-100 rounded-xl">
                    <button
                        type="button"
                        class="flex-1 py-1.5 rounded-lg text-sm font-bold transition-all"
                        :class="activeTab === 'letters' ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500'"
                        @click="activeTab = 'letters'"
                    >
                        A - Z
                    </button>
                    <button
                        type="button"
                        class="flex-1 py-1.5 rounded-lg text-sm font-bold transition-all"
                        :class="activeTab === 'numbers' ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500'"
                        @click="activeTab = 'numbers'"
                    >
                        0 - 9
                    </button>
                </div>

                <!-- Grade de caracteres -->
                <div class="grid gap-1" :class="activeTab === 'letters' ? 'grid-cols-9' : 'grid-cols-5'">
                    <button
                        v-for="char in displayChars"
                        :key="char"
                        type="button"
                        class="aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-100 border"
                        :class="
                            modelValue === char
                                ? 'text-white border-transparent'
                                : 'text-gray-700 border-gray-200 hover:border-violet-300 hover:bg-violet-50'
                        "
                        :style="
                            modelValue === char ? { background: slotColor.border, borderColor: slotColor.border } : {}
                        "
                        @click="select(char)"
                    >
                        {{ char }}
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.grid-expand-enter-active,
.grid-expand-leave-active {
    transition: all 0.2s ease;
}

.grid-expand-enter-from,
.grid-expand-leave-to {
    opacity: 0;
    transform: translateY(-6px) scale(0.97);
}
</style>
