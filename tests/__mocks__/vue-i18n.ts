import { ref } from 'vue'

// Shared reactive locale that tests can control
const locale = ref('en')
const messages: Record<string, any> = {}
const fallbackLocale = 'en'

// Reset function for tests
export const __resetI18n = () => {
    locale.value = 'en'
}

// The useI18n function that Vue components call
// It should return an object with t, locale, and global properties
export const useI18n = () => {
    const i18n = {
        locale,
        // Destructured t function (for Composition API)
        t: (key: string, params?: any) => {
            const keys = key.split('.')
            let value = messages[locale.value] || {}
            for (const k of keys) {
                value = value?.[k]
                if (value === undefined) {
                    // Try fallback locale
                    const fallbackValue = messages[fallbackLocale] || {}
                    for (const fk of keys) {
                        value = fallbackValue?.[fk]
                        if (value === undefined) {
                            return typeof params === 'object' && params.defaultMessage
                                ? params.defaultMessage
                                : key
                        }
                    }
                }
            }

            if (typeof value === 'string' && params) {
                // Handle interpolation
                Object.entries(params).forEach(([paramKey, paramValue]) => {
                    value = value.replace(`{${paramKey}}`, String(paramValue))
                })
            }
            return value || key
        },
        global: {
            locale,
            fallbackLocale,
            availableLocales: Object.keys(messages),
            messages,
            getLocale: () => locale.value,
            setLocale: (newLocale: string) => {
                locale.value = newLocale
            },
            // Also provide t on global for legacy compatibility
            t: (key: string, params?: any) => i18n.t(key, params),
        },
    }
    return i18n
}

// Default export that matches vue-i18n's API
export default {
    useI18n,
    // Optional: createI18n for advanced setups
    createI18n: (options: any = {}) => {
        const localeOption = ref(options.locale || 'en')
        return {
            global: {
                locale: localeOption,
                fallbackLocale: options.fallbackLocale || 'en',
                availableLocales: Object.keys(options.messages || {}),
                messages: options.messages || {},
            },
        }
    },
}
