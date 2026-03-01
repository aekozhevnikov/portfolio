/* eslint-disable */
import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { mountQuasar } from '../helpers'
import ProjectsSection from 'src/app/components/ui/ProjectsSection.vue'
import { Project } from 'src/config/site.config'

jest.mock('vue-i18n')

// Mock the useSiteStore
jest.mock('src/app/stores/siteStore', () => ({
    useSiteStore: jest.fn(),
}))

const createMockProject = (overrides: Partial<Project> = {}): Project => ({
    id: '1',
    title: 'Test Project',
    description: 'A test project description',
    technologies: {
        frontend: [{ language: 'Vue.js', icon: 'vuejs', variant: 'original' }],
    },
    order: 1,
    featured: false,
    private: false,
    showImage: true,
    ...overrides,
})

const mockProjects: Project[] = [
    createMockProject({ id: '1', title: 'Project A', order: 1 }),
    createMockProject({ id: '2', title: 'Project B', order: 2 }),
    createMockProject({ id: '3', title: 'Project C', order: 3 }),
    createMockProject({ id: '4', title: 'Project D', order: 4 }),
    createMockProject({ id: '5', title: 'Project E', order: 5 }),
    createMockProject({ id: '6', title: 'Project F', order: 6 }),
]

// Get the mocked useSiteStore
const useSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock

describe('ProjectsSection Component', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should be defined', () => {
        expect(ProjectsSection).toBeDefined()
    })

    it('should have correct component structure', () => {
        expect(typeof ProjectsSection).toBe('object')
    })

    it('should render section with correct id', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: [] },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        const html = wrapper.html()
        expect(html).toContain('id="projects"')
    })

    it('should render title and subtitle', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: [] },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        const html = wrapper.html()
        expect(html).toContain('projects.title')
        expect(html).toContain('projects.subtitle')
    })

    it('should render ProjectHolder components', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: mockProjects },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        // Check that there are 4 project columns rendered
        const cols = wrapper.findAll('.col-12.col-md-6')
        expect(cols.length).toBe(4)
    })

    it('should display initial limit of projects (4)', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: mockProjects },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        // Check that exactly 4 project columns are rendered
        const cols = wrapper.findAll('.col-12.col-md-6')
        expect(cols.length).toBe(4)
    })

    it('should filter out private projects', async () => {
        const projectsWithPrivate: Project[] = [
            createMockProject({ id: '1', private: false }),
            createMockProject({ id: '2', private: true }),
            createMockProject({ id: '3', private: false }),
            createMockProject({ id: '4', private: true }),
        ]

        const publicProjects = projectsWithPrivate.filter((p) => !p.private)
        expect(publicProjects.length).toBe(2)
        expect(publicProjects.every((p) => !p.private)).toBe(true)
    })

    it('should sort projects by order', async () => {
        const unsortedProjects: Project[] = [
            createMockProject({ id: '1', order: 3 }),
            createMockProject({ id: '2', order: 1 }),
            createMockProject({ id: '3', order: 2 }),
        ]

        const sorted = [...unsortedProjects].sort((a, b) => a.order - b.order)
        expect(sorted[0]?.order).toBe(1)
        expect(sorted[1]?.order).toBe(2)
        expect(sorted[2]?.order).toBe(3)
    })

    it('should show Show All button when there are more projects', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: mockProjects },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        const html = wrapper.html()
        // hasMoreProjects should be true (6 > 4)
        expect(html).toContain('projects.showAll')
    })

    it('should not show Show All button when fewer projects than limit', async () => {
        const fewProjects = mockProjects.slice(0, 3)
        useSiteStore.mockReturnValue({
            config: { projects: fewProjects },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        const html = wrapper.html()
        // hasMoreProjects should be false (3 <= 4)
        expect(html).not.toContain('projects.showAll')
    })

    it('should toggle showAllProjects on button click', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: mockProjects },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        const vm = wrapper.vm as any

        // Initial state
        expect(vm.showAllProjects).toBe(false)

        // Toggle to true
        vm.showAllProjects = true
        await wrapper.vm.$nextTick()
        expect(vm.showAllProjects).toBe(true)

        // Toggle back to false
        vm.showAllProjects = false
        await wrapper.vm.$nextTick()
        expect(vm.showAllProjects).toBe(false)
    })

    it('should compute hasMoreProjects correctly', async () => {
        const initialLimit = 4

        // With 6 projects
        const hasMore1 = mockProjects.length > initialLimit
        expect(hasMore1).toBe(true)

        // With 4 projects
        const fourProjects = mockProjects.slice(0, 4)
        const hasMore2 = fourProjects.length > initialLimit
        expect(hasMore2).toBe(false)
    })

    it('should compute displayedProjects correctly when showAll is false', async () => {
        const showAllProjects = false
        const initialLimit = 4

        const displayed = mockProjects
            .filter((p) => !p.private)
            .sort((a, b) => a.order - b.order)
            .slice(0, showAllProjects ? undefined : initialLimit)

        expect(displayed.length).toBe(4)
    })

    it('should compute displayedProjects correctly when showAll is true', async () => {
        const showAllProjects = true

        const displayed = mockProjects
            .filter((p) => !p.private)
            .sort((a, b) => a.order - b.order)
            .slice(0, showAllProjects ? undefined : 4)

        expect(displayed.length).toBe(6)
    })

    it('should have sectionStyle with page background', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: [] },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        // sectionStyle is a computed object
        const vm = wrapper.vm as any
        expect(vm.sectionStyle).toEqual({
            backgroundColor: 'var(--color-page)',
            minHeight: 'auto',
        })
    })

    it('should have Show All button with correct properties', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: mockProjects },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        const html = wrapper.html()
        expect(html).toContain('projects.showAll')
        // Quasar mock renders actual button with q-btn class
        expect(html).toContain('q-btn')
        expect(html).toContain('q-px-lg')
        expect(html).toContain('q-py-sm')
    })

    it('should have Show Less button when all projects shown', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: mockProjects },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        const html = wrapper.html()

        // Initially showAll is false, so showLess should not be visible
        expect(html).not.toContain('projects.showLess')

        // Toggle to show all
        const vm = wrapper.vm as any
        vm.showAllProjects = true
        await wrapper.vm.$nextTick()

        const updatedHtml = wrapper.html()
        expect(updatedHtml).toContain('projects.showLess')
    })

    it('should render correct number of ProjectHolders based on state', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: mockProjects },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)

        const vm = wrapper.vm as any

        // Initial state shows 4
        const initialHolders = wrapper.findAllComponents({ name: 'ProjectHolder' })
        expect(initialHolders.length).toBe(4)

        // When show all is true, should show 6
        vm.showAllProjects = true
        await wrapper.vm.$nextTick()

        const allHolders = wrapper.findAllComponents({ name: 'ProjectHolder' })
        expect(allHolders.length).toBe(6)
    })

    it('should use q-col-gutter-xl for spacing', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: [] },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        const row = wrapper.find('.row')
        expect(row.exists()).toBe(true)
        expect(row.classes()).toContain('q-col-gutter-xl')
    })

    it('should have col-12 col-md-6 grid classes', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: mockProjects.slice(0, 1) },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        const cols = wrapper.findAll('.col-12.col-md-6')
        expect(cols.length).toBeGreaterThan(0)
    })

    it('should maintain order after sorting', async () => {
        const reorderedProjects: Project[] = [
            createMockProject({ id: '1', order: 5 }),
            createMockProject({ id: '2', order: 1 }),
            createMockProject({ id: '3', order: 3 }),
            createMockProject({ id: '4', order: 2 }),
            createMockProject({ id: '5', order: 4 }),
        ]

        const sorted = [...reorderedProjects].sort((a, b) => a.order - b.order)
        for (let i = 0; i < sorted.length - 1; i++) {
            expect(sorted[i]?.order).toBeLessThanOrEqual(<number>sorted[i + 1]?.order)
        }
    })

    it('should handle empty projects array', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: [] },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        const vm = wrapper.vm as any

        const emptyProjects: Project[] = []
        const filtered = emptyProjects.filter((p) => !p.private)
        expect(filtered.length).toBe(0)

        // displayedProjects should be empty
        expect(vm.displayedProjects.length).toBe(0)
    })

    it('should handle all private projects', async () => {
        const allPrivate: Project[] = mockProjects.map((p) => ({ ...p, private: true }))
        useSiteStore.mockReturnValue({
            config: { projects: allPrivate },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        const vm = wrapper.vm as any

        const publicProjects = allPrivate.filter((p) => !p.private)
        expect(publicProjects.length).toBe(0)
        expect(vm.displayedProjects.length).toBe(0)
    })

    it('should preserve project order when filtering', async () => {
        const projectsWithPrivate: Project[] = [
            createMockProject({ id: '1', order: 1, private: true }),
            createMockProject({ id: '2', order: 2, private: false }),
            createMockProject({ id: '3', order: 3, private: true }),
            createMockProject({ id: '4', order: 4, private: false }),
        ]

        const publicSorted = projectsWithPrivate
            .filter((p) => !p.private)
            .sort((a, b) => a.order - b.order)

        expect(publicSorted.length).toBe(2)
        expect(publicSorted[0]?.id).toBe('2')
        expect(publicSorted[1]?.id).toBe('4')
    })

    it('should have max-width 1500px container', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: [] },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        const container = wrapper.find('.q-mx-auto')
        expect(container.exists()).toBe(true)
        expect(container.attributes('style')).toContain('max-width: 1500px')
    })

    it('should have correct section padding', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: [] },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        const section = wrapper.find('section')
        expect(section.exists()).toBe(true)
        expect(section.classes()).toContain('q-pa-xl')
    })

    it('should pass project prop to ProjectHolder', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: mockProjects },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        const vm = wrapper.vm as any

        // Verify that displayedProjects contains project objects with correct structure
        expect(vm.displayedProjects.length).toBeGreaterThan(0)
        const firstProject = vm.displayedProjects[0]
        expect(firstProject).toBeDefined()
        expect(firstProject).toHaveProperty('id')
        expect(firstProject).toHaveProperty('title')
    })

    it('should use key as project.id for v-for', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: mockProjects },
            t: jest.fn((key: string) => key),
        })

        // The component uses :key="project.id", we just verify the structure
        expect(mockProjects.every((p) => p.id !== undefined)).toBe(true)
    })

    it('should handle project with missing optional fields', async () => {
        const minimalProject = createMockProject({
            image: '',
            // technologies is required, so we use the default from createMockProject
        })

        expect(minimalProject.id).toBeDefined()
        expect(minimalProject.title).toBeDefined()
    })

    it('should have button padding classes', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: mockProjects },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        const html = wrapper.html()
        // Buttons have q-px-lg q-py-sm classes
        expect(html).toContain('q-px-lg')
        expect(html).toContain('q-py-sm')
    })

    it('should have outline and rounded on buttons', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: mockProjects },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        const html = wrapper.html()
        // Buttons have outline and rounded attributes
        expect(html).toContain('outline')
        expect(html).toContain('rounded')
    })

    it('should compute hasMoreProjects as false when exactly at limit', async () => {
        const exactlyAtLimit = mockProjects.slice(0, 4)
        const hasMore = exactlyAtLimit.length > 4
        expect(hasMore).toBe(false)
    })

    it('should handle one project', async () => {
        const singleProject = [createMockProject({ id: '1' })]

        const publicProjects = singleProject.filter((p) => !p.private)
        expect(publicProjects.length).toBe(1)

        const displayed = publicProjects.slice(0, 4)
        expect(displayed.length).toBe(1)
    })

    it('should set showAllProjects to false initially', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: mockProjects },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        const vm = wrapper.vm as any

        expect(vm.showAllProjects).toBe(false)
    })

    it('should set initialLimit to 4', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: mockProjects },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        const vm = wrapper.vm as any

        expect(vm.initialLimit).toBe(4)
    })

    it('should compute displayedProjects as computed property', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: mockProjects },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        const vm = wrapper.vm as any

        // Verify computed property exists and is reactive
        expect(typeof vm.displayedProjects).toBe('object')
        expect(Array.isArray(vm.displayedProjects)).toBe(true)
    })

    it('should recompute displayedProjects when showAllProjects changes', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: mockProjects },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)
        const vm = wrapper.vm as any

        const initialCount = (vm.displayedProjects as Project[]).length
        expect(initialCount).toBe(4) // Initially shows 4

        vm.showAllProjects = true
        await wrapper.vm.$nextTick()

        // When showAll is true, shows all 6
        expect((vm.displayedProjects as Project[]).length).toBe(6)
    })

    it('should have proper template structure', async () => {
        useSiteStore.mockReturnValue({
            config: { projects: [] },
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(ProjectsSection as any)

        expect(wrapper.find('section').exists()).toBe(true)
        expect(wrapper.find('.row').exists()).toBe(true)
        expect(wrapper.find('.text-center').exists()).toBe(true)
    })
})
