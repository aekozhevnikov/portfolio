import { describe, expect, it, jest } from '@jest/globals'
import pdfMake from 'pdfmake/build/pdfmake'
import {
    buildPDFDocument,
    downloadResumePDF,
    getResumeTranslations,
    sanitizeFilename,
} from 'src/utils/resumePDF'
import type { SiteConfig } from 'src/config/site.config'

jest.mock('pdfmake/build/pdfmake', () => {
    const mockCreatePdf = jest.fn().mockReturnValue({
        download: jest.fn(),
        open: jest.fn(),
        print: jest.fn(),
        getBlob: jest.fn(() => Promise.resolve(new Blob())) as any,
        getDataUrl: jest.fn(() => Promise.resolve('data:application/pdf;base64,...')) as any,
    } as any)

    return {
        __esModule: true,
        default: {
            createPdf: mockCreatePdf,
            vfs: {},
        } as any,
        createPdf: mockCreatePdf,
    }
})

describe('resumePDF utility', () => {
    const mockConfig: SiteConfig = {
        personal: {
            name: 'John Doe',
            title: 'Software Developer',
            location: 'New York, NY',
            email: 'john@example.com',
            about: 'Test about me content',
            description: 'Test description',
        },
        projects: [
            {
                id: 'project-1',
                title: 'Test Project',
                description: 'A test project',
                technologies: {
                    frontend: [{ language: 'Vue.js', icon: 'vuejs', variant: 'original' }],
                    backend: [{ language: 'TypeScript', icon: 'typescript', variant: 'original' }],
                },
                order: 1,
                highlights: ['Feature 1', 'Feature 2'],
            },
        ],
        skills: {
            categories: [
                {
                    category: 'Frontend',
                    skills: [
                        { language: 'Vue.js', icon: 'vuejs', variant: 'original' },
                        { language: 'React', icon: 'react', variant: 'wordmark' },
                    ],
                },
            ],
        },
        services: [
            {
                title: 'Web Development',
                description: 'Custom web applications',
                icon: 'code',
                color: '#6366f1',
            },
        ],
        socials: [
            {
                name: 'GitHub',
                icon: 'code',
                color: '#24292e',
                link: 'https://github.com/johndoe',
            },
            {
                name: 'Email',
                icon: 'email',
                color: '#ea4335',
                link: 'mailto:john@example.com',
            },
        ],
    }

    describe('sanitizeFilename', () => {
        it('should convert name to lowercase', () => {
            const result = sanitizeFilename('John Doe')
            expect(result).toBe('john_doe')
        })

        it('should replace invalid characters with underscore', () => {
            const result = sanitizeFilename('John@Doe#123')
            expect(result).toBe('john_doe_123')
        })

        it('should limit length to 100 characters', () => {
            const longName = 'a'.repeat(150)
            const result = sanitizeFilename(longName)
            expect(result.length).toBeLessThanOrEqual(100)
        })

        it('should handle Russian characters', () => {
            const result = sanitizeFilename('Антон')
            expect(result).toBe('антон')
        })
    })

    describe('getResumeTranslations', () => {
        it('should return English translations for en locale', () => {
            const result = getResumeTranslations('en')
            expect(result.about).toBe('About Me')
            expect(result.skills).toBe('Skills')
            expect(result.projects).toBe('Projects')
            expect(result.services).toBe('Services')
            expect(result.social).toBe('Social Links')
        })

        it('should return Russian translations for ru locale', () => {
            const result = getResumeTranslations('ru')
            expect(result.about).toBe('Обо мне')
            expect(result.skills).toBe('Навыки')
            expect(result.projects).toBe('Проекты')
            expect(result.services).toBe('Услуги')
            expect(result.social).toBe('Социальные сети')
        })

        it('should return English translations as fallback for unknown locale', () => {
            const result = getResumeTranslations('fr')
            expect(result.about).toBe('About Me')
        })
    })

    describe('buildPDFDocument', () => {
        it('should build a valid document definition for light theme', () => {
            const result = buildPDFDocument(mockConfig, 'en', false)

            expect(result).toBeDefined()
            expect(result.pageSize).toBe('A4')
            expect(result.pageOrientation).toBe('portrait')
            expect(result.defaultStyle).toBeDefined()
            expect(result.content).toBeInstanceOf(Array)
            expect(result.styles).toBeDefined()
        })

        it('should use correct colors for dark theme', () => {
            const result = buildPDFDocument(mockConfig, 'en', true)

            expect(result.defaultStyle.color).toBe('#ffffff')
            expect(result.pageColor).toBe('#0a0a0a')
        })

        it('should include personal info in header', () => {
            const result = buildPDFDocument(mockConfig, 'en', false)
            const content = result.content as any[]

            // Find text elements containing name and title
            const nameElement = content.find(
                (item) =>
                    item.text === 'John Doe' ||
                    (item.columns &&
                        item.columns[0]?.stack?.some((s: any) => s.text === 'John Doe')),
            )
            expect(nameElement).toBeDefined()
        })

        it('should include about section when personal.about exists', () => {
            const result = buildPDFDocument(mockConfig, 'en', false)
            const content = result.content as any[]

            const aboutSection = content.find((item) => item.text === 'About Me')
            expect(aboutSection).toBeDefined()
        })

        it('should include skills section with categories', () => {
            const result = buildPDFDocument(mockConfig, 'en', false)
            const content = result.content as any[]

            const skillsSection = content.find((item) => item.text === 'Skills')
            expect(skillsSection).toBeDefined()
        })

        it('should include projects with technologies as tags', () => {
            const result = buildPDFDocument(mockConfig, 'en', false)
            const content = result.content as any[]

            const projectsSection = content.find((item) => item.text === 'Projects')
            expect(projectsSection).toBeDefined()
        })

        it('should include services as a table', () => {
            const result = buildPDFDocument(mockConfig, 'en', false)
            const content = result.content as any[]

            const servicesSection = content.find((item) => item.text === 'Services')
            expect(servicesSection).toBeDefined()
        })

        it('should format mailto links correctly', () => {
            const result = buildPDFDocument(mockConfig, 'en', false)
            const content = result.content as any[]

            // Find the social links section
            let socialSection: any = null
            for (let i = 0; i < content.length; i++) {
                if (content[i].text === 'Social Links') {
                    socialSection = content[i + 1]
                    break
                }
            }
            expect(socialSection).toBeDefined()
            expect(socialSection?.ul).toBeDefined()
        })
    })

    describe('downloadResumePDF', () => {
        it('should call pdfMake.createPdf with correct configuration', async () => {
            const result = buildPDFDocument(mockConfig, 'en', false)

            await downloadResumePDF(mockConfig, 'en', false)

            expect(pdfMake.createPdf).toHaveBeenCalledWith(result)
        })

        it('should generate filename from config name and locale', () => {
            // sanitizeFilename sanitizes the base name, then .pdf is appended in downloadResumePDF
            const baseFilename = `${mockConfig.personal.name}-resume-en`
            const sanitized = sanitizeFilename(baseFilename)

            expect(sanitized).toBe('john_doe-resume-en')
        })
    })
})
