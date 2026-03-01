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
        getBlob: jest.fn().mockResolvedValue(new Blob() as never),
        getDataUrl: jest.fn().mockResolvedValue('data:application/pdf;base64,...' as never),
    })

    return {
        __esModule: true,
        default: {
            createPdf: mockCreatePdf,
            vfs: {},
        },
        createPdf: mockCreatePdf,
    }
})

describe('resumePDF utility', () => {
    const createMockConfig = (overrides: Partial<SiteConfig> = {}): SiteConfig => {
        const base: SiteConfig = {
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
                        backend: [
                            { language: 'TypeScript', icon: 'typescript', variant: 'original' },
                        ],
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

        const config: SiteConfig = { ...base }

        if (overrides.personal !== undefined) {
            config.personal = { ...base.personal, ...overrides.personal }
        }

        if (overrides.projects !== undefined) {
            config.projects = overrides.projects
        }

        if (overrides.skills !== undefined) {
            config.skills = { ...base.skills }
            if (overrides.skills.categories !== undefined) {
                config.skills.categories = overrides.skills.categories
            }
        }

        if (overrides.services !== undefined) {
            config.services = overrides.services
        }

        if (overrides.socials !== undefined) {
            config.socials = overrides.socials
        }

        if (overrides.reviews !== undefined) {
            config.reviews = overrides.reviews
        }

        return config
    }

    describe('sanitizeFilename', () => {
        it('should convert name to lowercase', () => {
            const result = sanitizeFilename('John Doe')
            expect(result).toBe('john_doe')
        })

        it('should replace invalid characters with underscore', () => {
            expect(sanitizeFilename('John@Doe#123')).toBe('john_doe_123')
            expect(sanitizeFilename('File Name with spaces')).toBe('file_name_with_spaces')
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

        it('should handle mixed English and Russian', () => {
            const result = sanitizeFilename('JohnАнтонTest')
            expect(result).toBe('johnантонtest')
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

        it('should have all required fields', () => {
            const en = getResumeTranslations('en')
            const ru = getResumeTranslations('ru')

            ;['about', 'skills', 'projects', 'services', 'social'].forEach((field) => {
                expect(en).toHaveProperty(field)
                expect(ru).toHaveProperty(field)
                expect(typeof en[field as keyof typeof en]).toBe('string')
                expect(typeof ru[field as keyof typeof ru]).toBe('string')
            })
        })
    })

    describe('buildPDFDocument', () => {
        it('should create a valid document definition', () => {
            const config = createMockConfig()
            const result = buildPDFDocument(config, 'en', false)

            expect(result).toHaveProperty('pageSize', 'A4')
            expect(result).toHaveProperty('pageOrientation', 'portrait')
            expect(result).toHaveProperty('pageMargins')
            expect(result).toHaveProperty('defaultStyle')
            expect(result).toHaveProperty('content')
            expect(result).toHaveProperty('styles')
            expect(Array.isArray(result.content)).toBe(true)
        })

        it('should use correct colors for light theme', () => {
            const config = createMockConfig()
            const result = buildPDFDocument(config, 'en', false)

            expect(result.defaultStyle.color).toBe('#0a0a0a')
            expect(result.pageColor).toBe('#ffffff')
            expect(result.styles.name.color).toBe('#0a0a0a')
        })

        it('should use correct colors for dark theme', () => {
            const config = createMockConfig()
            const result = buildPDFDocument(config, 'en', true)

            expect(result.defaultStyle.color).toBe('#ffffff')
            expect(result.pageColor).toBe('#0a0a0a')
            expect(result.styles.name.color).toBe('#ffffff')
        })

        it('should include personal info in header', () => {
            const config = createMockConfig()
            const result = buildPDFDocument(config, 'en', false)
            const content = result.content as any[]

            const headerSection = content.find((item) => item.columns && item.columns[0]?.stack)
            expect(headerSection).toBeDefined()

            const nameCell = headerSection.columns[0].stack.find((s: any) => s.text === 'John Doe')
            expect(nameCell).toBeDefined()
        })

        it('should display about section when personal.about exists', () => {
            const config = createMockConfig()
            const result = buildPDFDocument(config, 'en', false)
            const content = result.content as any[]

            const aboutSection = content.find((item) => item.text === 'About Me')
            expect(aboutSection).toBeDefined()

            const aboutText = content.find((item) => item.text === 'Test about me content')
            expect(aboutText).toBeDefined()
        })

        it('should hide about section when personal.about is missing', () => {
            const config = createMockConfig({
                personal: {
                    name: 'John',
                    title: 'Developer',
                    location: 'New York, NY',
                    email: 'john@example.com',
                    description: 'Test description',
                    about: '',
                },
            })
            const result = buildPDFDocument(config, 'en', false)
            const content = result.content as any[]

            const aboutSection = content.find((item) => item.text === 'About Me')
            expect(aboutSection).toBeUndefined()
        })

        it('should display skills section with categories', () => {
            const config = createMockConfig()
            const result = buildPDFDocument(config, 'en', false)
            const content = result.content as any[]

            const skillsSection = content.find((item) => item.text === 'Skills')
            expect(skillsSection).toBeDefined()

            // Check that category title appears
            const hasCategory = content.some((item) =>
                item.columns?.some((col: any) =>
                    col.stack?.some((s: any) => s.text === 'Frontend'),
                ),
            )
            expect(hasCategory).toBe(true)

            // Check that skill items appear
            const hasSkills = content.some((item) =>
                item.stack?.some((s: any) => s.text === 'Vue.js'),
            )
            expect(hasSkills).toBe(true)
        })

        it('should display projects with technologies and links', () => {
            const config = createMockConfig()
            const result = buildPDFDocument(config, 'en', false)
            const content = result.content as any[]

            const projectsSection = content.find((item) => item.text === 'Projects')
            expect(projectsSection).toBeDefined()

            // Check project title
            const hasProjectTitle = content.some((item) => item.text === 'Test Project')
            expect(hasProjectTitle).toBe(true)

            // Check technology tags (Vue.js, TypeScript)
            const hasVue = content.some((item) => item.stack?.some((s: any) => s.text === 'Vue.js'))
            const hasTypeScript = content.some((item) =>
                item.stack?.some((s: any) => s.text === 'TypeScript'),
            )
            expect(hasVue).toBe(true)
            expect(hasTypeScript).toBe(true)
        })

        it('should include project highlights as list', () => {
            const config = createMockConfig()
            const result = buildPDFDocument(config, 'en', false)
            const content = result.content as any[]

            const hasHighlights = content.some((item) =>
                item.ul?.some((li: any) => li.text === 'Feature 1'),
            )
            expect(hasHighlights).toBe(true)
        })

        it('should display services as table', () => {
            const config = createMockConfig()
            const result = buildPDFDocument(config, 'en', false)
            const content = result.content as any[]

            const servicesTitleIndex = content.findIndex((item) => item.text === 'Services')
            expect(servicesTitleIndex).toBeGreaterThan(-1)
            const servicesTable = content[servicesTitleIndex + 1]!
            expect(servicesTable).toBeDefined()
            expect(servicesTable.table).toBeDefined()
        })

        it('should format social links correctly', () => {
            const config = createMockConfig()
            const result = buildPDFDocument(config, 'en', false)
            const content = result.content as any[]

            const socialSection = content.find((item) => item.text === 'Social Links')
            expect(socialSection).toBeDefined()

            // Check that mailto links are displayed without mailto: prefix
            const hasMailtoDisplay = content.some((item) =>
                item.ul?.some((li: any) => li.text.includes('john@example.com')),
            )
            expect(hasMailtoDisplay).toBe(true)
        })

        it('should use translated text based on locale', () => {
            const config = createMockConfig()
            const enResult = buildPDFDocument(config, 'en', false)
            const ruResult = buildPDFDocument(config, 'ru', false)

            const enContent = enResult.content as any[]
            const ruContent = ruResult.content as any[]

            expect(enContent.some((item) => item.text === 'About Me')).toBe(true)
            expect(ruContent.some((item) => item.text === 'Обо мне')).toBe(true)
        })

        it('should handle missing optional sections gracefully', () => {
            const config = createMockConfig({
                projects: [],
                skills: { categories: [] },
                services: [],
                socials: [],
            })
            const result = buildPDFDocument(config, 'en', false)
            const content = result.content as any[]

            // Should still have header and personal info
            expect(content.some((item) => item.columns)).toBe(true)
            // Should not have sections with no data
            expect(content.some((item) => item.text === 'Projects')).toBe(false)
            expect(content.some((item) => item.text === 'Skills')).toBe(false)
        })
    })

    describe('downloadResumePDF', () => {
        it('should call pdfMake.createPdf with document definition', async () => {
            const config = createMockConfig()

            await downloadResumePDF(config, 'en', false)

            expect(pdfMake.createPdf).toHaveBeenCalledTimes(1)
            const docDefinition = (pdfMake.createPdf as jest.Mock).mock.calls[0]?.[0]
            expect(docDefinition).toHaveProperty('content')
            expect(docDefinition).toHaveProperty('pageSize', 'A4')
        })

        it('should generate correct filename', async () => {
            const config = createMockConfig()
            const mockDownload = jest.fn()
            const mockPdfInstance = {
                download: mockDownload,
                open: jest.fn(),
                print: jest.fn(),
                getBlob: jest.fn().mockResolvedValue(new Blob() as never),
                getDataUrl: jest.fn().mockResolvedValue('data:application/pdf;base64,...' as never),
            }
            ;(pdfMake.createPdf as jest.Mock).mockReturnValue(mockPdfInstance)

            await downloadResumePDF(config, 'en', false)

            // download() is called with filename as single argument
            expect(mockDownload).toHaveBeenCalledWith('john_doe-resume-en.pdf')
        })

        it('should handle Russian locale in filename', async () => {
            const config = createMockConfig()
            const mockDownload = jest.fn()
            const mockPdfInstance = {
                download: mockDownload,
                open: jest.fn(),
                print: jest.fn(),
                getBlob: jest.fn().mockResolvedValue(new Blob() as never),
                getDataUrl: jest.fn().mockResolvedValue('data:application/pdf;base64,...' as never),
            }
            ;(pdfMake.createPdf as jest.Mock).mockReturnValue(mockPdfInstance)

            await downloadResumePDF(config, 'ru', false)

            expect(mockDownload).toHaveBeenCalledWith('john_doe-resume-ru.pdf')
        })

        it('should sanitize filename', async () => {
            const config = createMockConfig({
                personal: {
                    name: 'John Doe & Co',
                    title: 'Developer',
                    location: 'New York, NY',
                    email: 'john@example.com',
                    description: 'Test description',
                    about: 'Test about me',
                },
            })
            const mockDownload = jest.fn()
            const mockPdfInstance = {
                download: mockDownload,
                open: jest.fn(),
                print: jest.fn(),
                getBlob: jest.fn().mockResolvedValue(new Blob() as never),
                getDataUrl: jest.fn().mockResolvedValue('data:application/pdf;base64,...' as never),
            }
            ;(pdfMake.createPdf as jest.Mock).mockReturnValue(mockPdfInstance)

            await downloadResumePDF(config, 'en', false)

            // "John Doe & Co" -> "john doe & co" -> "john_doe___co"
            expect(mockDownload).toHaveBeenCalledWith('john_doe___co-resume-en.pdf')
        })
    })
})
