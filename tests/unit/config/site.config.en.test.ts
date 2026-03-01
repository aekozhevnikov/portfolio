import { describe, expect, it } from '@jest/globals'
import { defaultSiteConfigEn } from 'src/config/site.config.en'

describe('English Site Config', () => {
    it('should have personal information', () => {
        expect(defaultSiteConfigEn.personal).toBeDefined()
        expect(defaultSiteConfigEn.personal.name).toBe('Anton Kozhevnikov')
        expect(defaultSiteConfigEn.personal.title).toBe('Full Stack Developer')
        expect(defaultSiteConfigEn.personal.location).toBeDefined()
        expect(defaultSiteConfigEn.personal.email).toBeDefined()
        expect(defaultSiteConfigEn.personal.description).toBeDefined()
        expect(defaultSiteConfigEn.personal.about).toBeDefined()
    })

    it('should have projects', () => {
        expect(defaultSiteConfigEn.projects).toBeDefined()
        expect(Array.isArray(defaultSiteConfigEn.projects)).toBe(true)
        expect(defaultSiteConfigEn.projects.length).toBeGreaterThan(0)

        defaultSiteConfigEn.projects.forEach((project) => {
            expect(project.id).toBeDefined()
            expect(project.title).toBeDefined()
            expect(project.description).toBeDefined()
            expect(project.technologies).toBeDefined()
            expect(project.order).toBeDefined()
        })
    })

    it('should have skills categories', () => {
        expect(defaultSiteConfigEn.skills).toBeDefined()
        expect(defaultSiteConfigEn.skills.categories).toBeDefined()
        expect(Array.isArray(defaultSiteConfigEn.skills.categories)).toBe(true)
        expect(defaultSiteConfigEn.skills.categories.length).toBeGreaterThan(0)
    })

    it('should have social links', () => {
        expect(defaultSiteConfigEn.socials).toBeDefined()
        expect(Array.isArray(defaultSiteConfigEn.socials)).toBe(true)
        expect(defaultSiteConfigEn.socials?.length).toBeGreaterThan(0)
    })

    it('should have services', () => {
        expect(defaultSiteConfigEn.services).toBeDefined()
        expect(Array.isArray(defaultSiteConfigEn.services)).toBe(true)
        defaultSiteConfigEn.services?.forEach((service) => {
            expect(service.title).toBeDefined()
            expect(service.description).toBeDefined()
            expect(service.icon).toBeDefined()
            expect(service.color).toBeDefined()
        })
    })
})
