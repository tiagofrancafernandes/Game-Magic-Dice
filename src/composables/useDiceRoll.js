import { ref, watch } from 'vue';
import { useDiceConfig } from './useDiceConfig';

export function useDiceRoll() {
    const { config, rollValue } = useDiceConfig();

    const currentValue = ref(rollValue());

    const targetValue = ref(currentValue.value);

    const isRolling = ref(false);
    const shakeKey = ref(0);
    const rollForce = ref(24);

    function normalizeRollForce(force) {
        const numericForce = Number(force);

        if (Number.isNaN(numericForce)) {
            return 24;
        }

        if (numericForce < 0) {
            return 0;
        }

        if (numericForce > 100) {
            return 100;
        }

        return numericForce;
    }

    function roll(force = 24) {
        if (isRolling.value) {
            return;
        }

        isRolling.value = true;
        targetValue.value = rollValue();
        rollForce.value = normalizeRollForce(force);
        shakeKey.value++;
    }

    function completeRoll() {
        currentValue.value = targetValue.value;
        isRolling.value = false;
    }

    // Quando o modo de jogo muda, re-rola automaticamente
    watch(
        () => config.value.mode,
        () => {
            if (!isRolling.value) {
                currentValue.value = rollValue();
                targetValue.value = currentValue.value;
            }
        }
    );

    watch(
        () => config.value.customCount,
        () => {
            if (!isRolling.value && config.value.mode === 'custom') {
                currentValue.value = rollValue();
                targetValue.value = currentValue.value;
            }
        }
    );

    return {
        currentValue,
        targetValue,
        isRolling,
        shakeKey,
        rollForce,
        roll,
        completeRoll,
    };
}
