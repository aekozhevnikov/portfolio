import { jest } from '@jest/globals'

const $q = {
    dark: false,
    setDark: jest.fn(),
    toggleDark: jest.fn(),

    notify: jest.fn(),

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
}

const useQuasar = jest.fn(() => $q)

export { useQuasar, $q }

export default {
    useQuasar,
    Notify: {
        create: jest.fn(),
    },
    Dialog: {
        create: jest.fn(),
    },
    $q,
}
