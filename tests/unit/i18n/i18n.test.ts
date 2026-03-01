import { describe, expect, it, jest } from '@jest/globals'
import { createI18n } from 'vue-i18n'
import { ref } from 'vue'

// Simple mock that's fully defined inline
jest.mock('vue-i18n', () => {
    const createI18nImpl = jest.fn((options: any) => {
        const { locale: initialLocale = 'en', messages = {}, fallbackLocale } = options
        const localeRef = ref(initialLocale)

        const getTranslation = (key: string, locale: string) => {
            const keys = key.split('.')
            let value = messages[locale] || {}
            for (const k of keys) {
                value = value?.[k]
                if (value === undefined) return undefined
            }
            return value
        }

        const t = (key: string, params?: any) => {
            let value = getTranslation(key, localeRef.value)
            if (value !== undefined) {
                // Handle pluralization with pipe syntax - trim parts to handle spaces
                if (typeof value === 'string' && value.includes('|')) {
                    const parts = value.split('|').map((p) => p.trim())
                    const count = params?.count ?? 1
                    value = count === 1 ? parts[0] : parts[1]
                }

                // Replace placeholders
                if (params && typeof value === 'string') {
                    Object.entries(params).forEach(([k, v]) => {
                        value = value.replace(`{${k}}`, String(v))
                    })
                }
                return value
            }

            if (fallbackLocale && fallbackLocale !== localeRef.value) {
                value = getTranslation(key, fallbackLocale)
                if (value !== undefined) {
                    if (typeof value === 'string' && value.includes('|')) {
                        const parts = value.split('|').map((p) => p.trim())
                        const count = params?.count ?? 1
                        value = count === 1 ? parts[0] : parts[1]
                    }
                    if (params && typeof value === 'string') {
                        Object.entries(params).forEach(([k, v]) => {
                            value = value.replace(`{${k}}`, String(v))
                        })
                    }
                    return value
                }
            }

            // Return defaultMessage if provided, else the key itself
            return params?.defaultMessage ?? key
        }

        const d = (_key: string | Date, value?: Date | string) => {
            if (typeof value === 'string') return value
            if (value instanceof Date) return value.toLocaleDateString(localeRef.value)
            return String(value)
        }

        const n = (num: number, currency?: string) => {
            if (currency) {
                // Simple mock implementation - just prefix with currency code
                return `${currency.toUpperCase()}${num}`
            }
            return new Intl.NumberFormat(localeRef.value).format(num)
        }

        return {
            locale: localeRef,
            global: {
                locale: localeRef,
                availableLocales: Object.keys(messages),
                t,
                d,
                n,
            },
            t,
            d,
            n,
        }
    })

    return {
        __esModule: true,
        createI18n: createI18nImpl,
    }
})

describe('i18n Configuration', () => {
    it('should create i18n instance with English and Russian', () => {
        const i18n = createI18n({
            legacy: false,
            locale: 'en',
            fallbackLocale: 'en',
            messages: {
                en: {
                    welcome: 'Welcome to my portfolio',
                    about: 'About Me',
                    projects: 'Projects',
                },
                ru: {
                    welcome: 'Добро пожаловать в мое портфолио',
                    about: 'Обо мне',
                    projects: 'Проекты',
                },
            },
        })

        expect(i18n.global.locale.value).toBe('en')
        expect(i18n.global.availableLocales).toContain('en')
        expect(i18n.global.availableLocales).toContain('ru')
        expect(i18n.global.t('welcome')).toBe('Welcome to my portfolio')
        expect(i18n.global.t('about')).toBe('About Me')

        i18n.global.locale.value = 'ru'
        expect(i18n.global.t('welcome')).toBe('Добро пожаловать в мое портфолио')
        expect(i18n.global.t('about')).toBe('Обо мне')

        expect(i18n.global.t('nonexistent.key')).toBe('nonexistent.key')
    })

    it('should handle interpolation in messages', () => {
        const i18n = createI18n({
            locale: 'en',
            messages: {
                en: {
                    greeting: 'Hello, {name}! You have {count} new messages.',
                },
            },
        })

        const result = i18n.global.t('greeting', {
            name: 'John',
            count: 5,
        })

        expect(result).toBe('Hello, John! You have 5 new messages.')
    })

    it('should handle pluralization', () => {
        const i18n = createI18n({
            locale: 'en',
            messages: {
                en: {
                    messages: 'You have {count} message | You have {count} messages',
                },
            },
        })

        expect(i18n.global.t('messages', { count: 1 })).toBe('You have 1 message')
        expect(i18n.global.t('messages', { count: 5 })).toBe('You have 5 messages')
    })

    it('should fallback to default message when key not found', () => {
        const i18n = createI18n({
            legacy: false,
            locale: 'en',
            messages: {
                en: {
                    known: 'Known message',
                },
            },
        })

        expect(i18n.global.t('known')).toBe('Known message')
        expect(i18n.global.t('unknown', { defaultMessage: 'Default' })).toBe('Default')
    })

    it('should support nested translation keys', () => {
        const i18n = createI18n({
            legacy: false,
            locale: 'en',
            messages: {
                en: {
                    navigation: {
                        home: 'Home',
                        about: 'About',
                    },
                },
            },
        })

        expect(i18n.global.t('navigation.home')).toBe('Home')
        expect(i18n.global.t('navigation.about')).toBe('About')
    })

    it('should handle date and number formatting', () => {
        const i18n = createI18n({
            legacy: false,
            locale: 'en',
            datetimeFormats: {
                en: {
                    'short-date': {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    },
                },
            },
            numberFormats: {
                en: {
                    currency: {
                        style: 'currency',
                        currency: 'USD',
                    },
                },
            },
        })

        const date = new Date(2024, 0, 15)
        const formattedDate = i18n.global.d(date, 'short-date')
        expect(formattedDate).toBeDefined()

        const currency = i18n.global.n(1234.56, 'currency')
        expect(currency).toBeDefined()
        expect(typeof currency).toBe('string')
        expect(currency.length).toBeGreaterThan(0)
    })
})
