import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { mountQuasar } from '../helpers'
import ReviewsSection from 'src/app/components/ui/ReviewsSection.vue'

jest.mock('vue-i18n')

// Mock the useSiteStore with reviews data
jest.mock('src/app/stores/siteStore', () => ({
    useSiteStore: jest.fn(() => ({
        config: {
            reviews: [
                {
                    name: 'John Doe',
                    testimony: 'Excellent work on our project. Highly recommended!',
                    position: 'CTO',
                    initials: 'JD',
                },
                {
                    name: 'Jane Smith',
                    testimony: 'Great communication and delivery.',
                    testimony2: 'The team was professional throughout.',
                    position: 'Product Manager',
                    initials: 'JS',
                },
                {
                    name: 'Bob Johnson',
                    testimony: 'Outstanding quality and attention to detail.',
                    position: 'CEO',
                    initials: 'BJ',
                },
            ],
        },
    })),
}))

// Mock Quasar components
jest.mock('quasar', () => ({
    QCard: {
        name: 'QCard',
    },
    QCardSection: {
        name: 'QCardSection',
    },
    QAvatar: {
        name: 'QAvatar',
    },
    QIcon: {
        name: 'QIcon',
    },
    QCarousel: {
        name: 'QCarousel',
    },
    QCarouselSlide: {
        name: 'QCarouselSlide',
    },
}))

describe('ReviewsSection Component', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should be defined', () => {
        expect(ReviewsSection).toBeDefined()
    })

    it('should have correct component structure', () => {
        expect(typeof ReviewsSection).toBe('object')
    })

    it('should render section with correct id', async () => {
        const wrapper = await mountQuasar(ReviewsSection as any)
        const html = wrapper.html()
        expect(html).toContain('id="reviews"')
    })

    it('should render title', async () => {
        const wrapper = await mountQuasar(ReviewsSection as any)
        const html = wrapper.html()
        expect(html).toContain('reviews.title')
    })

    it('should render review cards', async () => {
        const wrapper = await mountQuasar(ReviewsSection as any)
        const html = wrapper.html()
        expect(html).toContain('John Doe')
        expect(html).toContain('Jane Smith')
        expect(html).toContain('Bob Johnson')
    })

    it('should display testimonies', async () => {
        const wrapper = await mountQuasar(ReviewsSection as any)
        const html = wrapper.html()
        expect(html).toContain('Excellent work')
        expect(html).toContain('Great communication')
    })

    it('should display positions', async () => {
        const wrapper = await mountQuasar(ReviewsSection as any)
        const html = wrapper.html()
        expect(html).toContain('CTO')
        expect(html).toContain('Product Manager')
        expect(html).toContain('CEO')
    })

})
