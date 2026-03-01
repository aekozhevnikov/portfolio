module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        url: 'http://localhost/',
        html: '<!DOCTYPE html><html><body><div id="app"></div></body></html>',
    },
    roots: ['<rootDir>/tests'],
    testMatch: ['**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.test.json',
            },
        ],
        '^.+\\.vue$': ['@vue/vue3-jest', {}],
    },
    collectCoverageFrom: ['src/**/*.ts', 'src/**/*.vue', '!src/**/*.d.ts', '!src/**/index.ts'],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    testTimeout: 10000,
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^src/(.*)$': '<rootDir>/src/$1',
        '^__mocks__/(.*)$': '<rootDir>/tests/__mocks__/$1',
        // Use CommonJS build of Vue Test Utils for Vue 3 compatibility
        '^@vue/test-utils$': '<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js',
    },
    automock: false,
    // Additional configuration for Vue SFCs
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'vue', 'json', 'node'],
}
