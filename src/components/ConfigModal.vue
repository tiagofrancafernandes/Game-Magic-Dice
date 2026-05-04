<script setup>
import { ref, computed, watch } from 'vue';
import { useDiceConfig } from '../composables/useDiceConfig';
import CharPicker from './CharPicker.vue';
import { useToast } from '@/composables/useToast';

const emit = defineEmits(['close']);

const { config, updateConfig } = useDiceConfig();

const toast = useToast();

// Estado local: copia do config para editar sem commitar em tempo real
const local = ref({
    mode: config.value.mode,
    showNumber: config.value.showNumber,
    customCount: config.value.customCount,
    customValues: [...config.value.customValues],
});

// Quando muda o customCount, ajusta o array de valores
watch(
    () => local.value.customCount,
    (newCount, oldCount) => {
        if (newCount > oldCount) {
            const defaultChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            for (let i = oldCount; i < newCount; i++) {
                local.value.customValues[i] = local.value.customValues[i] || defaultChars[i] || '?';
            }
        }
        local.value.customValues = local.value.customValues.slice(0, newCount);
    }
);

const customValuesValid = computed(() => {
    if (local.value.mode !== 'custom') return true;
    return local.value.customValues.every((v) => v && v.trim() !== '');
});

const canSave = computed(() => customValuesValid.value);

function save() {
    try {
        if (!canSave.value) {
            toast.error('Preencha todos os slots antes de salvar', {
                autoClose: 1000,
            });
            return;
        }
        updateConfig({ ...local.value });
        toast.success('Salvo com sucesso!', {
            autoClose: 1000,
        });
        emit('close');
    } catch (error) {
        toast.error('Erro ao salvar', {
            autoClose: 1000,
        });
    }
}

function cancel() {
    emit('close');
}

const MODE_OPTIONS = [
    {
        value: 'classic6',
        emoji: '🎲',
        label: 'Classico 6',
        desc: '6 faces de 1 a 6',
        color: '#7c3aed',
    },
    {
        value: 'classic3',
        emoji: '🎯',
        label: 'Classico 3',
        desc: '3 faces de 1 a 3',
        color: '#0891b2',
    },
    {
        value: 'custom',
        emoji: '✏️',
        label: 'Personalizado',
        desc: 'Letras e numeros',
        color: '#059669',
    },
];

const COUNT_OPTIONS = [
    { value: 2, label: '2 valores', desc: '3 lados cada (50%)' },
    { value: 3, label: '3 valores', desc: '2 lados cada (33%)' },
    { value: 6, label: '6 valores', desc: '1 lado cada (17%)' },
];
</script>

<template>
    <!-- Backdrop -->
    <Teleport to="body">
        <div
            class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            style="background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px)"
            @click.self="cancel"
        >
            <!-- Modal -->
            <div
                class="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden"
                style="max-height: 90vh; box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3)"
            >
                <!-- Header -->
                <div class="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                    <h2 class="text-xl font-black text-gray-900">Configuracoes</h2>
                    <button
                        type="button"
                        class="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                        @click="cancel"
                        aria-label="Fechar"
                    >
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Conteudo scrollavel -->
                <div class="overflow-y-auto px-6 py-5 space-y-6" style="max-height: calc(90vh - 140px)">
                    <!-- Secao: Modo de jogo -->
                    <section>
                        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Modo de Jogo</p>
                        <div class="grid grid-cols-3 gap-2">
                            <button
                                v-for="opt in MODE_OPTIONS"
                                :key="opt.value"
                                type="button"
                                class="flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all duration-150"
                                :class="
                                    local.mode === opt.value
                                        ? 'shadow-md'
                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                "
                                :style="
                                    local.mode === opt.value
                                        ? { borderColor: opt.color, background: opt.color + '12' }
                                        : {}
                                "
                                @click="local.mode = opt.value"
                            >
                                <span class="text-2xl leading-none">{{ opt.emoji }}</span>
                                <span
                                    class="text-xs font-bold leading-tight text-center"
                                    :style="local.mode === opt.value ? { color: opt.color } : { color: '#4b5563' }"
                                >
                                    {{ opt.label }}
                                </span>
                                <span class="text-xs text-gray-400 text-center leading-tight hidden sm:block">
                                    {{ opt.desc }}
                                </span>
                            </button>
                        </div>
                    </section>

                    <!-- Secao: Mostrar numero (modos classicos) -->
                    <section v-if="local.mode !== 'custom'">
                        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Opcoes Educativas</p>
                        <div
                            class="flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer"
                            @click="local.showNumber = !local.showNumber"
                        >
                            <div>
                                <p class="font-bold text-gray-800 text-sm">Mostrar numero nas bolinhas</p>
                                <p class="text-xs text-gray-400 mt-0.5">Exibe o numero em cada bolinha e no total</p>
                            </div>
                            <!-- Toggle switch -->
                            <div
                                class="relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                                :class="local.showNumber ? 'bg-violet-600' : 'bg-gray-300'"
                            >
                                <div
                                    class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                                    :class="local.showNumber ? 'translate-x-7' : 'translate-x-1'"
                                />
                            </div>
                        </div>
                    </section>

                    <!-- Secao: Modo customizado -->
                    <template v-if="local.mode === 'custom'">
                        <!-- Quantidade de valores -->
                        <section>
                            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                Quantidade de Valores
                            </p>
                            <div class="grid grid-cols-3 gap-2">
                                <button
                                    v-for="opt in COUNT_OPTIONS"
                                    :key="opt.value"
                                    type="button"
                                    class="flex flex-col items-center gap-0.5 py-3 px-2 rounded-2xl border-2 transition-all duration-150"
                                    :class="
                                        local.customCount === opt.value
                                            ? 'border-violet-500 bg-violet-50 shadow-sm'
                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                    "
                                    @click="local.customCount = opt.value"
                                >
                                    <span
                                        class="text-lg font-black"
                                        :class="local.customCount === opt.value ? 'text-violet-700' : 'text-gray-700'"
                                    >
                                        {{ opt.value }}
                                    </span>
                                    <span
                                        class="text-xs font-bold"
                                        :class="local.customCount === opt.value ? 'text-violet-600' : 'text-gray-500'"
                                    >
                                        valores
                                    </span>
                                    <span class="text-xs text-gray-400 text-center leading-tight">{{ opt.desc }}</span>
                                </button>
                            </div>
                        </section>

                        <!-- Valores de cada slot -->
                        <section>
                            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                Valores do Dado
                                <span class="normal-case font-normal text-gray-400 ml-1">(1 letra ou numero cada)</span>
                            </p>
                            <div class="space-y-4">
                                <div v-for="(_, idx) in local.customValues" :key="idx" class="flex items-start gap-3">
                                    <span class="mt-3 text-xs font-black text-gray-400 w-10 text-right flex-shrink-0">
                                        #{{ idx + 1 }}
                                    </span>
                                    <div class="flex-1">
                                        <CharPicker v-model="local.customValues[idx]" :slotIndex="idx" />
                                    </div>
                                </div>
                            </div>

                            <!-- Alerta se algum slot vazio -->
                            <p
                                v-if="!customValuesValid"
                                class="mt-3 text-xs text-amber-600 font-semibold flex items-center gap-1"
                            >
                                <span>⚠️</span>
                                Todos os slots precisam ser preenchidos para salvar.
                            </p>
                        </section>
                    </template>
                </div>

                <!-- Footer com botoes -->
                <div class="px-6 pb-6 pt-3 border-t border-gray-100 flex gap-3">
                    <button
                        type="button"
                        class="flex-1 py-3 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                        @click="cancel"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        class="flex-1 py-3 rounded-2xl font-bold text-white transition-all"
                        :class="
                            canSave
                                ? 'bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-200'
                                : 'bg-gray-300 cursor-not-allowed'
                        "
                        :disabled="!canSave"
                        @click="save"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
