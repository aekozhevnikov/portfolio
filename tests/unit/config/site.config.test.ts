import { describe, expect, it } from '@jest/globals'
import { skills, socials, email, avatar } from 'src/config/site.config'
import type { SiteConfig } from 'src/config/site.config'

describe('Site Config', () => {
    it('should export skills configuration', () => {
        expect(skills).toBeDefined()
        expect(skills.categories).toBeDefined()
        expect(Array.isArray(skills.categories)).toBe(true)
        expect(skills.categories.length).toBeGreaterThan(0)
    })

    it('should have valid skill categories', () => {
        skills.categories.forEach(category => {
            expect(category.category).toBeDefined()
            expect(category.skills).toBeDefined()
            expect(Array.isArray(category.skills)).toBe(true)
            category.skills.forEach(skill => {
                expect(skill.language).toBeDefined()
                expect(skill.icon).toBeDefined()
                expect(['original', 'wordmark']).toContain(skill.variant)
            })
        })
    })

    it('should export social links', () => {
        expect(socials).toBeDefined()
        expect(Array.isArray(socials)).toBe(true)
        expect(socials.length).toBeGreaterThan(0)
    })

    it('should have valid social link structure', () => {
        socials.forEach(social => {
            expect(social.name).toBeDefined()
            expect(social.icon).toBeDefined()
            expect(social.color).toBeDefined()
            expect(social.link).toBeDefined()
        })
    })

    it('should export email', () => {
        expect(email).toBeDefined()
        expect(typeof email).toBe('string')
        expect(email).toContain('@')
    })

    it('should export avatar URL', () => {
        expect(avatar).toBeDefined()
        expect(typeof avatar).toBe('string')
        expect(avatar).toMatch(/^https?:\/\//)
    })
})

describe('SiteConfig Type Checks', () => {
    const mockConfig: SiteConfig = {
        personal: {
            name: 'Test',
            title: 'Dev',
            location: 'Test',
            email: 'test@test.com',
            description: 'Test',
            about: 'Test',
        },
        projects: [],
        skills: { categories: [] },
    }

    it('should accept valid SiteConfig structure', () => {
        expect(mockConfig.personal).toBeDefined()
        expect(mockConfig.projects).toBeInstanceOf(Array)
        expect(mockConfig.skills).toBeDefined()
        expect(mockConfig.skills.categories).toBeInstanceOf(Array)
    })
})
