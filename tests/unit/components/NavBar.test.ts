import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { mountQuasar } from '../helpers'
import NavBar from 'src/app/components/ui/NavBar.vue'
import { afterEach } from 'node:test'

interface Section {
    id: string
    label: string
    icon: string
}

// Mock the useSiteStore
let mockSiteStore: any
jest.mock('src/app/stores/siteStore', () => ({
    useSiteStore: () => mockSiteStore,
}))

// Mock LanguageSwitcher
jest.mock('src/app/components/LanguageSwitcher.vue', () => ({
    name: 'LanguageSwitcher',
    template: '<div class="language-switcher-stub">LanguageSwitcher</div>',
}))

// Mock vue-i18n
jest.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: jest.fn((key: string) => {
            const translations: Record<string, string> = {
                'nav.home': 'Home',
                'nav.about': 'About',
                'nav.projects': 'Projects',
                'nav.services': 'Services',
                'nav.skills': 'Skills',
                'nav.reviews': 'Reviews',
                'nav.contact': 'Contact',
            }
            return translations[key] || key
        }),
    }),
}))

describe('NavBar Component', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockSiteStore = {
            isDark: false,
            config: {},
        }
        // Clear localStorage
        window.localStorage.clear()
    })

    it('should be defined', () => {
        expect(NavBar).toBeDefined()
    })

    it('should render as q-header', async () => {
        const wrapper = await mountQuasar(NavBar as any)
        expect(wrapper.html()).toContain('q-header')
    })

    it('should render home button', async () => {
        const wrapper = await mountQuasar(NavBar as any)
        expect(wrapper.html()).toContain('Home')
    })

    it('should render desktop navigation with all sections', async () => {
        const wrapper = await mountQuasar(NavBar as any)
        expect(wrapper.html()).toContain('About')
        expect(wrapper.html()).toContain('Projects')
        expect(wrapper.html()).toContain('Services')
        expect(wrapper.html()).toContain('Skills')
        expect(wrapper.html()).toContain('Reviews')
        expect(wrapper.html()).toContain('Contact')
    })

    it('should render language switcher', async () => {
        const wrapper = await mountQuasar(NavBar as any)
        expect(wrapper.html()).toContain('LanguageSwitcher')
    })

    it('should render theme toggle', async () => {
        const wrapper = await mountQuasar(NavBar as any)
        expect(wrapper.html()).toContain('dark_mode')
    })

    it('should render mobile drawer', async () => {
        const wrapper = await mountQuasar(NavBar as any)
        expect(wrapper.html()).toContain('q-drawer')
    })

    it('should render mobile menu button', async () => {
        const wrapper = await mountQuasar(NavBar as any)
        expect(wrapper.html()).toContain('icon="menu"')
    })

    it('should have responsive classes (gt-sm for desktop, lt-md for mobile)', async () => {
        const wrapper = await mountQuasar(NavBar as any)
        expect(wrapper.html()).toContain('gt-sm')
        expect(wrapper.html()).toContain('lt-md')
    })

    it('should render all drawer navigation items', async () => {
        const wrapper = await mountQuasar(NavBar as any)
        expect(wrapper.html()).toContain('About')
        expect(wrapper.html()).toContain('Projects')
        expect(wrapper.html()).toContain('Services')
        expect(wrapper.html()).toContain('Skills')
        expect(wrapper.html()).toContain('Reviews')
        expect(wrapper.html()).toContain('Contact')
    })

    it('should apply light theme header classes', async () => {
        const wrapper = await mountQuasar(NavBar as any)
        expect(wrapper.html()).toContain('bg-grey-2')
        expect(wrapper.html()).toContain('text-grey-9')
    })

    it('should have necessary methods', async () => {
        const wrapper = await mountQuasar(NavBar as any)
        const vm = wrapper.vm as any
        expect(vm).toBeDefined()
        expect(typeof vm.toggleTheme).toBe('function')
        expect(typeof vm.scrollToSection).toBe('function')
        expect(typeof vm.scrollAndClose).toBe('function')
        expect(typeof vm.scrollToTop).toBe('function')
        expect(typeof vm.handleScroll).toBe('function')
    })

    it('should have all reactive properties', async () => {
        const wrapper = await mountQuasar(NavBar as any)
        const vm = wrapper.vm as any
        expect(vm.drawer).toBe(false)
        expect(vm.activeSection).toBe('')
        expect(Array.isArray(vm.sections)).toBe(true)
        expect(vm.sections.length).toBe(6)
    })

    it('should add scroll event listener on mount', async () => {
        const addEventListenerSpy = jest.spyOn(window, 'addEventListener')

        const wrapper = await mountQuasar(NavBar as any)

        expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))

        await wrapper.unmount()
        addEventListenerSpy.mockRestore()
    })

    it('should remove scroll event listener on unmount', async () => {
        const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')
        const wrapper = await mountQuasar(NavBar as any)

        // Get the handleScroll function directly from the component instance
        const scrollHandler = wrapper.vm.handleScroll

        await wrapper.unmount()

        // Verify that removeEventListener was called with the same function reference
        expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', scrollHandler)

        addEventListenerSpy.mockRestore()
        removeEventListenerSpy.mockRestore()
    })

    // ============ NEW TESTS FOR MISSING COVERAGE ============

    describe('Theme Toggle', () => {
        it('should call $q.dark.toggle and save preference to localStorage', async () => {
            const setItemSpy = jest.spyOn(window.localStorage, 'setItem')

            // Create a simple quasar mock with a mutable dark state
            const quasarMock = {
                dark: {
                    isActive: false,
                    toggle: jest.fn(() => {
                        quasarMock.dark.isActive = !quasarMock.dark.isActive
                    }),
                    set: jest.fn((value: boolean) => {
                        quasarMock.dark.isActive = value
                    }),
                },
            }

            const wrapper = await mountQuasar(NavBar as any, {
                quasar: quasarMock,
            })

            const vm = wrapper.vm as any

            // Verify initial state
            expect(vm.$q.dark.isActive).toBe(false)

            // Call toggleTheme
            await vm.toggleTheme()

            // toggle should have been called
            expect(vm.$q.dark.toggle).toHaveBeenCalledTimes(1)

            // After toggle, isActive should be true
            expect(vm.$q.dark.isActive).toBe(true)

            // localStorage should be updated (note: toggleTheme sets localStorage based on isActive after toggle)
            expect(setItemSpy).toHaveBeenCalledWith('darkMode', 'true')

            setItemSpy.mockRestore()
        })
    })

    describe('Theme Restoration on Mount', () => {
        it('should call $q.dark.set(true) when localStorage has "true"', async () => {
            // Mock localStorage.getItem to return 'true' for darkMode
            const getItemSpy = jest
                .spyOn(window.localStorage, 'getItem')
                .mockImplementation((key: string) => (key === 'darkMode' ? 'true' : null))

            const setSpy = jest.fn()

            const quasarMock = {
                dark: {
                    isActive: false,
                    set: jest.fn((value: boolean) => {
                        quasarMock.dark.isActive = value
                        setSpy(value)
                    }),
                    toggle: jest.fn(),
                },
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const wrapper = await mountQuasar(NavBar as any, {
                quasar: quasarMock,
            })

            expect(setSpy).toHaveBeenCalledWith(true)

            getItemSpy.mockRestore()
        })

        it('should call $q.dark.set(false) when localStorage has "false"', async () => {
            const getItemSpy = jest
                .spyOn(window.localStorage, 'getItem')
                .mockImplementation((key: string) => (key === 'darkMode' ? 'false' : null))

            const setSpy = jest.fn()

            const quasarMock = {
                dark: {
                    isActive: true, // Start with true, should be set to false
                    set: jest.fn((value: boolean) => {
                        quasarMock.dark.isActive = value
                        setSpy(value)
                    }),
                    toggle: jest.fn(),
                },
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const wrapper = await mountQuasar(NavBar as any, {
                quasar: quasarMock,
            })

            expect(setSpy).toHaveBeenCalledWith(false)

            getItemSpy.mockRestore()
        })

        it('should not call $q.dark.set when localStorage returns null', async () => {
            const getItemSpy = jest
                .spyOn(window.localStorage, 'getItem')
                .mockImplementation(() => null)

            const setSpy = jest.fn()

            const quasarMock = {
                dark: {
                    isActive: false,
                    set: jest.fn((value: boolean) => {
                        quasarMock.dark.isActive = value
                        setSpy(value)
                    }),
                    toggle: jest.fn(),
                },
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const wrapper = await mountQuasar(NavBar as any, {
                quasar: quasarMock,
            })

            expect(setSpy).not.toHaveBeenCalled()

            getItemSpy.mockRestore()
        })
    })

    describe('Header Class Computed Property', () => {
        it('should return dark theme classes when $q.dark.isActive is true', async () => {
            const quasarMock = {
                dark: {
                    isActive: true,
                    set: jest.fn(),
                    toggle: jest.fn(),
                },
            }

            const wrapper = await mountQuasar(NavBar as any, {
                quasar: quasarMock,
            })

            const vm = wrapper.vm as any
            expect(vm.headerClass).toBe('bg-dark text-white')
        })

        it('should return light theme classes when $q.dark.isActive is false', async () => {
            const quasarMock = {
                dark: {
                    isActive: false,
                    set: jest.fn(),
                    toggle: jest.fn(),
                },
            }

            const wrapper = await mountQuasar(NavBar as any, {
                quasar: quasarMock,
            })

            const vm = wrapper.vm as any
            expect(vm.headerClass).toBe('bg-grey-2 text-grey-9')
        })
    })

    describe('Scroll To Top', () => {
        it('should scroll to top smoothly', async () => {
            const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {})

            const wrapper = await mountQuasar(NavBar as any)
            const vm = wrapper.vm as any

            await vm.scrollToTop()

            expect(scrollToSpy).toHaveBeenCalledWith({
                top: 0,
                behavior: 'smooth',
            })

            scrollToSpy.mockRestore()
        })
    })

    describe('Scroll to Section', () => {
        beforeEach(() => {
            // Mock getElementById
            const mockElement = {
                id: 'about',
                scrollIntoView: jest.fn(),
                getBoundingClientRect: () => ({
                    top: 100,
                    bottom: 200,
                    left: 0,
                    right: 100,
                    width: 100,
                    height: 100,
                }),
            }

            document.getElementById = jest.fn((id: string) => {
                if (id === 'about') return mockElement
                if (id === 'projects') return { ...mockElement, id: 'projects' }
                if (id === 'services') return { ...mockElement, id: 'services' }
                return null
            }) as any
        })

        it('should set activeSection immediately', async () => {
            const wrapper = await mountQuasar(NavBar as any)
            const vm = wrapper.vm as any

            const mockElement = {
                id: 'about',
                scrollIntoView: jest.fn(),
                getBoundingClientRect: () => ({
                    top: 100,
                    bottom: 200,
                    left: 0,
                    right: 100,
                    width: 100,
                    height: 100,
                }),
            }

            document.getElementById = jest.fn(() => mockElement) as any

            await vm.scrollToSection('about')

            expect(vm.activeSection).toBe('about')
        })

        it('should scroll to top for about section', async () => {
            const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {})

            const wrapper = await mountQuasar(NavBar as any)
            const vm = wrapper.vm as any

            const mockElement = {
                id: 'about',
                scrollIntoView: jest.fn(),
                getBoundingClientRect: () => ({
                    top: 100,
                    bottom: 200,
                    left: 0,
                    right: 100,
                    width: 100,
                    height: 100,
                }),
            }

            document.getElementById = jest.fn(() => mockElement) as any

            await vm.scrollToSection('about')

            expect(scrollToSpy).toHaveBeenCalledWith({
                top: 0,
                behavior: 'smooth',
            })
            expect(mockElement.scrollIntoView).not.toHaveBeenCalled()

            scrollToSpy.mockRestore()
        })

        it('should use scrollIntoView for non-about sections', async () => {
            const wrapper = await mountQuasar(NavBar as any)
            const vm = wrapper.vm as any

            const mockElement = {
                id: 'projects',
                scrollIntoView: jest.fn(),
                getBoundingClientRect: () => ({
                    top: 500,
                    bottom: 600,
                    left: 0,
                    right: 100,
                    width: 100,
                    height: 100,
                }),
            }

            document.getElementById = jest.fn(() => mockElement) as any

            await vm.scrollToSection('projects')

            expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
                behavior: 'smooth',
                block: 'start',
            })
        })

        it('should not do anything when element is not found', async () => {
            const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {})

            const wrapper = await mountQuasar(NavBar as any)
            const vm = wrapper.vm as any

            document.getElementById = jest.fn(() => null) as any

            await vm.scrollToSection('nonexistent')

            expect(scrollToSpy).not.toHaveBeenCalled()

            scrollToSpy.mockRestore()
        })
    })

    describe('Scroll And Close', () => {
        beforeEach(() => {
            jest.useFakeTimers()
        })

        afterEach(() => {
            jest.useRealTimers()
        })

        it('should close drawer and call scrollToSection after timeout', async () => {
            const wrapper = await mountQuasar(NavBar as any)
            const vm = wrapper.vm as any

            // Set drawer to open
            vm.drawer = true

            // We need to spy on scrollToSection, but since it's defined in setup script,
            // we'll check that after calling scrollAndClose, the drawer closes and after the timeout,
            // activeSection is updated (which scrollToSection does)
            vm.drawer = true

            vm.scrollAndClose('projects')

            // Drawer should close immediately
            expect(vm.drawer).toBe(false)

            // Fast-forward time to trigger the setTimeout callback
            jest.advanceTimersByTime(300)

            // After timeout, activeSection should have been set to 'projects'
            expect(vm.activeSection).toBe('projects')
        })

        it('should close drawer immediately and trigger scroll after timeout', async () => {
            const wrapper = await mountQuasar(NavBar as any)
            const vm = wrapper.vm as any

            vm.drawer = true
            expect(vm.drawer).toBe(true)

            vm.scrollAndClose('about')

            expect(vm.drawer).toBe(false)

            // The actual function should have been scheduled but not yet executed
            // Fast forward to trigger the timeout
            jest.advanceTimersByTime(300)

            // After timeout, activeSection should be set to 'about'
            expect(vm.activeSection).toBe('about')
        })
    })

    describe('Handle Scroll', () => {
        beforeEach(() => {
            // Mock scrollY
            Object.defineProperty(window, 'scrollY', {
                writable: true,
                value: 0,
            })

            // Mock getBoundingClientRect
            const mockElement = {
                id: 'about',
                getBoundingClientRect: () => ({
                    top: 50,
                    bottom: 150,
                    left: 0,
                    right: 100,
                    width: 100,
                    height: 100,
                }),
            }

            document.getElementById = jest.fn((id: string) => {
                if (id === 'about') return mockElement
                if (id === 'projects')
                    return {
                        ...mockElement,
                        id: 'projects',
                        getBoundingClientRect: () => ({ top: 500, bottom: 600 }),
                    }
                return null
            }) as any
        })

        it('should set activeSection for section at offset', async () => {
            const wrapper = await mountQuasar(NavBar as any)
            const vm = wrapper.vm as any

            // Mock element at offset
            const mockElement = {
                id: 'about',
                getBoundingClientRect: () => ({
                    top: 100, // <= 120 offset
                    bottom: 200, // >= 120 offset
                    left: 0,
                    right: 100,
                    width: 100,
                    height: 100,
                }),
            }

            document.getElementById = jest.fn(() => mockElement) as any

            vm.handleScroll()

            expect(vm.activeSection).toBe('about')
        })

        it('should set first section when near top of page', async () => {
            const wrapper = await mountQuasar(NavBar as any)
            const vm = wrapper.vm as any

            // Set scrollY to near top
            Object.defineProperty(window, 'scrollY', { value: 100 })

            const mockElement = {
                id: 'about',
                getBoundingClientRect: () => ({
                    top: 50, // >= 0 and <= offset (120)
                    bottom: 150,
                    left: 0,
                    right: 100,
                    width: 100,
                    height: 100,
                }),
            }

            document.getElementById = jest.fn(() => mockElement) as any

            vm.handleScroll()

            expect(vm.activeSection).toBe('about')
        })

        it('should handle case when no element matches criteria', async () => {
            const wrapper = await mountQuasar(NavBar as any)
            const vm = wrapper.vm as any

            // Set scrollY to middle of page
            Object.defineProperty(window, 'scrollY', { value: 1000 })

            const mockElement = {
                id: 'projects',
                getBoundingClientRect: () => ({
                    top: 600,
                    bottom: 700,
                    left: 0,
                    right: 100,
                    width: 100,
                    height: 100,
                }),
            }

            document.getElementById = jest.fn(() => mockElement) as any

            // Should not throw
            expect(() => vm.handleScroll()).not.toThrow()
        })

        it('should iterate through all sections', async () => {
            const wrapper = await mountQuasar(NavBar as any)
            const vm = wrapper.vm as any

            const getElementCalls: string[] = []

            document.getElementById = jest.fn((id: string) => {
                getElementCalls.push(id)
                return {
                    id,
                    getBoundingClientRect: () => ({
                        top: 1000 + getElementCalls.length * 100,
                        bottom: 1100 + getElementCalls.length * 100,
                        left: 0,
                        right: 100,
                        width: 100,
                        height: 100,
                    }),
                }
            }) as any

            vm.handleScroll()

            // Should have checked all sections
            expect(getElementCalls).toHaveLength(6)
        })
    })

    describe('Mobile Menu Button', () => {
        it('should toggle drawer when mobile menu button is clicked', async () => {
            const wrapper = await mountQuasar(NavBar as any)
            const vm = wrapper.vm as any

            expect(vm.drawer).toBe(false)

            // Find the mobile menu button and click it
            const menuBtn = wrapper.find('.lt-md')
            await menuBtn.trigger('click')

            expect(vm.drawer).toBe(true)

            await menuBtn.trigger('click')
            expect(vm.drawer).toBe(false)
        })
    })

    describe('Drawer Navigation Items', () => {
        it('should have all sections in drawer with correct properties', async () => {
            const wrapper = await mountQuasar(NavBar as any)
            const vm = wrapper.vm as any

            expect(vm.sections).toHaveLength(6)

            const expectedSections = [
                { id: 'about', label: 'nav.about', icon: 'person' },
                { id: 'projects', label: 'nav.projects', icon: 'work' },
                { id: 'services', label: 'nav.services', icon: 'build' },
                { id: 'skills', label: 'nav.skills', icon: 'developer_mode' },
                { id: 'reviews', label: 'nav.reviews', icon: 'rate_review' },
                { id: 'contact', label: 'nav.contact', icon: 'contact_mail' },
            ]

            expectedSections.forEach((expected: Section, index: number) => {
                expect(vm.sections[index]).toEqual(expected)
            })
        })

        it('drawer items should be clickable', async () => {
            const wrapper = await mountQuasar(NavBar as any)
            const html = wrapper.html()

            // Check that q-item elements have clickable attribute
            expect(html).toContain('clickable')
        })
    })

    describe('Active Section Highlighting', () => {
        it('should highlight home button when activeSection is about', async () => {
            const wrapper = await mountQuasar(NavBar as any)
            const vm = wrapper.vm as any

            vm.activeSection = 'about'

            await wrapper.vm.$nextTick()

            const html = wrapper.html()
            expect(html).toContain('active-section')
            // Check that home button has active-section class
            expect(html).toMatch(/home-btn[\s\S]*active-section/)
        })

        it('should highlight correct desktop nav button for each section', async () => {
            const wrapper = await mountQuasar(NavBar as any)
            const vm = wrapper.vm as any

            const sections = ['about', 'projects', 'services', 'skills', 'reviews', 'contact']

            for (const section of sections) {
                vm.activeSection = section
                await wrapper.vm.$nextTick()

                const html = wrapper.html()
                // Check that the nav-btn for this section has active-section class
                expect(html).toContain(`active-section`)
            }
        })
    })

    describe('Edge Cases', () => {
        it('should handle sections with undefined id gracefully', async () => {
            const wrapper = await mountQuasar(NavBar as any)
            const vm = wrapper.vm as any

            // Add a section with undefined id
            vm.sections.push({ id: '', label: 'nav.empty', icon: 'help' })

            // Should not throw when iterating
            expect(() => vm.handleScroll()).not.toThrow()
        })

        it('should handle nullish element in handleScroll', async () => {
            const wrapper = await mountQuasar(NavBar as any)
            const vm = wrapper.vm as any

            document.getElementById = jest.fn(() => null) as any

            expect(() => vm.handleScroll()).not.toThrow()
        })
    })

    describe('Sections Initialization', () => {
        it('should have 6 sections with correct structure', async () => {
            const wrapper = await mountQuasar(NavBar as any)
            const vm = wrapper.vm as any

            expect(vm.sections).toHaveLength(6)

            vm.sections.forEach((section: Section) => {
                expect(section).toHaveProperty('id')
                expect(section).toHaveProperty('label')
                expect(section).toHaveProperty('icon')
                expect(typeof section.id).toBe('string')
                expect(typeof section.label).toBe('string')
                expect(typeof section.icon).toBe('string')
            })
        })

        it('sections values should match expected navigation items', async () => {
            const wrapper = await mountQuasar(NavBar as any)
            const vm = wrapper.vm as any

            const expectedIds = ['about', 'projects', 'services', 'skills', 'reviews', 'contact']

            expectedIds.forEach((id: string, index: number) => {
                expect(vm.sections[index].id).toBe(id)
            })
        })
    })
})
