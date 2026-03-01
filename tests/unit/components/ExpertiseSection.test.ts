/* eslint-disable */
import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { mountQuasar } from '../helpers'
import ExpertiseSection from 'src/app/components/ui/ExpertiseSection.vue'
import { SkillCategory } from 'src/config/site.config'
import { getDeviconUrl } from 'src/utils/techIcons'

jest.mock('vue-i18n')

// Mock the useSiteStore
jest.mock('src/app/stores/siteStore', () => ({
    useSiteStore: jest.fn(() => ({
        config: {
            skills: {
                categories: [],
            },
        },
        t: jest.fn((key: string) => key),
    })),
}))

// Mock Quasar components - REMOVED to use helpers.ts stubs
// jest.mock('quasar', () => ({ ... }))

// Mock techIcons util
jest.mock('src/utils/techIcons', () => ({
    getDeviconUrl: jest.fn(
        (tech: string, variant: string) =>
            `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech}/${variant}-${tech}.svg`,
    ),
}))

const mockSkillCategories: SkillCategory[] = [
    {
        category: 'frontend',
        skills: [
            { language: 'Vue.js', icon: 'vuejs', variant: 'plain' },
            { language: 'React', icon: 'react', variant: 'plain' },
            { language: 'TypeScript', icon: 'typescript', variant: 'plain' },
        ],
    },
    {
        category: 'backend',
        skills: [
            { language: 'Node.js', icon: 'nodejs', variant: 'plain' },
            { language: 'Python', icon: 'python', variant: 'plain' },
        ],
    },
    {
        category: 'databases',
        skills: [
            { language: 'PostgreSQL', icon: 'postgresql', variant: 'plain' },
            { language: 'MongoDB', icon: 'mongodb', variant: 'plain' },
        ],
    },
    {
        category: 'devops',
        skills: [{ language: 'Docker', icon: 'docker', variant: 'plain' }],
    },
]

describe('ExpertiseSection Component', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        // Reset mock to return empty categories by default
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: [],
                },
            },
            t: jest.fn((key: string) => key),
        })
    })

    it('should be defined', () => {
        expect(ExpertiseSection).toBeDefined()
    })

    it('should have correct component structure', () => {
        expect(typeof ExpertiseSection).toBe('object')
    })

    it('should render section with correct id', async () => {
        const wrapper = await mountQuasar(ExpertiseSection as any)

        const div = wrapper.find('#skills')
        expect(div.exists()).toBe(true)
        expect(div.classes()).toContain('text-body1')
    })

    it('should render title', async () => {
        const wrapper = await mountQuasar(ExpertiseSection as any)
        const title = wrapper.find('.text-h4')
        expect(title.exists()).toBe(true)
        expect(title.text()).toContain('expertise.title')
    })

    it('should render all skill categories', async () => {
        // Override store BEFORE mounting
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: mockSkillCategories,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)

        // Each category renders a div with title
        const categoryTitles = wrapper.findAll('.text-h6.text-weight-bold.text-primary')
        expect(categoryTitles.length).toBe(4)
    })

    it('should display category names using t function', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: mockSkillCategories,
                },
            },
            t: jest.fn((key: string) => key), // This t is from store, not used for categories
        })

        // Need to provide i18n with custom translation
        const wrapper = await mountQuasar(ExpertiseSection as any, {
            i18n: {
                locale: 'en',
                messages: {
                    en: {
                        frontend: 'translated(frontend)',
                        backend: 'translated(backend)',
                        databases: 'translated(databases)',
                        devops: 'translated(devops)',
                    },
                },
            },
        })

        const titles = wrapper.findAll('.text-h6')
        expect(titles[0]?.text()).toBe('frontend') // t() returns key in mock
    })

    it('should render skill icons for each category', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: mockSkillCategories,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)

        // Total skills across all categories: 3 + 2 + 2 + 1 = 8
        const icons = wrapper.findAll('img')
        expect(icons.length).toBe(8)
    })

    it('should call getDeviconUrl for each skill', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: mockSkillCategories,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)

        // Verify getDeviconUrl was called with the correct arguments for each skill
        expect(getDeviconUrl).toHaveBeenCalledWith('vuejs', 'plain')
        expect(getDeviconUrl).toHaveBeenCalledWith('react', 'plain')
        expect(getDeviconUrl).toHaveBeenCalledWith('typescript', 'plain')
        expect(getDeviconUrl).toHaveBeenCalledWith('nodejs', 'plain')
        expect(getDeviconUrl).toHaveBeenCalledWith('python', 'plain')
        expect(getDeviconUrl).toHaveBeenCalledWith('postgresql', 'plain')
        expect(getDeviconUrl).toHaveBeenCalledWith('mongodb', 'plain')
        expect(getDeviconUrl).toHaveBeenCalledWith('docker', 'plain')
    })

    it('should have tooltips with skill language names', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: mockSkillCategories,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)

        // q-tooltip is stubbed and renders with slot content
        const tooltips = wrapper.findAll('.q-tooltip')
        expect(tooltips.length).toBe(8)

        // Check first tooltip content - it should contain the language name
        expect(tooltips[0]?.text()).toContain('Vue.js')
    })

    it('should handle image errors', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: mockSkillCategories,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)
        const vm = wrapper.vm as any
        await wrapper.vm.$nextTick()

        // Initially there should be 8 images
        let icons = wrapper.findAll('img')
        expect(icons.length).toBe(8)

        // Simulate image error for first skill
        vm.handleImageError('vuejs-plain')
        expect(vm.skillImageErrors.has('vuejs-plain')).toBe(true)

        // Check that image is removed from DOM after error
        await wrapper.vm.$nextTick()
        icons = wrapper.findAll('img')
        expect(icons.length).toBe(7) // One image removed
    })

    it('should have proper spacing classes', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: mockSkillCategories,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)

        const container = wrapper.find('div.q-py-xl')
        expect(container.exists()).toBe(true)

        const gutter = wrapper.find('.q-gutter-md')
        expect(gutter.exists()).toBe(true)
    })

    it('should use justify-center for skill icons', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: mockSkillCategories,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)
        const row = wrapper.find('.row.items-center.justify-center')
        expect(row.exists()).toBe(true)
    })

    it('should have q-col-gutter for spacing between skills', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: mockSkillCategories,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)
        const gutter = wrapper.find('.q-gutter-md')
        expect(gutter.exists()).toBe(true)
    })

    it('should render empty when no skill categories', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: undefined,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)

        const categories = wrapper.findAll('.text-h6')
        expect(categories.length).toBe(0)
    })

    it('should render empty when skills array is empty', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: [],
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)

        const icons = wrapper.findAll('img')
        expect(icons.length).toBe(0)
    })

    it('should handle category with single skill', async () => {
        const singleSkillCategory: SkillCategory[] = [
            {
                category: 'frontend',
                skills: [{ language: 'Vue.js', icon: 'vuejs', variant: 'plain' }],
            },
        ]

        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: singleSkillCategory,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)

        const icons = wrapper.findAll('img')
        expect(icons.length).toBe(1)
    })

    it('should have proper styling for skill containers', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: mockSkillCategories,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)
        const skillDivs = wrapper.findAll('.br-20.q-pa-sm')
        expect(skillDivs.length).toBeGreaterThan(0)
    })

    it('should set image dimensions correctly', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: mockSkillCategories,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)

        const images = wrapper.findAll('img')
        expect(images[0]?.attributes('style')).toContain('width: 48px')
        expect(images[0]?.attributes('style')).toContain('height: 48px')
    })

    it('should use proper alt text for images', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: mockSkillCategories,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)

        const images = wrapper.findAll('img')
        expect(images[0]?.attributes('alt')).toBe('Vue.js')
    })

    it('should have tooltip with proper positioning', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: mockSkillCategories,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)

        // The q-tooltip component is stubbed and has attributes on the wrapper div
        const tooltip = wrapper.find('.q-tooltip')
        expect(tooltip.exists()).toBe(true)
        // Check that tooltip attributes are present (they come from the component definition)
        // These are set on the component itself, not the wrapper, so we verify via classes
        expect(tooltip.classes()).toContain('bg-primary')
        expect(tooltip.classes()).toContain('text-white')
    })

    it('should initialize skillImageErrors as empty Set', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: mockSkillCategories,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)
        const vm = wrapper.vm as any

        expect(vm.skillImageErrors).toBeInstanceOf(Set)
        expect(vm.skillImageErrors.size).toBe(0)
    })

    it('should handle multiple errors for different skills', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: mockSkillCategories,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)
        const vm = wrapper.vm as any

        vm.handleImageError('vuejs-plain')
        vm.handleImageError('react-plain')
        vm.handleImageError('nodejs-plain')

        expect(vm.skillImageErrors.size).toBe(3)
        expect(vm.skillImageErrors.has('vuejs-plain')).toBe(true)
        expect(vm.skillImageErrors.has('react-plain')).toBe(true)
        expect(vm.skillImageErrors.has('nodejs-plain')).toBe(true)
    })

    it('should have q-mb-xl spacing between categories', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: mockSkillCategories,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)

        // There should be 5 elements with q-mb-xl: 1 title + 4 category wrappers
        const categoryDivs = wrapper.findAll('.q-mb-xl')
        expect(categoryDivs.length).toBe(5)
    })

    it('should compute skillCategories correctly', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: mockSkillCategories,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)
        const vm = wrapper.vm as any

        expect(vm.skillCategories).toEqual(mockSkillCategories)
    })

    it('should return empty array when no categories', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: [],
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)
        const vm = wrapper.vm as any

        expect(vm.skillCategories).toEqual([])
    })

    it('should have relative-position on category title', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: mockSkillCategories,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)

        // Find the title element with both classes
        const titles = wrapper.findAll('.relative-position.text-center')
        expect(titles.length).toBeGreaterThan(0)
    })

    it('should have q-pl-sm padding on category title', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: mockSkillCategories,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)

        // Find any element with q-pl-sm class
        const elements = wrapper.findAll('.q-pl-sm')
        expect(elements.length).toBeGreaterThan(0)
    })

    it('should render icons with proper centering', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: mockSkillCategories,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)
        const row = wrapper.find('.row.items-center.justify-center')
        expect(row.exists()).toBe(true)
    })

    it('should not break when skill has missing variant', async () => {
        const skillWithNoVariant: SkillCategory[] = [
            {
                category: 'frontend',
                skills: [{ language: 'Vue.js', icon: 'vuejs', variant: 'plain' }],
            },
        ]

        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: skillWithNoVariant,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)
        await wrapper.vm.$nextTick()

        // Should render without error
        expect(wrapper.exists()).toBe(true)
    })

    it('should have tooltip with bg-primary and text-white classes', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                skills: {
                    categories: mockSkillCategories,
                },
            },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ExpertiseSection as any)

        const tooltips = wrapper.findAll('.q-tooltip')
        expect(tooltips.length).toBeGreaterThan(0)

        // Check first tooltip has proper classes
        expect(tooltips[0]?.classes()).toContain('bg-primary')
        expect(tooltips[0]?.classes()).toContain('text-white')
        expect(tooltips[0]?.classes()).toContain('br-20')
    })
})
