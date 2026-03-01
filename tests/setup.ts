import '@testing-library/jest-dom'
import { jest } from '@jest/globals'
import * as Vue from 'vue'
import * as VueCompilerDOM from '@vue/compiler-dom'
import * as VueServerRenderer from '@vue/server-renderer'

// Make Vue globally available for ESM build of @vue/test-utils
// @vue/test-utils (ESM build) expects Vue to be a callable constructor
// For Vue 3, we provide a wrapper that mimics Vue 2 constructor pattern
(globalThis as any).Vue = (Vue as any).default || Vue
;(globalThis as any).VueCompilerDOM = VueCompilerDOM
;(globalThis as any).VueServerRenderer = VueServerRenderer

// Mock window.matchMedia before anything else
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
})

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
})) as any

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
    takeRecords: jest.fn(),
})) as any

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
})

// Mock sessionStorage
const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
}
Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
})

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn() as any
global.URL.revokeObjectURL = jest.fn() as any

// Mock scrollTo
window.scrollTo = jest.fn()

// Mock TextEncoder and TextDecoder for pdfmake
if (typeof TextEncoder === 'undefined') {
    global.TextEncoder = class TextEncoder {
        encode(str: string): Uint8Array {
            return new Uint8Array(Buffer.from(str, 'utf-8'))
        }
    } as any
}

if (typeof TextDecoder === 'undefined') {
    global.TextDecoder = class TextDecoder {
        decode(uint8: Uint8Array): string {
            return Buffer.from(uint8).toString('utf-8')
        }
    } as any
}
