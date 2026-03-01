import { type Component, nextTick, ref } from 'vue'
import { flushPromises, mount, VueWrapper } from '@vue/test-utils'

import { jest } from '@jest/globals'

// Mock the 'quasar' module to provide a customizable instance via useQuasar()
// This ensures that components using useQuasar() receive the mock we provide
jest.mock('quasar', () => ({
  useQuasar: jest.fn(() => (globalThis as any).__QUASAR_MOCK_INSTANCE__),
  Notify: {
    create: jest.fn(),
  },
}))

/**
 * Mount a Quasar component with all required Quasar plugins and mocks
 */
export async function mountQuasar(
    component: Component,
    options: {
        props?: Record<string, any>
        slots?: Record<string, any>
        data?: Record<string, any>
        quasar?: Record<string, any>
        i18n?: { locale?: string; messages?: Record<string, any> }
        pinia?: Record<string, any>
        router?: any
        attachTo?: HTMLElement | string | Element
        global?: Record<string, any>
        provide?: Record<string, any>
    } = {},
): Promise<VueWrapper<any>> {
    const {
        props = {},
        slots = {},
        data: dataOverrides = {},
        quasar: customQuasar,
        i18n: i18nOptions,
        pinia: piniaStores,
        router: customRouter,
        attachTo,
        provide: provideOptions = {},
        global: globalOptions = {},
    } = options

    // Remove provide from globalOptions if present to avoid duplication
    if (globalOptions.provide) {
        const globalProvide = globalOptions.provide as Record<string, any>
        // Merge global.provide into provideOptions, with top-level provide taking precedence
        Object.assign(provideOptions, globalProvide)
        delete globalOptions.provide
    }

    // Create Quasar mock - useQuasar() should return an object with $q properties directly
    const quasarMock = {
        dark: {
            isActive: false,
            set: jest.fn(),
            toggle: jest.fn(),
        },
        setDark: jest.fn(),
        toggleDark: jest.fn(),
        notify: jest.fn(),
        Notify: {
            create: jest.fn(),
        },
        dialog: {
            show: jest.fn(),
            confirm: jest.fn(),
            prompt: jest.fn(),
        },
        loading: {
            show: jest.fn(),
            hide: jest.fn(),
        },
        platform: {
            is: {
                nativeMobile: false,
                mobile: false,
                desktop: false,
                ios: false,
                android: false,
                mac: false,
                windows: false,
                linux: false,
            },
            cordova: false,
            capacitor: false,
            electron: false,
            hasTouch: false,
        },
        cookie: {
            get: jest.fn(),
            set: jest.fn(),
            remove: jest.fn(),
        },
        localStorage: {
            get: jest.fn(),
            set: jest.fn(),
            remove: jest.fn(),
        },
        screen: {
            width: 1920,
            height: 1080,
            xs: false,
            sm: false,
            md: false,
            lg: false,
            xl: false,
        },
        meta: {
            addTag: jest.fn(),
            removeTag: jest.fn(),
            getTag: jest.fn(),
            getTags: jest.fn(),
            swapTag: jest.fn(),
            set: jest.fn(),
        },
        fabric: {
            addStyles: jest.fn(),
        },
    } as Record<string, any>

    // Merge custom Quasar mock if provided
    if (customQuasar) {
        const { dark: customDark, ...otherCustom } = customQuasar
        if (customDark) {
            // Directly assign the custom dark object to preserve reference identity
            // This ensures that mutations (like toggle) affect the same object the component uses
            quasarMock.dark = customDark
        }
        Object.assign(quasarMock, otherCustom)
    }

    // Create i18n mock that matches vue-i18n's useI18n() return shape
    const locale = i18nOptions?.locale || 'en'
    const messages = i18nOptions?.messages || {}
    const availableLocales = Object.keys(messages)

    // Use ref to make it reactive - useI18n() returns { locale: Ref<string>, ... }
    const localeRef = ref(locale)

    const i18nMock = {
        locale: localeRef,
        // Destructured t function (for Composition API)
        t: jest.fn((key: string, params?: Record<string, any>) => {
            const keys = key.split('.')
            let value = messages[localeRef.value] || {}
            for (const k of keys) {
                value = value?.[k]
                if (value === undefined) {
                    return key
                }
            }
            if (params && typeof value === 'string') {
                Object.entries(params).forEach(([paramKey, paramValue]) => {
                    value = value.replace(`{${paramKey}}`, String(paramValue))
                })
            }
            return value || key
        }),
        d: jest.fn((_key: string | Date, value?: Date | string) => {
            return typeof value === 'string' ? value : String(value)
        }),
        n: jest.fn((value: number, currency?: string) => {
            if (currency) {
                return `${currency}${value}`
            }
            return String(value)
        }),
        // Also provide global for compatibility with some patterns
        global: {
            locale: localeRef,
            getLocale: jest.fn(() => localeRef.value),
            setLocale: jest.fn((newLocale: string) => {
                localeRef.value = newLocale
            }),
            fallbackLocale: 'en',
            availableLocales,
            messages,
            t: jest.fn((key: string, params?: Record<string, any>) => {
                const keys = key.split('.')
                let value = messages[localeRef.value] || {}
                for (const k of keys) {
                    value = value?.[k]
                    if (value === undefined) {
                        return key
                    }
                }
                if (params && typeof value === 'string') {
                    Object.entries(params).forEach(([paramKey, paramValue]) => {
                        value = value.replace(`{${paramKey}}`, String(paramValue))
                    })
                }
                return value || key
            }),
        } as Record<string, any>,
    } as Record<string, any>

    // Create Pinia mock
    const piniaMock = {
        use: jest.fn((storeName: string): any => {
            if (piniaStores && piniaStores[storeName]) {
                return piniaStores[storeName]
            }
            return {}
        }),
        install: jest.fn(),
    }

    // Create router mock
    const routerMock = {
        push: jest.fn(),
        replace: jest.fn(),
        go: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        currentRoute: {
            value: {
                ...customRouter,
                params: {},
                query: {},
                hash: '',
                fullPath: '',
                meta: {},
            },
        },
        router: {
            beforeEnter: jest.fn(),
            beforeRouteEnter: jest.fn(),
            beforeRouteUpdate: jest.fn(),
            beforeRouteLeave: jest.fn(),
        },
        addRoute: jest.fn(),
        removeRoute: jest.fn(),
        getRoutes: jest.fn(() => []),
        hasRoute: jest.fn(),
        resolve: jest.fn(),
        install: jest.fn(),
    }

    // Build mount options
    const mountOptions: any = {
        global: {
            plugins: [
                {
                    install: (app: any) => {
                        // Provide Quasar instance for useQuasar() injection using the correct key
                        app.provide('_q_', quasarMock)
                        // Also set globalProperties for options API usage
                        app.config.globalProperties.$q = quasarMock
                        app.config.globalProperties.$router = routerMock
                        app.config.globalProperties.$i18n = i18nMock
                        // Provide custom values (like supabase)
                        Object.entries(provideOptions).forEach(([key, value]) => {
                            app.provide(key, value)
                        })
                    },
                },
                piniaMock,
            ],
            stubs: {
                // Container components (with slots) - render slots to make content visible
                'q-dialog': { template: '<div class="q-dialog"><slot /></div>' },
                'q-card': { template: '<div class="q-card"><slot /></div>' },
                'q-card-section': { template: '<div class="q-card-section"><slot /></div>' },
                'q-card-actions': { template: '<div class="q-card-actions"><slot /></div>' },
                'q-carousel': { template: '<div class="q-carousel"><slot /></div>' },
                'q-carousel-slide': { template: '<div class="q-carousel-slide"><slot /></div>' },
                'q-list': { template: '<div class="q-list"><slot /></div>' },
                'q-item': { template: '<div class="q-item"><slot /></div>' },
                'q-item-section': { template: '<div class="q-item-section"><slot /></div>' },
                'q-item-label': { template: '<div class="q-item-label"><slot /></div>' },
                'q-badge': { template: '<span class="q-badge"><slot /></span>' },
                'q-toolbar': { template: '<div class="q-toolbar"><slot /></div>' },
                'q-toolbar-title': { template: '<div class="q-toolbar-title"><slot /></div>' },
                'q-form': { template: '<div class="q-form"><slot /></div>' },
                'q-tooltip': { template: '<div class="q-tooltip"><slot /></div>' },
                'q-header': { template: '<header class="q-header"><slot /></header>' },
                'q-drawer': { template: '<aside class="q-drawer"><slot /></aside>' },
                'q-footer': { template: '<footer class="q-footer"><slot /></footer>' },
                'q-tabs': { template: '<div class="q-tabs"><slot /></div>' },
                'q-tab': { template: '<div class="q-tab"><slot /></div>' },
                'q-btn-dropdown': { template: '<div class="q-btn-dropdown"><slot /></div>' },
                'q-btn-group': {
                    template: '<div class="q-btn-group" v-bind="$attrs"><slot /></div>',
                    inheritAttrs: true,
                },
                'q-avatar': {
                    template: '<div class="q-avatar" v-bind="attrs"><slot /></div>',
                    props: {
                        size: String,
                    },
                    computed: {
                        attrs(): any {
                            const self = this as any;
                            const result: any = { ...self.$attrs };
                            if (self.size) result['data-size'] = self.size;
                            return result;
                        }
                    }
                },
                'q-inner-loading': { template: '<div class="q-inner-loading"><slot /></div>' },
                'q-space': { template: '<div class="q-space"><slot /></div>' },

                // Project component stubs
                'ProjectHolder': {
                    template: '<div class="project-holder-stub"><slot /></div>',
                    name: 'ProjectHolder',
                },

                // Self-closing components - render as button with label prop and slot content
                'q-btn': {
                    template: '<div class="q-btn" v-bind="allAttrs"><slot />{{ label }}</div>',
                    props: {
                        label: String,
                        icon: String,
                        href: String,
                        target: String,
                        rel: String,
                        size: String,
                        flat: Boolean,
                        round: Boolean,
                        dense: Boolean,
                    },
                    computed: {
                        allAttrs(): any {
                            const self = this as any;
                            const result: any = { ...self.$attrs };
                            // Process class: convert array/object to string for HTML attribute
                            if (result.class !== undefined) {
                                if (Array.isArray(result.class)) {
                                    result.class = result.class.filter(Boolean).join(' ');
                                } else if (typeof result.class === 'object' && result.class !== null) {
                                    const classes: string[] = [];
                                    Object.entries(result.class).forEach(([key, value]) => {
                                        if (value) classes.push(key);
                                    });
                                    result.class = classes.join(' ');
                                }
                            }
                            // String props
                            if (self.icon) result.icon = self.icon;
                            if (self.href) result.href = self.href;
                            if (self.target) result.target = self.target;
                            if (self.rel) result.rel = self.rel;
                            if (self.size) result.size = self.size;
                            // Boolean props: only add when true
                            if (self.flat) result.flat = true;
                            if (self.round) result.round = true;
                            if (self.dense) result.dense = true;
                            return result;
                        }
                    }
                },
                'q-icon': {
                    template: '<i class="q-icon" v-bind="attrs"><slot /></i>',
                    props: {
                        name: String,
                    },
                    computed: {
                        attrs(): any {
                            const self = this as any;
                            const result: any = { ...self.$attrs };
                            if (self.name) result['data-name'] = self.name;
                            return result;
                        }
                    }
                },
                'q-img': true,
                'q-linear-progress': true,
                'q-separator': true,
                'q-input': {
                    template: '<div class="q-input"><slot /></div>',
                    inheritAttrs: true,
                },
                'q-select': {
                    template: '<div class="q-select"><slot /></div>',
                    inheritAttrs: true,
                },
            },
            directives: {
                // Stub for v-close-popup directive
                'close-popup': {
                    mounted() {},
                    updated() {},
                    unmounted() {},
                },
            },
            ...globalOptions,
        },
    }

    // Add provide at top level if specified (for frameworks that support it)
    if (Object.keys(provideOptions).length > 0) {
        mountOptions.provide = provideOptions
    }

    // Only add these properties if they have values to satisfy exactOptionalPropertyTypes
    if (Object.keys(props).length > 0) {
        mountOptions.props = props
    }
    if (Object.keys(slots).length > 0) {
        mountOptions.slots = slots
    }
    if (Object.keys(dataOverrides).length > 0) {
        mountOptions.data = () => dataOverrides
    }
    if (attachTo !== undefined) {
        mountOptions.attachTo = attachTo
    }

    // Set the global Quasar mock instance for the mocked useQuasar() to return
    globalThis.__QUASAR_MOCK_INSTANCE__ = quasarMock

    // Create wrapper with all mocks
    const wrapper = mount(component, mountOptions)

    // Wait for next tick to ensure all async operations complete
    await nextTick()
    await flushPromises()

    // Clear the global instance after mounting to avoid test contamination
    delete (globalThis as any).__QUASAR_MOCK_INSTANCE__

    return wrapper
}
