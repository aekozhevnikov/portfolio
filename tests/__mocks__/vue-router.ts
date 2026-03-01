import { jest } from '@jest/globals'

const createRouterMock = (initialRoute = {}) => ({
    push: jest.fn(),
    replace: jest.fn(),
    go: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    currentRoute: {
        value: {
            ...initialRoute,
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
})

export default createRouterMock
