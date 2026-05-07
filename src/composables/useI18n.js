import { ref, computed } from 'vue';
import ptBR from '@/locales/pt-BR.json';
import enUS from '@/locales/en-US.json';

const STORAGE_KEY = 'dado-magico-language';
const SUPPORTED_LANGUAGES = {
    'pt-BR': ptBR,
    'en-US': enUS,
};
const DEFAULT_LANGUAGE = 'en-US';

/**
 * Detecta o idioma preferido do usuário
 * Tenta usar localStorage, depois navigator.language, depois padrão
 */
function detectLanguage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && SUPPORTED_LANGUAGES[stored]) {
            return stored;
        }
    } catch {
        // ignore localStorage errors
    }

    const browserLang = navigator.language || navigator.userLanguage || DEFAULT_LANGUAGE;
    const exactMatch = SUPPORTED_LANGUAGES[browserLang];
    if (exactMatch) return browserLang;

    const langPrefix = browserLang.split('-')[0];
    const languageWithPrefix = Object.keys(SUPPORTED_LANGUAGES).find((lang) => lang.startsWith(langPrefix));
    if (languageWithPrefix) return languageWithPrefix;

    return DEFAULT_LANGUAGE;
}

// Estado global compartilhado
const currentLanguage = ref(detectLanguage());

/**
 * Composable para internacionalização
 */
export function useI18n() {
    /**
     * Traduz uma chave usando notação de ponto (ex: 'gameView.configButton')
     */
    function t(key, fallback = key) {
        const messages = SUPPORTED_LANGUAGES[currentLanguage.value];
        const keys = key.split('.');

        let value = messages;
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return fallback;
            }
        }

        return typeof value === 'string' ? value : fallback;
    }

    /**
     * Muda o idioma atual e persiste em localStorage
     */
    function setLanguage(lang) {
        if (!SUPPORTED_LANGUAGES[lang]) {
            console.warn(`Language ${lang} is not supported. Keeping ${currentLanguage.value}`);
            return;
        }

        currentLanguage.value = lang;
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch {
            // ignore localStorage errors
        }
    }

    /**
     * Retorna lista de idiomas suportados
     */
    const supportedLanguages = computed(() =>
        Object.keys(SUPPORTED_LANGUAGES).map((code) => ({
            code,
            name: code === 'pt-BR' ? 'Português' : 'English',
        }))
    );

    return {
        t,
        setLanguage,
        currentLanguage: computed(() => currentLanguage.value),
        supportedLanguages,
    };
}
