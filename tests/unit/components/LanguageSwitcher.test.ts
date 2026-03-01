import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { mountQuasar } from '../helpers'
import LanguageSwitcher from 'src/app/components/LanguageSwitcher.vue'
import { __resetI18n } from '../../__mocks__/vue-i18n'
import { afterEach } from 'node:test'

// Keep a reference to the mock so tests can restore it
let mockLocalStorage: any

const createLocalStorageMock = () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
})

describe('LanguageSwitcher Component', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        __resetI18n()
        // Create fresh mock and assign to both the variable and window
        mockLocalStorage = createLocalStorageMock()
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage,
            configurable: true,
        })
    })

    afterEach(() => {
        // Ensure localStorage is always restored to a mock after each test
        if (mockLocalStorage) {
            Object.defineProperty(window, 'localStorage', {
                value: mockLocalStorage,
                configurable: true,
            })
        }
    })

    it('should be defined', () => {
        expect(LanguageSwitcher).toBeDefined()
    })

    it('should have correct component structure', () => {
        expect(typeof LanguageSwitcher).toBe('object')
    })

    it('should render button group', async () => {
        const wrapper = await mountQuasar(LanguageSwitcher as any)
        const group = wrapper.find('.q-btn-group')
        expect(group.exists()).toBe(true)
    })

    it('should render both language buttons', async () => {
        const wrapper = await mountQuasar(LanguageSwitcher as any)

        const buttons = wrapper.findAll('.q-btn')
        expect(buttons.length).toBe(2)
    })

    it('should display ru button', async () => {
        const wrapper = await mountQuasar(LanguageSwitcher as any)

        const ruBtn = wrapper.find('.q-btn')
        expect(ruBtn.text()).toContain('ru')
    })

    it('should display en button', async () => {
        const wrapper = await mountQuasar(LanguageSwitcher as any)

        const buttons = wrapper.findAll('.q-btn')
        expect(buttons[1]?.text()).toContain('en')
    })

    it('should have active-lang class on current language', async () => {
        const wrapper = await mountQuasar(LanguageSwitcher as any)
        const vm = wrapper.vm as any

        // Initial locale is 'en'
        expect(vm.i18n.locale.value).toBe('en')

        const buttons = wrapper.findAll('.q-btn')
        // First button (ru) should not have active-lang
        expect(buttons[0]?.classes()).not.toContain('active-lang')
        // Second button (en) should have active-lang
        expect(buttons[1]?.classes()).toContain('active-lang')
    })

    it('should change language when button clicked', async () => {
        const wrapper = await mountQuasar(LanguageSwitcher as any)
        const vm = wrapper.vm as any

        // Initial locale is 'en'
        expect(vm.i18n.locale.value).toBe('en')

        // Click the 'ru' button
        const buttons = wrapper.findAll('.q-btn')
        await buttons[0]?.trigger('click')
        await wrapper.vm.$nextTick()

        // Verify locale changed to 'ru'
        expect(vm.i18n.locale.value).toBe('ru')

        // Click the 'en' button
        await buttons[1]?.trigger('click')
        await wrapper.vm.$nextTick()

        // Verify locale changed back to 'en'
        expect(vm.i18n.locale.value).toBe('en')
    })

    it('should update locale when changing language', async () => {
        const wrapper = await mountQuasar(LanguageSwitcher as any)
        const vm = wrapper.vm as any

        // Mock localStorage
        const localStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
        }
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })

        // Change to Russian
        vm.changeLanguage('ru')
        expect(vm.i18n.locale.value).toBe('ru')
        expect(localStorageMock.setItem).toHaveBeenCalledWith('locale', 'ru')

        // Change back to English
        vm.changeLanguage('en')
        expect(vm.i18n.locale.value).toBe('en')
        expect(localStorageMock.setItem).toHaveBeenCalledWith('locale', 'en')
    })

    it('should have proper button styling', async () => {
        const wrapper = await mountQuasar(LanguageSwitcher as any)

        const buttons = wrapper.findAll('.q-btn')
        buttons.forEach((btn) => {
            // Note: 'flat' and 'dense' and 'rounded' become HTML attributes (not classes) in the stub
            // The stub template uses v-bind="$attrs" so these become attributes on the div
            expect(btn.attributes('flat')).toBeDefined()
            expect(btn.attributes('dense')).toBeDefined()
            expect(btn.attributes('rounded')).toBeDefined()
            expect(btn.classes()).toContain('q-px-md')
            expect(btn.classes()).toContain('q-py-sm')
        })
    })

    it('should have push prop on button group', async () => {
        const wrapper = await mountQuasar(LanguageSwitcher as any)

        const group = wrapper.find('.q-btn-group')
        // 'push' is a prop that becomes an attribute in the stub
        expect(group.attributes('push')).toBeDefined()
    })

    it('should have br-20 on button group', async () => {
        const wrapper = await mountQuasar(LanguageSwitcher as any)

        const group = wrapper.find('.q-btn-group')
        expect(group.classes()).toContain('br-20')
    })

    it('should apply active-lang styling when Russian is active', async () => {
        const wrapper = await mountQuasar(LanguageSwitcher as any)
        const vm = wrapper.vm as any

        // Change to Russian
        vm.changeLanguage('ru')
        await wrapper.vm.$nextTick()

        const buttons = wrapper.findAll('.q-btn')
        expect(buttons[0]?.classes()).toContain('active-lang') // ru button
        expect(buttons[1]?.classes()).not.toContain('active-lang') // en button
    })

    it('should apply active-lang styling when English is active', async () => {
        const wrapper = await mountQuasar(LanguageSwitcher as any)
        const vm = wrapper.vm as any

        // Already on English
        const buttons = wrapper.findAll('.q-btn')
        expect(buttons[1]?.classes()).toContain('active-lang')
    })

    it('should toggle between languages', async () => {
        const wrapper = await mountQuasar(LanguageSwitcher as any)
        const vm = wrapper.vm as any

        // Start on English
        expect(vm.i18n.locale.value).toBe('en')

        // Switch to Russian
        vm.changeLanguage('ru')
        expect(vm.i18n.locale.value).toBe('ru')

        // Switch back to English
        vm.changeLanguage('en')
        expect(vm.i18n.locale.value).toBe('en')
    })

    it('should persist language to localStorage', async () => {
        const wrapper = await mountQuasar(LanguageSwitcher as any)
        const vm = wrapper.vm as any

        const localStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
        }
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })

        vm.changeLanguage('ru')
        expect(localStorageMock.setItem).toHaveBeenCalledWith('locale', 'ru')

        vm.changeLanguage('en')
        expect(localStorageMock.setItem).toHaveBeenCalledWith('locale', 'en')
    })

    it('should not break when localStorage is unavailable', async () => {
        const wrapper = await mountQuasar(LanguageSwitcher as any)
        const vm = wrapper.vm as any

        // Temporarily set localStorage to null to simulate unavailability
        const originalDesc = Object.getOwnPropertyDescriptor(window, 'localStorage')
        Object.defineProperty(window, 'localStorage', { value: null, writable: true })

        // Should not throw even though localStorage is null
        expect(() => vm.changeLanguage('ru')).not.toThrow()
        expect(vm.i18n.locale.value).toBe('ru')

        // Restore localStorage to the mock for any remaining tests
        if (originalDesc) {
            Object.defineProperty(window, 'localStorage', originalDesc)
        } else {
            Object.defineProperty(window, 'localStorage', {
                value: mockLocalStorage,
                writable: true,
            })
        }
    })

    it('should have both language options available', async () => {
        const wrapper = await mountQuasar(LanguageSwitcher as any)

        const buttons = wrapper.findAll('.q-btn')
        const buttonTexts = buttons.map((btn) => btn.text().trim())

        expect(buttonTexts).toContain('ru')
        expect(buttonTexts).toContain('en')
    })

    it('should be a compact component with button group', async () => {
        const wrapper = await mountQuasar(LanguageSwitcher as any)

        expect(wrapper.find('.q-btn-group').exists()).toBe(true)
        expect(wrapper.find('.q-btn').exists()).toBe(true)
    })

    it('should initialize with English locale from mock', async () => {
        const wrapper = await mountQuasar(LanguageSwitcher as any)
        const vm = wrapper.vm as any

        expect(vm.i18n.locale.value).toBe('en')
    })
})
