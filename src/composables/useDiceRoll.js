import { onBeforeUnmount, ref, watch } from 'vue';
import { useDiceConfig } from './useDiceConfig';

export function useDiceRoll() {
    const { config, rollValue } = useDiceConfig();

    const currentValue = ref(rollValue());

    const plannedValue = ref(currentValue.value);

    const isRolling = ref(false);
    const shakeKey = ref(0); // incrementado a cada roll para reiniciar a animacao CSS

    let timers = [];

    function clearTimers() {
        timers.forEach(clearTimeout);
        timers = [];
    }

    /**
     * Inicia o efeito de rolar:
     * - Fase rapida: troca valores a cada 60ms (6x)
     * - Fase media:  troca a cada 120ms (4x)
     * - Fase lenta:  troca a cada 220ms (3x)
     * - Resultado final definido no ultimo tick
     */
    function roll() {
        if (isRolling.value) {
            return;
        }

        clearTimers();
        isRolling.value = true;
        plannedValue.value = rollValue();
        shakeKey.value++;

        const phases = [...Array(6).fill(60), ...Array(4).fill(120), ...Array(3).fill(220)];

        let elapsed = 0;

        phases.forEach((delay, idx) => {
            elapsed += delay;
            const t = setTimeout(() => {
                if (idx === phases.length - 1) {
                    currentValue.value = plannedValue.value;
                } else {
                    currentValue.value = rollValue();
                }

                if (idx === phases.length - 1) {
                    isRolling.value = false;
                }
            }, elapsed);
            timers.push(t);
        });
    }

    // Quando o modo de jogo muda, re-rola automaticamente
    watch(
        () => config.value.mode,
        () => {
            if (!isRolling.value) {
                currentValue.value = rollValue();
            }
        }
    );

    watch(
        () => config.value.customCount,
        () => {
            if (!isRolling.value && config.value.mode === 'custom') {
                currentValue.value = rollValue();
            }
        }
    );

    onBeforeUnmount(() => {
        clearTimers();
    });

    return {
        currentValue,
        plannedValue,
        isRolling,
        shakeKey,
        roll,
    };
}
