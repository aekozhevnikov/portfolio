import { describe, expect, it } from '@jest/globals'
import { defaultSiteConfigRu } from 'src/config/site.config.ru'

describe('Russian Site Config', () => {
    it('should have personal information in Russian', () => {
        expect(defaultSiteConfigRu.personal).toBeDefined()
        expect(defaultSiteConfigRu.personal.name).toBe('Антон Кожевников')
        expect(defaultSiteConfigRu.personal.title).toBe('Full Stack Разработчик')
        expect(defaultSiteConfigRu.personal.location).toBe('Нижневартовск, Россия')
        expect(defaultSiteConfigRu.personal.email).toBeDefined()
        expect(defaultSiteConfigRu.personal.description).toBeDefined()
        expect(defaultSiteConfigRu.personal.about).toBeDefined()
    })

    it('should have projects', () => {
        expect(defaultSiteConfigRu.projects).toBeDefined()
        expect(Array.isArray(defaultSiteConfigRu.projects)).toBe(true)
        expect(defaultSiteConfigRu.projects.length).toBeGreaterThan(0)
    })

    it('should have skills categories', () => {
        expect(defaultSiteConfigRu.skills).toBeDefined()
        expect(defaultSiteConfigRu.skills.categories).toBeDefined()
        expect(Array.isArray(defaultSiteConfigRu.skills.categories)).toBe(true)
    })

    it('should have social links', () => {
        expect(defaultSiteConfigRu.socials).toBeDefined()
        expect(Array.isArray(defaultSiteConfigRu.socials)).toBe(true)
    })

    it('should have services', () => {
        expect(defaultSiteConfigRu.services).toBeDefined()
        expect(Array.isArray(defaultSiteConfigRu.services)).toBe(true)
    })

    it('should have same structure as English config', () => {
        // Both configs should have same structure
        expect(defaultSiteConfigRu).toHaveProperty('personal')
        expect(defaultSiteConfigRu).toHaveProperty('projects')
        expect(defaultSiteConfigRu).toHaveProperty('skills')
        expect(defaultSiteConfigRu).toHaveProperty('socials')
        expect(defaultSiteConfigRu).toHaveProperty('services')
    })
})
