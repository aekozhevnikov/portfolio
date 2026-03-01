import { describe, expect, it } from '@jest/globals'
import { theme } from 'src/config/theme.config'

describe('Theme Config', () => {
    it('should export primary colors', () => {
        expect(theme.primary).toBeDefined()
        expect(theme.primaryLight).toBeDefined()
        expect(theme.primaryDark).toBeDefined()
    })

    it('should export secondary colors', () => {
        expect(theme.secondary).toBeDefined()
        expect(theme.secondaryLight).toBeDefined()
        expect(theme.secondaryDark).toBeDefined()
    })

    it('should export accent colors', () => {
        expect(theme.accent).toBeDefined()
        expect(theme.accentLight).toBeDefined()
        expect(theme.accentDark).toBeDefined()
    })

    it('should export semantic colors', () => {
        expect(theme.positive).toBeDefined()
        expect(theme.negative).toBeDefined()
        expect(theme.warning).toBeDefined()
        expect(theme.info).toBeDefined()
    })

    it('should export neutral colors', () => {
        expect(theme.dark).toBeDefined()
        expect(theme.light).toBeDefined()
        expect(theme.darkPage).toBeDefined()
        expect(theme.lightPage).toBeDefined()
    })

    it('should export gradients', () => {
        expect(theme.heroGradientStart).toBeDefined()
        expect(theme.heroGradientEnd).toBeDefined()
        expect(theme.darkHeroGradientStart).toBeDefined()
        expect(theme.darkHeroGradientEnd).toBeDefined()
    })

    it('should export border colors', () => {
        expect(theme.border).toBeDefined()
        expect(theme.borderDark).toBeDefined()
    })

    it('should have valid hex color format', () => {
        const hexColorRegex = /^#[0-9a-fA-F]{6}$/
        expect(theme.primary).toMatch(hexColorRegex)
        expect(theme.secondary).toMatch(hexColorRegex)
        expect(theme.accent).toMatch(hexColorRegex)
    })
})
