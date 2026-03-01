import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { mountQuasar } from '../helpers'
import ProjectModal from 'src/app/components/ui/ProjectModal.vue'
import { getDeviconUrl } from 'src/utils/techIcons'
import { Project } from 'src/config/site.config'

jest.mock('vue-i18n')
jest.mock('src/utils/techIcons', () => ({
    getDeviconUrl: jest.fn((name: string, variant: string) => {
        return `https://cdn.jsdelivr.net/npm/devicon@latest/icons/${variant}/${name}-${variant}.svg`
    }),
}))

const mockProject: Project = {
    id: '1',
    title: 'E-Commerce Platform',
    description:
        'A full-stack e-commerce platform with payment integration and inventory management.',
    image: '/project-images/ecommerce-hero.jpg',
    images: ['/project-images/ecommerce-1.jpg', '/project-images/ecommerce-2.jpg'],
    link: 'https://ecommerce-demo.example.com',
    codeLink: 'https://github.com/example/ecommerce',
    customStyle: {
        btnColor: '#6366f1',
    },
    technologies: {
        languages: [
            { language: 'TypeScript', icon: 'typescript', variant: 'plain' },
            { language: 'Python', icon: 'python', variant: 'plain' },
        ],
        frontend: [
            { language: 'React', icon: 'react', variant: 'plain' },
            { language: 'Vue.js', icon: 'vuejs', variant: 'plain' },
        ],
        backend: [
            { language: 'Node.js', icon: 'nodejs', variant: 'plain' },
            { language: 'Django', icon: 'django', variant: 'plain' },
        ],
        databases: [{ language: 'PostgreSQL', icon: 'postgresql', variant: 'plain' }],
        devops: [
            { language: 'Docker', icon: 'docker', variant: 'plain' },
            { language: 'AWS', icon: 'amazonaws', variant: 'plain' },
        ],
    },
    highlights: [
        'Implemented real-time inventory tracking',
        'Integrated with Stripe for secure payments',
        'Built admin dashboard with analytics',
    ],
    order: 1,
}

describe('ProjectModal Component', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should be defined', () => {
        expect(ProjectModal).toBeDefined()
    })

    it('should have correct component structure', () => {
        expect(typeof ProjectModal).toBe('object')
    })

    it('should render dialog when project is provided', async () => {
        const wrapper = await mountQuasar(ProjectModal as any, {
            props: {
                modelValue: true,
                project: mockProject,
            },
        })

        const html = wrapper.html()
        expect(html).toContain('q-dialog')
    })

    it('should display project title', async () => {
        const wrapper = await mountQuasar(ProjectModal as any, {
            props: {
                modelValue: true,
                project: mockProject,
            },
        })

        const html = wrapper.html()
        expect(html).toContain('E-Commerce Platform')
    })

    it('should display project description', async () => {
        const wrapper = await mountQuasar(ProjectModal as any, {
            props: {
                modelValue: true,
                project: mockProject,
            },
        })

        const html = wrapper.html()
        expect(html).toContain('full-stack e-commerce platform')
    })

    it('should render image carousel when images exist', async () => {
        const wrapper = await mountQuasar(ProjectModal as any, {
            props: {
                modelValue: true,
                project: mockProject,
            },
        })

        const html = wrapper.html()
        expect(html).toContain('q-carousel')
    })

    it('should not render carousel when no images', async () => {
        const projectNoImages: Project = {
            ...mockProject,
            image: '',
            images: [],
            // Ensure all required properties are present
            technologies: mockProject.technologies,
            order: mockProject.order,
        }

        const wrapper = await mountQuasar(ProjectModal as any, {
            props: {
                modelValue: true,
                project: projectNoImages,
            },
        })

        const html = wrapper.html()
        expect(html).not.toContain('q-carousel')
    })

    it('should render technology sections', async () => {
        const wrapper = await mountQuasar(ProjectModal as any, {
            props: {
                modelValue: true,
                project: mockProject,
            },
        })

        const html = wrapper.html()
        expect(html).toContain('expertise.programmingLanguages')
        expect(html).toContain('expertise.frontend')
        expect(html).toContain('expertise.backend')
        expect(html).toContain('expertise.devops')
    })

    it('should render technology badges', async () => {
        const wrapper = await mountQuasar(ProjectModal as any, {
            props: {
                modelValue: true,
                project: mockProject,
            },
        })

        const html = wrapper.html()
        const badgeCount = (html.match(/q-badge/g) || []).length
        expect(badgeCount).toBeGreaterThanOrEqual(7)
    })

    it('should call getDeviconUrl for technologies', async () => {
        const wrapper = await mountQuasar(ProjectModal as any, {
            props: {
                modelValue: true,
                project: mockProject,
            },
        })

        await wrapper.vm.$nextTick()

        expect(getDeviconUrl).toHaveBeenCalled()
        expect(getDeviconUrl).toHaveBeenCalledWith('typescript', 'plain')
    })

    it('should render images in technology badges', async () => {
        const wrapper = await mountQuasar(ProjectModal as any, {
            props: {
                modelValue: true,
                project: mockProject,
            },
        })

        await wrapper.vm.$nextTick()

        const html = wrapper.html()
        const imgCount = (html.match(/<img/g) || []).length
        expect(imgCount).toBeGreaterThan(0)
    })

    it('should have handleImageError method defined', async () => {
        const wrapper = await mountQuasar(ProjectModal as any, {
            props: {
                modelValue: true,
                project: mockProject,
            },
        })

        // Check that handleImageError method exists on component instance
        expect(wrapper.vm).toHaveProperty('handleImageError')
        expect(typeof wrapper.vm.handleImageError).toBe('function')
    })

    it('should render highlights section', async () => {
        const wrapper = await mountQuasar(ProjectModal as any, {
            props: {
                modelValue: true,
                project: mockProject,
            },
        })

        const html = wrapper.html()
        expect(html).toContain('highlights')
        expect(html).toContain('Implemented real-time inventory tracking')
    })

    it('should render View Project link button', async () => {
        const wrapper = await mountQuasar(ProjectModal as any, {
            props: {
                modelValue: true,
                project: mockProject,
            },
        })

        const html = wrapper.html()
        expect(html).toContain('q-btn')
        expect(html).toContain('projects.view')
    })

    it('should use custom button color', async () => {
        const wrapper = await mountQuasar(ProjectModal as any, {
            props: {
                modelValue: true,
                project: mockProject,
            },
        })

        const html = wrapper.html()
        expect(html).toMatch(/color:\s*#6366f1|rgb\(\s*99,\s*102,\s*241\s*\)/)
    })

    it('should render Source Code link when codeLink provided', async () => {
        const wrapper = await mountQuasar(ProjectModal as any, {
            props: {
                modelValue: true,
                project: mockProject,
            },
        })

        const html = wrapper.html()
        expect(html).toContain('projects.code')
        expect(html).toContain('https://github.com/example/ecommerce')
    })

    it('should not render Source Code link when codeLink not provided', async () => {
        const projectNoCode: Project = {
            ...mockProject,
            codeLink: undefined,
        }

        const wrapper = await mountQuasar(ProjectModal as any, {
            props: {
                modelValue: true,
                project: projectNoCode,
            },
        })

        const html = wrapper.html()
        expect(html).not.toContain('projects.code')
    })
})
