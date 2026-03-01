import { ref } from 'vue'
import { jest } from '@jest/globals'

const piniaStores = new Map()
let activePinia: any = null

export const createPinia = () => {
    return {
        use: jest.fn((storeDefinition: any) => {
            const storeName =
                typeof storeDefinition === 'string'
                    ? storeDefinition
                    : storeDefinition.$id ||
                      storeDefinition.id ||
                      storeDefinition.name ||
                      'anonymous'

            if (!piniaStores.has(storeName)) {
                let store: any

                if (typeof storeDefinition === 'function') {
                    // Composition API: storeDefinition is the setup function
                    store = storeDefinition()
                } else if (storeDefinition.setup) {
                    store = storeDefinition.setup()
                } else {
                    // Options API
                    store = {
                        ...(storeDefinition.state ? storeDefinition.state() : {}),
                        ...(storeDefinition.getters ? storeDefinition.getters() : {}),
                    }
                }

                // Wrap all function properties with jest.fn for spying
                Object.keys(store).forEach((key) => {
                    if (typeof store[key] === 'function') {
                        const originalFn = store[key]
                        store[key] = jest.fn().mockImplementation(originalFn.bind(store))
                    }
                })

                piniaStores.set(storeName, store)
            }

            return piniaStores.get(storeName)
        }),
        install: jest.fn(),
    }
}

export const setActivePinia = (pinia: any) => {
    activePinia = pinia
}

export const defineStore = (id: string | symbol, optionsOrSetup: any) => {
    const storeDefinition = typeof optionsOrSetup === 'function' ? optionsOrSetup : optionsOrSetup
    storeDefinition.$id = id

    const useStore = () => {
        if (!activePinia) {
            activePinia = createPinia()
        }
        return activePinia.use(storeDefinition)
    }

    useStore.$id = id
    useStore.define = jest.fn()

    return useStore as any
}

export const storeToRefs = <T>(store: T) => {
    const refs: any = {}
    for (const key in store) {
        if (store[key] && typeof store[key] === 'object' && 'value' in store[key]) {
            refs[key] = store[key]
        } else {
            refs[key] = ref(store[key])
        }
    }
    return refs
}

export default {
    createPinia,
    setActivePinia,
    defineStore,
    storeToRefs,
}
