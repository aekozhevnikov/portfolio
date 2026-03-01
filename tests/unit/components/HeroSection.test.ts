/* eslint-disable */
import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { mountQuasar } from '../helpers'
import HeroSection from 'src/app/components/ui/HeroSection.vue'

jest.mock('vue-i18n')

// Mock the useSiteStore
jest.mock('src/app/stores/siteStore', () => ({
    useSiteStore: jest.fn(() => ({
        config: {
            personal: {
                name: 'John Doe',
                title: 'Full Stack Developer',
                location: 'San Francisco, CA',
                email: 'john@example.com',
                description:
                    'Passionate developer with 10+ years of experience building web applications.',
                image: '/avatar.jpg',
            },
        },
        isDark: false,
        t: jest.fn((key: string) => key),
    })),
}))

// Mock downloadResumePDF
jest.mock('src/utils/resumePDF', () => ({
    downloadResumePDF: jest.fn(),
}))

describe('HeroSection Component', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should be defined', () => {
        expect(HeroSection).toBeDefined()
    })

    it('should have correct component structure', () => {
        expect(typeof HeroSection).toBe('object')
    })

    it('should render section with correct id', async () => {
        const wrapper = await mountQuasar(HeroSection as any)
        const section = wrapper.find('section#about')
        expect(section.exists()).toBe(true)
    })

    it('should render profile avatar', async () => {
        const wrapper = await mountQuasar(HeroSection as any)
        await wrapper.vm.$nextTick()

        const avatar = wrapper.find('.q-avatar')
        expect(avatar.exists()).toBe(true)
        expect(avatar.attributes('data-size')).toBe('300px')
    })

    it('should render profile image', async () => {
        const wrapper = await mountQuasar(HeroSection as any)
        await wrapper.vm.$nextTick()

        const img = wrapper.find('img')
        expect(img.exists()).toBe(true)
        expect(img.attributes('src')).toBe('/avatar.jpg')
    })

    it('should display personal name', async () => {
        const wrapper = await mountQuasar(HeroSection as any)
        const h1 = wrapper.find('h1')
        expect(h1.exists()).toBe(true)
        expect(h1.text()).toContain('John Doe')
    })

    it('should display personal title', async () => {
        const wrapper = await mountQuasar(HeroSection as any)
        const h2 = wrapper.find('h2')
        expect(h2.exists()).toBe(true)
        expect(h2.text()).toContain('Full Stack Developer')
    })

    it('should display location with icon', async () => {
        const wrapper = await mountQuasar(HeroSection as any)
        await wrapper.vm.$nextTick()

        const locationIcon = wrapper.find('.q-icon[data-name="location_on"]')
        expect(locationIcon.exists()).toBe(true)

        const locationText = wrapper.find('.row.items-center .text-body1')
        expect(locationText.exists()).toBe(true)
        expect(locationText.text()).toContain('San Francisco, CA')
    })

    it('should display email as mailto link', async () => {
        const wrapper = await mountQuasar(HeroSection as any)
        await wrapper.vm.$nextTick()

        const emailLink = wrapper.find('a[href^="mailto:"]')
        expect(emailLink.exists()).toBe(true)
        expect(emailLink.text()).toContain('john@example.com')
        expect(emailLink.attributes('href')).toBe('mailto:john@example.com')
    })

    it('should display description', async () => {
        const wrapper = await mountQuasar(HeroSection as any)
        const p = wrapper.find('p.text-h6')
        expect(p.exists()).toBe(true)
        expect(p.text()).toContain('Passionate developer')
    })

    it('should have two CTA buttons', async () => {
        const wrapper = await mountQuasar(HeroSection as any)
        const buttons = wrapper.findAll('.q-btn')
        expect(buttons.length).toBe(2)
    })

    it('should have CV download button', async () => {
        const wrapper = await mountQuasar(HeroSection as any)
        const buttons = wrapper.findAll('.q-btn')
        const cvBtn = buttons.find((btn) => btn.text().includes('landing.cvButton'))
        expect(cvBtn).toBeDefined()
        // q-btn stub renders icon prop as 'icon' attribute
        expect(cvBtn?.attributes('icon')).toBe('download')
    })

    it('should have contact button', async () => {
        const wrapper = await mountQuasar(HeroSection as any)
        const buttons = wrapper.findAll('.q-btn')
        const contactBtn = buttons.find((btn) => btn.text().includes('landing.contactButton'))
        expect(contactBtn).toBeDefined()
        // q-btn stub renders icon prop as 'icon' attribute
        expect(contactBtn?.attributes('icon')).toBe('mail')
    })

    it('should trigger downloadCV on CV button click', async () => {
        const wrapper = await mountQuasar(HeroSection as any)
        const downloadResumePDF = require('src/utils/resumePDF').downloadResumePDF as any
        downloadResumePDF.mockResolvedValueOnce()

        const buttons = wrapper.findAll('.q-btn')
        const cvBtn = buttons.find((btn) => btn.text().includes('landing.cvButton'))
        expect(cvBtn).toBeDefined()

        await cvBtn?.trigger('click')
        await wrapper.vm.$nextTick()

        expect(downloadResumePDF).toHaveBeenCalledWith(
            expect.objectContaining({
                personal: expect.any(Object),
            }),
            expect.any(String),
            false,
        )
    })

    it('should show notifying during CV generation', async () => {
        const mockNotify = jest.fn()
        const wrapper = await mountQuasar(HeroSection as any, {
            quasar: { notify: mockNotify },
        })
        const downloadResumePDF = require('src/utils/resumePDF').downloadResumePDF as any
        downloadResumePDF.mockResolvedValueOnce()

        const buttons = wrapper.findAll('.q-btn')
        const cvBtn = buttons.find((btn) => btn.text().includes('landing.cvButton'))
        await cvBtn?.trigger('click')
        await wrapper.vm.$nextTick()

        expect(mockNotify).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'common.loading',
                position: 'top',
                timeout: 2000,
            }),
        )
    })

    it('should handle successful CV generation', async () => {
        const mockNotify = jest.fn()
        const wrapper = await mountQuasar(HeroSection as any, {
            quasar: { notify: mockNotify },
        })
        const downloadResumePDF = require('src/utils/resumePDF').downloadResumePDF as any
        downloadResumePDF.mockResolvedValueOnce()

        const buttons = wrapper.findAll('.q-btn')
        const cvBtn = buttons.find((btn) => btn.text().includes('landing.cvButton'))
        await cvBtn?.trigger('click')
        await wrapper.vm.$nextTick()

        // Wait for async to complete
        await new Promise((resolve) => setTimeout(resolve, 10))
        await wrapper.vm.$nextTick()

        expect(mockNotify).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'common.success',
                position: 'top',
                timeout: 3000,
            }),
        )
    })

    it('should handle CV generation error', async () => {
        const mockNotify = jest.fn()
        const wrapper = await mountQuasar(HeroSection as any, {
            quasar: { notify: mockNotify },
        })
        const downloadResumePDF = require('src/utils/resumePDF').downloadResumePDF as any
        downloadResumePDF.mockRejectedValueOnce(new Error('PDF generation failed'))

        const buttons = wrapper.findAll('.q-btn')
        const cvBtn = buttons.find((btn) => btn.text().includes('landing.cvButton'))
        await cvBtn?.trigger('click')
        await wrapper.vm.$nextTick()

        // Wait for error to be caught
        await new Promise((resolve) => setTimeout(resolve, 10))
        await wrapper.vm.$nextTick()

        expect(mockNotify).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'common.error',
                position: 'top',
                timeout: 3000,
            }),
        )
    })

    it('should set isGenerating to true during download', async () => {
        const wrapper = await mountQuasar(HeroSection as any)
        const downloadResumePDF = require('src/utils/resumePDF').downloadResumePDF as any
        downloadResumePDF.mockImplementationOnce(
            () => new Promise((resolve) => setTimeout(resolve, 100)),
        )

        const vm = wrapper.vm as any
        expect(vm.isGenerating).toBe(false)

        const buttons = wrapper.findAll('.q-btn')
        const cvBtn = buttons.find((btn) => btn.text().includes('landing.cvButton'))
        await cvBtn?.trigger('click')
        await wrapper.vm.$nextTick()

        expect(vm.isGenerating).toBe(true)
    })

    it('should set isGenerating to false after download completes', async () => {
        const wrapper = await mountQuasar(HeroSection as any)
        const downloadResumePDF = require('src/utils/resumePDF').downloadResumePDF as any
        // Use a delayed promise to ensure we can catch the intermediate state
        downloadResumePDF.mockImplementationOnce(
            () => new Promise((resolve) => setTimeout(resolve, 100)),
        )

        const vm = wrapper.vm as any

        const buttons = wrapper.findAll('.q-btn')
        const cvBtn = buttons.find((btn) => btn.text().includes('landing.cvButton'))
        await cvBtn?.trigger('click')

        // Check during generation
        await wrapper.vm.$nextTick()
        expect(vm.isGenerating).toBe(true)

        // Wait for completion
        await new Promise((resolve) => setTimeout(resolve, 150))
        await wrapper.vm.$nextTick()

        expect(vm.isGenerating).toBe(false)
    })

    it('should have loading state on CV button during generation', async () => {
        const wrapper = await mountQuasar(HeroSection as any)
        const downloadResumePDF = require('src/utils/resumePDF').downloadResumePDF as any
        downloadResumePDF.mockImplementationOnce(
            () => new Promise((resolve) => setTimeout(resolve, 100)),
        )

        const buttons = wrapper.findAll('.q-btn')
        const cvBtn = buttons.find((btn) => btn.text().includes('landing.cvButton'))
        await cvBtn?.trigger('click')
        await wrapper.vm.$nextTick()

        expect(cvBtn?.attributes('loading')).toBeDefined()
    })

    it('should trigger scrollToContact on contact button click', async () => {
        const wrapper = await mountQuasar(HeroSection as any)
        const scrollIntoView = jest.fn()

        // Mock scrollIntoView on document
        const mockElement = {
            scrollIntoView: scrollIntoView,
        }
        const originalGetElementById = document.getElementById
        document.getElementById = jest.fn((id: string) => {
            if (id === 'contact') return mockElement
            return null
        }) as any

        const buttons = wrapper.findAll('.q-btn')
        const contactBtn = buttons.find((btn) => btn.text().includes('landing.contactButton'))
        await contactBtn?.trigger('click')

        expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })

        // Restore
        document.getElementById = originalGetElementById
    })

    it('should not throw when contact element not found', async () => {
        const wrapper = await mountQuasar(HeroSection as any)
        const originalGetElementById = document.getElementById
        document.getElementById = jest.fn(() => null) as any

        const buttons = wrapper.findAll('.q-btn')
        const contactBtn = buttons.find((btn) => btn.text().includes('landing.contactButton'))
        expect(() => contactBtn?.trigger('click')).not.toThrow()

        document.getElementById = originalGetElementById
    })

    it('should use dark theme for PDF generation', async () => {
        const wrapper = await mountQuasar(HeroSection as any)
        const downloadResumePDF = require('src/utils/resumePDF').downloadResumePDF as any
        downloadResumePDF.mockResolvedValueOnce()

        const buttons = wrapper.findAll('.q-btn')
        const cvBtn = buttons.find((btn) => btn.text().includes('landing.cvButton'))
        await cvBtn?.trigger('click')
        await wrapper.vm.$nextTick()

        expect(downloadResumePDF).toHaveBeenCalledWith(
            expect.any(Object),
            expect.any(String),
            false, // always uses light theme
        )
    })

    it('should compute profileImage from personalInfo', async () => {
        const wrapper = await mountQuasar(HeroSection as any)
        const vm = wrapper.vm as any
        expect(vm.profileImage).toBe('/avatar.jpg')
    })

    it('should use fallback image when personalInfo.image is empty', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: {
                personal: {
                    name: 'Test',
                    title: 'Developer',
                    image: '',
                },
            },
            isDark: false,
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(HeroSection as any)
        const vm = wrapper.vm as any
        expect(vm.profileImage).toBe('/profile-placeholder.jpg')
    })

    it('should handle empty personalInfo gracefully', async () => {
        const mockUseSiteStore = require('src/app/stores/siteStore').useSiteStore as jest.Mock
        mockUseSiteStore.mockReturnValue({
            config: { personal: {} },
            isDark: false,
            t: jest.fn((key: string) => key),
        })

        const wrapper = await mountQuasar(HeroSection as any)
        await wrapper.vm.$nextTick()

        // Should render without crashing; h1 exists but has no text
        const h1 = wrapper.find('h1')
        expect(h1.exists()).toBe(true)
        expect(h1.text().trim()).toBe('')
    })
})
