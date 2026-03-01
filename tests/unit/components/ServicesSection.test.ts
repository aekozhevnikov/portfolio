/* eslint-disable */
import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { mountQuasar } from '../helpers'
import ServicesSection from 'src/app/components/ui/ServicesSection.vue'
import type { Service } from 'src/config/site.config'
import { afterEach } from 'node:test'

// Mock the useSiteStore
let mockSiteStore: any
jest.mock('src/app/stores/siteStore', () => ({
    useSiteStore: () => mockSiteStore,
}))

// Mock vue-i18n
jest.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: jest.fn((key: string) => {
            const translations: Record<string, string> = {
                'services.title': 'Services',
                'services.subtitle': 'What I can do',
                'services.request': 'Request',
                'services.requestTitle': 'Request Service',
                'services.requestFor': 'For',
                'services.form.name': 'Name',
                'services.form.email': 'Email',
                'services.form.company': 'Company',
                'services.form.budget': 'Budget',
                'services.form.timeline': 'Timeline',
                'services.form.message': 'Message',
                'services.form.required': 'Required',
                'services.form.invalidEmail': 'Invalid',
                'services.budgetOptions.small': 'Small',
                'services.budgetOptions.medium': 'Medium',
                'services.budgetOptions.large': 'Large',
                'services.budgetOptions.custom': 'Custom',
                'services.timelineOptions.asap': 'ASAP',
                'services.timelineOptions.weeks': 'Weeks',
                'services.timelineOptions.months': 'Months',
                'services.timelineOptions.flexible': 'Flexible',
                'services.requestSent': 'Sent!',
                'services.requestError': 'Request error',
                'common.cancel': 'Cancel',
                'common.submit': 'Submit',
            }
            return translations[key] || key
        }),
    }),
}))

describe('ServicesSection Component', () => {
    const mockServices: Service[] = [
        { title: 'A', description: 'Desc A', icon: 'icon1', color: '#111' },
        { title: 'B', description: 'Desc B', icon: 'icon2' }, // Without color
    ]

    // Create mock supabase
    const mockSupabase = {
        functions: {
            invoke: jest.fn(),
        },
    }

    beforeEach(() => {
        jest.clearAllMocks()
        mockSiteStore = {
            config: {
                services: mockServices,
            },
            isDark: false,
        }
    })

    afterEach(() => {
        // Clean up if needed
    })

    it('should be defined', () => {
        expect(ServicesSection).toBeDefined()
    })

    describe('Rendering', () => {
        it('should render section structure', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            expect(wrapper.find('section').exists()).toBe(true)
            expect(wrapper.find('.services-section').exists()).toBe(true)
        })

        it('should render title and subtitle with translations', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            expect(wrapper.text()).toContain('Services')
            expect(wrapper.text()).toContain('What I can do')
        })

        it('should render all service cards', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            mockServices.forEach((service) => {
                expect(wrapper.text()).toContain(service.title)
            })
        })

        it('should render service icons with data-name attributes', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            expect(wrapper.html()).toContain('data-name="icon1"')
            expect(wrapper.html()).toContain('data-name="icon2"')
        })

        it('should render service descriptions', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            expect(wrapper.text()).toContain('Desc A')
            expect(wrapper.text()).toContain('Desc B')
        })

        it('should render request buttons', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            const buttons = wrapper.findAll('.q-btn')
            const requestBtns = buttons.filter((el) => el.text().includes('Request'))
            expect(requestBtns.length).toBe(2)
        })

        it('should render service cards with service color or fallback to primary', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            expect(wrapper.html()).toContain('color="#111"') // First service has color
            expect(wrapper.html()).toContain('color="primary"') // Second falls back
        })

        it('should render dialog structure', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            expect(wrapper.find('.q-dialog').exists()).toBe(true)
            expect(wrapper.find('.service-request-dialog').exists()).toBe(true)
            expect(wrapper.find('.q-toolbar').exists()).toBe(true)
            expect(wrapper.find('.q-card-section').exists()).toBe(true)
        })

        it('should render dialog title with fallback', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            expect(wrapper.html()).toContain('Request Service')
        })

        it('should render selected service placeholder in dialog', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            expect(wrapper.html()).toContain('For:')
        })

        it('should render all form fields', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            expect(wrapper.html()).toContain('label="Name*"')
            expect(wrapper.html()).toContain('label="Email*"')
            expect(wrapper.html()).toContain('label="Company"')
            expect(wrapper.html()).toContain('label="Budget"')
            expect(wrapper.html()).toContain('label="Timeline"')
            expect(wrapper.html()).toContain('label="Message*"')
        })

        it('should render q-select for budget and timeline', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            const selects = wrapper.findAll('.q-select')
            expect(selects.length).toBe(2)
        })

        it('should render textarea for message', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            expect(wrapper.html()).toContain('type="textarea"')
            expect(wrapper.html()).toContain('rows="5"')
        })

        it('should render cancel and submit buttons', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            expect(wrapper.text()).toContain('Cancel')
            expect(wrapper.text()).toContain('Submit')
        })

        it('should have submit button with type="submit"', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            expect(wrapper.html()).toContain('type="submit"')
        })

        it('should have responsive grid classes', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            expect(wrapper.html()).toContain('row')
            expect(wrapper.html()).toContain('col-12')
            expect(wrapper.html()).toContain('col-md-6')
            expect(wrapper.html()).toContain('col-md-3')
        })
    })

    describe('Empty States', () => {
        it('should handle undefined services (v-for empty)', async () => {
            mockSiteStore = {
                config: {
                    services: undefined,
                },
                isDark: false,
            }
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            expect(wrapper.findAll('.service-card').length).toBe(0)
        })

        it('should handle empty services array', async () => {
            mockSiteStore = {
                config: {
                    services: [],
                },
                isDark: false,
            }
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            expect(wrapper.findAll('.service-card').length).toBe(0)
        })
    })

    describe('Computed Properties', () => {
        it('should compute services from siteStore.config.services', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            const vm = wrapper.vm as any
            expect(vm.services).toEqual(mockServices)
        })

        it('should compute services as empty array when config.services is nullish', async () => {
            mockSiteStore = {
                config: {
                    services: null,
                },
                isDark: false,
            }
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            const vm = wrapper.vm as any
            expect(vm.services).toEqual([])
        })

        it('should compute budgetOptions from translations', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            const vm = wrapper.vm as any
            expect(vm.budgetOptions).toHaveLength(4)
            expect(vm.budgetOptions[0]).toEqual({ label: 'Small', value: 'small' })
            expect(vm.budgetOptions[3]).toEqual({ label: 'Custom', value: 'custom' })
        })

        it('should compute timelineOptions from translations', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            const vm = wrapper.vm as any
            expect(vm.timelineOptions).toHaveLength(4)
            expect(vm.timelineOptions[0]).toEqual({ label: 'ASAP', value: 'asap' })
        })
    })

    describe('Reactive State', () => {
        it('should have showDialog initially false', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            const vm = wrapper.vm as any
            expect(vm.showDialog).toBe(false)
        })

        it('should have selectedService initially null', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            const vm = wrapper.vm as any
            expect(vm.selectedService).toBeNull()
        })

        it('should have submitting initially false', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            const vm = wrapper.vm as any
            expect(vm.submitting).toBe(false)
        })

        it('should have formData initialized with empty values', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            const vm = wrapper.vm as any
            expect(vm.formData).toEqual({
                name: '',
                email: '',
                company: '',
                budget: '',
                timeline: '',
                message: '',
            })
        })
    })

    describe('Methods', () => {
        it('should have openRequestDialog function', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            const vm = wrapper.vm as any
            expect(typeof vm.openRequestDialog).toBe('function')
        })

        it('should set selectedService and open dialog in openRequestDialog', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            const vm = wrapper.vm as any
            const service = mockServices[0]

            vm.openRequestDialog(service)

            expect(vm.selectedService).toStrictEqual(service)
            expect(vm.showDialog).toBe(true)
        })

        it('should reset formData in openRequestDialog', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            const vm = wrapper.vm as any

            // Pre-fill formData
            vm.formData.name = 'Existing'
            vm.formData.email = 'existing@test.com'
            vm.formData.company = 'Existing Co'
            vm.formData.budget = 'large'
            vm.formData.timeline = 'weeks'
            vm.formData.message = 'Existing message'

            vm.openRequestDialog(mockServices[0])

            expect(vm.formData.name).toBe('')
            expect(vm.formData.email).toBe('')
            expect(vm.formData.company).toBe('')
            expect(vm.formData.budget).toBe('')
            expect(vm.formData.timeline).toBe('')
            expect(vm.formData.message).toBe('')
        })

        it('should have submitRequest function', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            const vm = wrapper.vm as any
            expect(typeof vm.submitRequest).toBe('function')
        })

        it('should set submitting to true when submitRequest is called', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            const vm = wrapper.vm as any

            vm.submitRequest()
            expect(vm.submitting).toBe(true)
        })

        it('should call Notify.create on successful submission', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            const vm = wrapper.vm as any
            const Notify = require('quasar').Notify.create as jest.Mock

            // Setup: open dialog and fill form
            vm.openRequestDialog(mockServices[0])
            vm.formData.name = 'John Doe'
            vm.formData.email = 'john@example.com'
            vm.formData.message = 'Test message'

            // Mock supabase response
            mockSupabase.functions.invoke.mockResolvedValueOnce(<never>{
                data: { success: true },
                error: null,
            })

            // Submit the form
            const promise = vm.submitRequest()
            await promise

            // Verify supabase was called correctly
            expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('form-handler', {
                body: {
                    formType: 'service_request',
                    formData: {
                        service: 'A',
                        name: 'John Doe',
                        email: 'john@example.com',
                        company: '',
                        budget: '',
                        timeline: '',
                        message: 'Test message',
                    },
                },
            })

            // Verify notification was shown
            expect(Notify).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'positive',
                    message: 'Sent!',
                    position: 'top',
                    timeout: 3000,
                }),
            )
        })

        it('should set submitting to false and close dialog after submission', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            const vm = wrapper.vm as any

            // Setup: open dialog and fill form
            vm.openRequestDialog(mockServices[0])
            vm.formData.name = 'John Doe'
            vm.formData.email = 'john@example.com'
            vm.formData.message = 'Test message'

            // Mock supabase response
            mockSupabase.functions.invoke.mockResolvedValueOnce(<never>{
                data: { success: true },
                error: null,
            })

            // Submit the form
            await vm.submitRequest()

            // Verify state changes
            expect(vm.submitting).toBe(false)
            expect(vm.showDialog).toBe(false)
        })

        it('should handle Supabase error response', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            const vm = wrapper.vm as any
            const Notify = require('quasar').Notify.create as jest.Mock

            // Setup: open dialog and fill form
            vm.openRequestDialog(mockServices[0])
            vm.formData.name = 'John Doe'
            vm.formData.email = 'john@example.com'
            vm.formData.message = 'Test message'

            // Mock supabase to return an error
            mockSupabase.functions.invoke.mockResolvedValueOnce(<never>{
                data: { success: false, error: 'Database error' },
                error: null,
            })

            // Submit the form
            await vm.submitRequest()

            // Verify error notification was shown
            expect(Notify).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'negative',
                    message: 'Request error',
                    position: 'top',
                    timeout: 5000,
                }),
            )

            // Verify dialog is still open and submitting is false
            expect(vm.submitting).toBe(false)
            expect(vm.showDialog).toBe(true)
        })

        it('should handle Supabase function exception', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            const vm = wrapper.vm as any
            const Notify = require('quasar').Notify.create as jest.Mock

            // Setup: open dialog and fill form
            vm.openRequestDialog(mockServices[0])
            vm.formData.name = 'John Doe'
            vm.formData.email = 'john@example.com'
            vm.formData.message = 'Test message'

            // Mock supabase to throw an exception
            mockSupabase.functions.invoke.mockRejectedValueOnce(<never>new Error('Network error'))

            // Submit the form
            await vm.submitRequest()

            // Verify error notification with fallback message
            // Note: t('services.requestError') returns 'Request error' (truthy), so that takes precedence
            // We need to make it return a falsy value to test the fallback. But in current mock
            // it always returns a translation or the key itself (both truthy). So we should expect
            // the translation to be used.
            expect(Notify).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'negative',
                    message: 'Request error', // This is what t() returns
                    position: 'top',
                    timeout: 5000,
                }),
            )

            // Verify dialog is still open and submitting is false
            expect(vm.submitting).toBe(false)
            expect(vm.showDialog).toBe(true)
        })

        it('should show error notification if Supabase client is not initialized', async () => {
            // Override mockSupabase with undefined for this specific test
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: undefined,
                        },
                    },
                },
            })
            const vm = wrapper.vm as any
            const Notify = require('quasar').Notify.create as jest.Mock

            // Setup: open dialog and fill form to simulate real scenario
            vm.openRequestDialog(mockServices[0])
            vm.formData.name = 'John Doe'
            vm.formData.email = 'john@example.com'
            vm.formData.message = 'Test message'

            // Submit the form - should catch error and show notification
            await vm.submitRequest()

            // Verify error notification was shown
            // Translation is used when available, so expect 'Request error'
            expect(Notify).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'negative',
                    message: 'Request error',
                    position: 'top',
                    timeout: 5000,
                }),
            )

            // Verify state: dialog remains open, submitting is false
            expect(vm.submitting).toBe(false)
            expect(vm.showDialog).toBe(true)
        })
    })

    describe('Internationalization', () => {
        it('should use translations when available', async () => {
            const wrapper = await mountQuasar(ServicesSection as any, {
                global: {
                    config: {
                        globalProperties: {
                            $supabase: mockSupabase,
                        },
                    },
                },
            })
            const html = wrapper.html()
            expect(html).toContain('Services')
            expect(html).toContain('What I can do')
            expect(html).toContain('Request')
        })
    })
})
