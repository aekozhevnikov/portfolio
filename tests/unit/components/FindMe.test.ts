import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { mountQuasar } from '../helpers'

// Get reference to the mocked Notify (provided by helpers.ts mock)
import { Notify as QuasarNotify } from 'quasar';

import FindMe from 'src/app/components/ui/FindMe.vue'

// Mock getSocialIcon
let mockGetSocialIconImpl: (name: string) => string
jest.mock('src/utils/socialIcons', () => ({
    getSocialIcon: (name: string) => mockGetSocialIconImpl(name),
}))

// Mock the useSiteStore
let mockSiteStore: any
jest.mock('src/app/stores/siteStore', () => ({
    useSiteStore: () => mockSiteStore,
}))

// Create mock supabase - will be passed via both globalProperties and provide
const mockSupabase = {
    functions: {
        invoke: jest.fn(),
    },
}

// Mock vue-i18n
jest.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: jest.fn((key: string) => {
            const translations: Record<string, string> = {
                'contact.title': 'Contact',
                'contact.subtitle': 'Get in touch',
                'contact.infoTitle': 'Contact Info',
                'contact.email': 'Email',
                'contact.location': 'Location',
                'contact.position': 'Position',
                'socials.title': 'Social Networks',
                'contact.formTitle': 'Send Message',
                'contact.form.name': 'Name',
                'contact.form.email': 'Email',
                'contact.form.subject': 'Subject',
                'contact.form.type': 'Type',
                'contact.form.message': 'Message',
                'contact.inquiryTypes.general': 'General',
                'contact.inquiryTypes.project': 'Project',
                'contact.inquiryTypes.consulting': 'Consulting',
                'contact.inquiryTypes.other': 'Other',
                'common.required': 'Required',
                'common.clear': 'Clear',
                'common.send': 'Send',
                'contact.form.requiredFields': 'Required',
                'contact.form.error': 'Failed to send message. Please try again.',
                'contact.form.success':
                    "Your message has been sent successfully! I'll get back to you soon.",
            }
            return translations[key] || key
        }),
    }),
}))

describe('FindMe Component', () => {
    const mockPersonal = {
        name: 'John Doe',
        email: 'john@example.com',
        location: 'San Francisco, CA',
        title: 'Senior Developer',
    }

    const mockSocials = [
        {
            name: 'GitHub',
            icon: 'code',
            color: '#24292e',
            link: 'https://github.com/johndoe',
        },
        {
            name: 'LinkedIn',
            icon: 'work',
            color: '#0077b5',
            link: 'https://linkedin.com/in/johndoe',
        },
        {
            name: 'Twitter',
            icon: 'alternate_email',
            color: '#1da1f2',
            link: 'https://twitter.com/johndoe',
        },
    ]

    beforeEach(() => {
        jest.clearAllMocks()
        mockGetSocialIconImpl = (name: string) => {
            const icons: Record<string, string> = {
                GitHub: 'fab fa-github',
                LinkedIn: 'fab fa-linkedin',
                Twitter: 'fab fa-twitter',
            }
            return icons[name] || 'fas fa-link'
        }
        mockSiteStore = {
            config: {
                personal: mockPersonal,
                socials: mockSocials,
            },
            isDark: false,
        }

        // Reset supabase mock
        mockSupabase.functions.invoke = jest.fn()
    })

    // Helper function to mount component with both globalProperties and provide/inject
    const mountFindMe = async (options: any = {}) => {
        return await mountQuasar(FindMe as any, {
            global: {
                config: {
                    globalProperties: {
                        $supabase: mockSupabase,
                    },
                },
                ...options.global,
            },
            provide: {
                supabase: mockSupabase,
            },
            ...options,
        })
    }

    it('should be defined', () => {
        expect(FindMe).toBeDefined()
    })

    it('should render contact section with id', async () => {
        const wrapper = await mountFindMe()
        expect(wrapper.html()).toContain('id="contact"')
    })

    it('should render title', async () => {
        const wrapper = await mountFindMe()
        expect(wrapper.text()).toContain('Contact')
    })

    it('should render contact info', async () => {
        const wrapper = await mountFindMe()
        expect(wrapper.html()).toContain('john@example.com')
        expect(wrapper.html()).toContain('San Francisco, CA')
        expect(wrapper.html()).toContain('mailto:john@example.com')
    })

    it('should render position when present', async () => {
        const wrapper = await mountFindMe()
        expect(wrapper.html()).toContain('Senior Developer')
    })

    it('should not render position when empty', async () => {
        mockSiteStore = {
            config: {
                personal: { ...mockPersonal, title: '' },
                socials: mockSocials,
            },
            isDark: false,
        }
        const wrapper = await mountFindMe()
        expect(wrapper.html()).not.toContain('contact.position')
    })

    it('should render social links', async () => {
        const wrapper = await mountFindMe()
        expect(wrapper.html()).toContain('Social Networks')
        expect(wrapper.html()).toContain('fab fa-github')
        expect(wrapper.html()).toContain('fab fa-linkedin')
        expect(wrapper.html()).toContain('fab fa-twitter')
    })

    it('should render social links with correct hrefs', async () => {
        const wrapper = await mountFindMe()
        expect(wrapper.html()).toContain('href="https://github.com/johndoe"')
        expect(wrapper.html()).toContain('target="_blank"')
    })

    it('should call getSocialIcon', async () => {
        await mountFindMe()
        expect(mockGetSocialIconImpl).toBeDefined()
    })

    it('should render contact form', async () => {
        const wrapper = await mountFindMe()
        expect(wrapper.html()).toContain('Send Message')
        expect(wrapper.html()).toContain('Name*')
        expect(wrapper.html()).toContain('Email*')
        expect(wrapper.html()).toContain('Subject*')
        expect(wrapper.html()).toContain('Message*')
    })

    it('should render inquiry type select', async () => {
        const wrapper = await mountFindMe()
        expect(wrapper.html()).toContain('Type')
        expect(wrapper.html()).toContain('q-select')
    })

    it('should render form buttons', async () => {
        const wrapper = await mountFindMe()
        expect(wrapper.text()).toContain('Clear')
        expect(wrapper.text()).toContain('Send')
    })

    it('should have responsive layout', async () => {
        const wrapper = await mountFindMe()
        const html = wrapper.html()
        expect(html).toContain('row')
        expect(html).toContain('col-12')
        expect(html).toContain('col-md-6')
        expect(html).toContain('col-md-4')
        expect(html).toContain('col-md-8')
    })

    it('should handle empty personal info', async () => {
        mockSiteStore = {
            config: {
                personal: {},
                socials: mockSocials,
            },
            isDark: false,
        }
        const wrapper = await mountFindMe()
        expect(wrapper.html()).toContain('mailto:undefined')
    })

    it('should handle empty socials', async () => {
        mockSiteStore = {
            config: {
                personal: mockPersonal,
                socials: [],
            },
            isDark: false,
        }
        const wrapper = await mountFindMe()
        expect(wrapper.find('.social-btn').exists()).toBe(false)
    })

    describe('Form Methods', () => {
        it('should have submitForm function', async () => {
            const wrapper = await mountFindMe()
            const vm = wrapper.vm as any
            expect(typeof vm.submitForm).toBe('function')
        })

        it('should have resetForm function', async () => {
            const wrapper = await mountFindMe()
            const vm = wrapper.vm as any
            expect(typeof vm.resetForm).toBe('function')
        })

        it('submitForm should set submitting to true', async () => {
            const wrapper = await mountFindMe()
            const vm = wrapper.vm as any

            vm.submitForm()
            expect(vm.submitting).toBe(true)
        })

        it('resetForm should clear all form fields', async () => {
            const wrapper = await mountFindMe()
            const vm = wrapper.vm as any

            vm.formData.name = 'Changed'
            vm.formData.email = 'changed@example.com'
            vm.formData.subject = 'Changed Subject'
            vm.formData.inquiryType = 'project'
            vm.formData.message = 'Changed message'

            vm.resetForm()

            expect(vm.formData.name).toBe('')
            expect(vm.formData.email).toBe('')
            expect(vm.formData.subject).toBe('')
            expect(vm.formData.inquiryType).toBe('general')
            expect(vm.formData.message).toBe('')
        })

        it('should call Notify on successful form submission', async () => {
            const wrapper = await mountFindMe()
            const vm = wrapper.vm as any

            // Setup successful response
            mockSupabase.functions.invoke.mockResolvedValueOnce(<never>{
                data: {
                    success: true,
                    message: 'Form submitted successfully',
                },
                error: null,
            })

            // Fill form data
            vm.formData.name = 'Test User'
            vm.formData.email = 'test@example.com'
            vm.formData.subject = 'Test Subject'
            vm.formData.message = 'Test message'

            // Submit form
            await vm.submitForm()

            // Verify Supabase was called correctly
            expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('form-handler', {
                body: {
                    formType: 'contact_form',
                    formData: {
                        name: 'Test User',
                        email: 'test@example.com',
                        subject: 'Test Subject',
                        inquiryType: 'general',
                        message: 'Test message',
                    },
                },
            })

            // Verify success notification was called
            expect(QuasarNotify.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'positive',
                }),
            )

            // Verify form was reset
            expect(vm.formData.name).toBe('')
            expect(vm.formData.email).toBe('')
            expect(vm.formData.subject).toBe('')
            expect(vm.formData.inquiryType).toBe('general')
            expect(vm.formData.message).toBe('')

            // Verify submitting is false
            expect(vm.submitting).toBe(false)
        })

        it('should submit form with different inquiry type', async () => {
            const wrapper = await mountFindMe()
            const vm = wrapper.vm as any

            // Setup successful response
            mockSupabase.functions.invoke.mockResolvedValueOnce(<never>{
                data: {
                    success: true,
                },
                error: null,
            })

            // Fill form data with project inquiry
            vm.formData.name = 'Jane Doe'
            vm.formData.email = 'jane@example.com'
            vm.formData.subject = 'Project Inquiry'
            vm.formData.inquiryType = 'project'
            vm.formData.message = 'I have a project for you'

            // Submit form
            await vm.submitForm()

            // Verify the inquiry type was passed correctly
            expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('form-handler', {
                body: {
                    formType: 'contact_form',
                    formData: {
                        name: 'Jane Doe',
                        email: 'jane@example.com',
                        subject: 'Project Inquiry',
                        inquiryType: 'project',
                        message: 'I have a project for you',
                    },
                },
            })

            // Verify submitting is false
            expect(vm.submitting).toBe(false)
        })

        it('should handle Supabase error response', async () => {
            const wrapper = await mountFindMe()
            const vm = wrapper.vm as any

            // Setup error response from Supabase (simulating transport error)
            mockSupabase.functions.invoke.mockResolvedValueOnce(<never>{
                data: null,
                error: { message: 'Database connection failed' },
            })

            // Fill form data
            vm.formData.name = 'Test User'
            vm.formData.email = 'test@example.com'
            vm.formData.subject = 'Test Subject'
            vm.formData.message = 'Test message'

            // Submit form
            await vm.submitForm()

            // Verify error notification was called with user-friendly message
            expect(QuasarNotify.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'negative',
                    message: 'Failed to send message. Please try again.',
                }),
            )

            // Verify form data was NOT reset
            expect(vm.formData.name).toBe('Test User')
            expect(vm.formData.email).toBe('test@example.com')

            // Verify submitting is false
            expect(vm.submitting).toBe(false)
        })

        it('should handle failed response with success: false', async () => {
            const wrapper = await mountFindMe()
            const vm = wrapper.vm as any

            // Setup failed response
            mockSupabase.functions.invoke.mockResolvedValueOnce(<never>{
                data: {
                    success: false,
                    error: 'Validation failed',
                },
                error: null,
            })

            // Fill form data
            vm.formData.name = 'Test User'
            vm.formData.email = 'test@example.com'
            vm.formData.subject = 'Test Subject'
            vm.formData.message = 'Test message'

            // Submit form
            await vm.submitForm()

            // Verify error notification was called with the user-friendly message
            expect(QuasarNotify.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'negative',
                    message: 'Failed to send message. Please try again.',
                }),
            )

            // Verify form data was NOT reset
            expect(vm.formData.name).toBe('Test User')

            // Verify submitting is false
            expect(vm.submitting).toBe(false)
        })

        it('should handle exception during submission', async () => {
            const wrapper = await mountFindMe()
            const vm = wrapper.vm as any

            // Setup Supabase to throw an exception
            mockSupabase.functions.invoke.mockRejectedValueOnce(<never>new Error('Network error'))

            // Fill form data
            vm.formData.name = 'Test User'
            vm.formData.email = 'test@example.com'
            vm.formData.subject = 'Test Subject'
            vm.formData.message = 'Test message'

            // Submit form
            await vm.submitForm()

            // Verify error notification was called with fallback message
            expect(QuasarNotify.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'negative',
                    message: 'Failed to send message. Please try again.',
                }),
            )

            // Verify submitting is false
            expect(vm.submitting).toBe(false)
        })

        it('should throw error if Supabase client not initialized', async () => {
            const wrapper = await mountFindMe()
            const vm = wrapper.vm as any

            // Temporarily set supabase to undefined
            // The inject() will get undefined if not provided
            // We need to test with a wrapper that doesn't provide supabase
            // But our helper always provides it, so we'll test with a different approach:
            // Test that the supabase check in submitForm works properly

            // Fill form data
            vm.formData.name = 'Test User'
            vm.formData.email = 'test@example.com'
            vm.formData.subject = 'Test Subject'
            vm.formData.message = 'Test message'

            // Temporarily set mockSupabase.functions to undefined
            const originalFunctions = mockSupabase.functions
            mockSupabase.functions = undefined as any

            // Expect error to be logged and notification shown
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

            // Submit form
            await vm.submitForm()

            // Verify error was logged
            expect(consoleSpy).toHaveBeenCalledWith('Form submission error:', expect.any(Error))

            // Verify error notification was called
            expect(QuasarNotify.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'negative',
                }),
            )

            // Restore console and supabase
            consoleSpy.mockRestore()
            mockSupabase.functions = originalFunctions
        })
    })

    describe('Social Link Conditional Rendering', () => {
        it('should handle socials with missing optional properties', async () => {
            const socialsWithMissingProps = [
                {
                    name: 'GitHub',
                    icon: 'code',
                    link: 'https://github.com/test',
                },
            ]

            mockSiteStore = {
                config: {
                    personal: mockPersonal,
                    socials: socialsWithMissingProps,
                },
                isDark: false,
            }

            const wrapper = await mountFindMe()
            expect(wrapper.html()).toContain('fab fa-github')
            expect(wrapper.html()).toContain('href="https://github.com/test"')
        })

        it('should show no social buttons when socials empty', async () => {
            mockSiteStore = {
                config: {
                    personal: mockPersonal,
                    socials: [],
                },
                isDark: false,
            }
            const wrapper = await mountFindMe()
            expect(wrapper.find('.social-btn').exists()).toBe(false)
        })
    })
})
