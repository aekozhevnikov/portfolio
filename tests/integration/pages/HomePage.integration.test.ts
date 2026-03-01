import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import type { SiteConfig } from 'src/config/site.config'

// Mock stores and dependencies
jest.mock('src/app/stores/siteStore', () => ({
    useSiteStore: jest.fn(() => ({
        isDark: false,
        t: jest.fn((key: string) => key),
    })),
}))

describe('HomePage Integration Tests', () => {
    const createMockConfig = (): SiteConfig => ({
        personal: {
            name: 'Test User',
            title: 'Full Stack Developer',
            location: 'Test Location',
            email: 'test@example.com',
            description: 'A passionate developer',
            about: 'A passionate developer',
        },
        projects: [
            {
                id: 'project-1',
                title: 'Project Alpha',
                description: 'First project',
                technologies: {
                    frontend: [{ language: 'Vue.js', icon: 'vuejs', variant: 'original' }],
                    backend: [{ language: 'Node.js', icon: 'nodejs', variant: 'original' }],
                },
                order: 1,
                highlights: ['Feature A', 'Feature B'],
                link: 'https://alpha.example.com',
                codeLink: 'https://github.com/alpha',
            },
            {
                id: 'project-2',
                title: 'Project Beta',
                description: 'Second project',
                technologies: {
                    frontend: [{ language: 'React', icon: 'react', variant: 'wordmark' }],
                    languages: [{ language: 'Python', icon: 'python', variant: 'original' }],
                },
                order: 2,
                highlights: ['Feature X', 'Feature Y'],
                link: '',
                codeLink: 'https://github.com/beta',
            },
        ],
        skills: {
            categories: [
                {
                    category: 'Frontend',
                    skills: [
                        { language: 'Vue.js', icon: 'vuejs', variant: 'original' },
                        { language: 'React', icon: 'react', variant: 'wordmark' },
                        { language: 'TypeScript', icon: 'typescript', variant: 'original' },
                    ],
                },
                {
                    category: 'Backend',
                    skills: [
                        { language: 'Node.js', icon: 'nodejs', variant: 'original' },
                        { language: 'Python', icon: 'python', variant: 'original' },
                    ],
                },
            ],
        },
        services: [
            {
                title: 'Web Development',
                description: 'Building responsive web applications',
                icon: 'code',
                color: '#6366f1',
            },
            {
                title: 'Mobile Development',
                description: 'Cross-platform mobile apps',
                icon: 'phone',
                color: '#10b981',
            },
        ],
        socials: [
            { name: 'GitHub', icon: 'code', color: '#24292e', link: 'https://github.com/testuser' },
            {
                name: 'LinkedIn',
                icon: 'linkedin',
                color: '#0077b5',
                link: 'https://linkedin.com/in/testuser',
            },
        ],
    })

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should have proper structure', () => {
        // Basic sanity check
        expect(createMockConfig).toBeDefined()

        const config = createMockConfig()
        expect(config.personal.name).toBe('Test User')
        expect(config.projects).toHaveLength(2)
        expect(config.skills.categories).toHaveLength(2)
        expect(config.services).toHaveLength(2)
        expect(config.socials).toHaveLength(2)
    })

    it('should have all required project fields', () => {
        const config = createMockConfig()

        config.projects.forEach((project) => {
            expect(project).toHaveProperty('title')
            expect(project).toHaveProperty('description')
            expect(project).toHaveProperty('technologies')
            expect(project).toHaveProperty('order')
            expect(typeof project.technologies).toBe('object')
            expect(project.technologies).not.toBeNull()
        })
    })

    it('should have all required skill categories', () => {
        const config = createMockConfig()

        config.skills.categories.forEach((category) => {
            expect(category).toHaveProperty('category')
            expect(category).toHaveProperty('skills')
            expect(Array.isArray(category.skills)).toBe(true)
            category.skills.forEach((skill) => {
                expect(skill).toHaveProperty('language')
            })
        })
    })

    it('should have all services with title and description', () => {
        const config = createMockConfig()

        config.services?.forEach((service) => {
            expect(service).toHaveProperty('title')
            expect(service).toHaveProperty('description')
        })
    })

    it('should have social links with name and url', () => {
        const config = createMockConfig()

        config.socials?.forEach((social) => {
            expect(social).toHaveProperty('name')
            expect(social).toHaveProperty('link')
            expect(typeof social.name).toBe('string')
            expect(typeof social.link).toBe('string')
        })
    })

    it('should support empty arrays for optional sections', () => {
        const minimalConfig: SiteConfig = {
            personal: {
                name: 'Minimal',
                title: 'Developer',
                location: '',
                email: '',
                description: '',
                about: '',
            },
            projects: [],
            skills: { categories: [] },
        }

        expect(minimalConfig.projects).toHaveLength(0)
        expect(minimalConfig.skills.categories).toHaveLength(0)
        expect(minimalConfig.services).toBeUndefined()
        expect(minimalConfig.socials).toBeUndefined()
    })
})
