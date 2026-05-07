import { ref, watch } from 'vue';

const STORAGE_KEY = 'dado-magico-v1';

const DEFAULT_CONFIG = {
    mode: 'classic6', // 'classic6' | 'classic3' | 'custom'
    showNumberForEach: false, // mostra o número para cada bolinha (modos classicos)
    showItemsCounter: true, // mostra número total no badge (modos classicos)
    customCount: 2, // 2 | 3 | 6 (modo custom)
    customValues: ['A', 'B'], // array de strings com customCount itens
};

function loadConfig() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
        }
    } catch {
        // ignore
    }
    return { ...DEFAULT_CONFIG };
}

// Estado singleton compartilhado entre composables
const config = ref(loadConfig());

watch(
    config,
    (val) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
        } catch {
            // ignore
        }
    },
    { deep: true }
);

export function useDiceConfig() {
    function updateConfig(partial) {
        config.value = { ...config.value, ...partial };
    }

    /**
     * Retorna um valor aleatorio baseado no modo atual.
     * - classic6: numero 1-6
     * - classic3: numero 1-3
     * - custom: um dos valores configurados (distribuicao igual)
     */
    function rollValue() {
        const { mode, customCount, customValues } = config.value;

        if (mode === 'classic6') {
            return Math.floor(Math.random() * 6) + 1;
        }

        if (mode === 'classic3') {
            return Math.floor(Math.random() * 3) + 1;
        }

        // custom: sorteia entre os valores validos
        const valid = customValues.slice(0, customCount).filter((v) => v && v.trim() !== '');
        if (valid.length === 0) return '?';
        return valid[Math.floor(Math.random() * valid.length)];
    }

    return {
        config,
        updateConfig,
        rollValue,
    };
}
