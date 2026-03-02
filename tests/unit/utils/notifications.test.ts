import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { showError, showSuccess } from 'src/utils/notifications'
import { Notify } from 'quasar'

// Mock Quasar's Notify module
jest.mock('quasar', () => ({
    Notify: {
        create: jest.fn(),
    },
}))

describe('notifications utility', () => {
    beforeEach(() => {
        ;(Notify.create as jest.Mock).mockClear()
    })

    describe('showSuccess', () => {
        const defaultOptions = {
            type: 'positive',
            position: 'top',
            classes: 'br-20',
        }

        it('should call Notify.create with default options when translation returns a value', () => {
            const mockT = jest.fn(() => 'Success message from translation')
            const translationKey = 'test.success'
            const timeout = 4000

            showSuccess(mockT, translationKey)

            expect(Notify.create).toHaveBeenCalledTimes(1)
            expect(Notify.create).toHaveBeenCalledWith({
                ...defaultOptions,
                message: 'Success message from translation',
                timeout,
            })
            expect(mockT).toHaveBeenCalledWith(translationKey)
        })

        it('should use fallbackMessage when translation returns empty string', () => {
            const mockT = jest.fn(() => '')
            const fallbackMessage = 'Custom fallback message'

            showSuccess(mockT, 'test.success', fallbackMessage)

            expect(Notify.create).toHaveBeenCalledWith({
                ...defaultOptions,
                message: fallbackMessage,
                timeout: 4000,
            })
        })

        it('should use default message when translation returns empty string and no fallback provided', () => {
            const mockT = jest.fn(() => '')

            showSuccess(mockT, 'test.success')

            expect(Notify.create).toHaveBeenCalledWith({
                ...defaultOptions,
                message: 'Operation completed successfully',
                timeout: 4000,
            })
        })

        it('should use custom timeout value', () => {
            const mockT = jest.fn(() => 'Success message')
            const customTimeout = 8000

            showSuccess(mockT, 'test.success', undefined, customTimeout)

            expect(Notify.create).toHaveBeenCalledWith({
                ...defaultOptions,
                message: 'Success message',
                timeout: customTimeout,
            })
        })

        it('should spread additional options correctly', () => {
            const mockT = jest.fn(() => 'Success message')
            const additionalOptions = {
                icon: 'check_circle',
                closeBtn: true,
                multiLine: true,
            }

            showSuccess(mockT, 'test.success', undefined, 4000, additionalOptions)

            expect(Notify.create).toHaveBeenCalledWith({
                ...defaultOptions,
                message: 'Success message',
                timeout: 4000,
                ...additionalOptions,
            })
        })

        it('should override default values with options', () => {
            const mockT = jest.fn(() => 'Success message')
            const options = {
                position: 'bottom-right' as const,
                classes: 'custom-class',
            }

            showSuccess(mockT, 'test.success', undefined, 4000, options)

            expect(Notify.create).toHaveBeenCalledWith({
                type: 'positive',
                message: 'Success message',
                position: 'bottom-right',
                timeout: 4000,
                classes: 'custom-class',
            })
        })

        it('should handle undefined translationKey gracefully', () => {
            const mockT = jest.fn(() => undefined)

            showSuccess(mockT, 'test.success', 'Fallback')

            expect(Notify.create).toHaveBeenCalledWith({
                ...defaultOptions,
                message: 'Fallback',
                timeout: 4000,
            })
        })

        it('should handle translation returning falsy values (null, undefined, 0)', () => {
            const mockT = jest.fn(() => null as any)
            const fallbackMessage = 'Fallback'

            showSuccess(mockT, 'test.success', fallbackMessage)

            expect(Notify.create).toHaveBeenCalledWith({
                ...defaultOptions,
                message: fallbackMessage,
                timeout: 4000,
            })
        })

        it('should prioritize translation over fallback when translation returns non-empty string', () => {
            const mockT = jest.fn(() => 'Translation wins')
            const fallbackMessage = 'This should not appear'

            showSuccess(mockT, 'test.success', fallbackMessage)

            expect(Notify.create).toHaveBeenCalledWith({
                ...defaultOptions,
                message: 'Translation wins',
                timeout: 4000,
            })
        })
    })

    describe('showError', () => {
        const defaultOptions = {
            type: 'negative',
            position: 'top',
            classes: 'br-20',
        }

        it('should call Notify.create with default options when translation returns a value', () => {
            const mockT = jest.fn(() => 'Error message from translation')
            const translationKey = 'test.error'
            const timeout = 5000

            showError(mockT, translationKey)

            expect(Notify.create).toHaveBeenCalledTimes(1)
            expect(Notify.create).toHaveBeenCalledWith({
                ...defaultOptions,
                message: 'Error message from translation',
                timeout,
            })
            expect(mockT).toHaveBeenCalledWith(translationKey)
        })

        it('should use error.message when translation returns empty string and error is an Error object', () => {
            const mockT = jest.fn(() => '')
            const error = new Error('Something went wrong')

            showError(mockT, 'test.error', error)

            expect(Notify.create).toHaveBeenCalledWith({
                ...defaultOptions,
                message: 'Something went wrong',
                timeout: 5000,
            })
        })

        it('should use error directly when translation returns empty and error is a string', () => {
            const mockT = jest.fn(() => '')
            const error = 'String error message'

            showError(mockT, 'test.error', error)

            expect(Notify.create).toHaveBeenCalledWith({
                ...defaultOptions,
                message: 'String error message',
                timeout: 5000,
            })
        })

        it('should use fallbackMessage when translation and error are both falsy', () => {
            const mockT = jest.fn(() => '')
            showError(mockT, 'test.error', undefined, 'Custom fallback')

            expect(Notify.create).toHaveBeenCalledWith({
                ...defaultOptions,
                message: 'Custom fallback',
                timeout: 5000,
            })
        })

        it('should use default fallback when translation and error are both falsy and no fallback provided', () => {
            const mockT = jest.fn(() => '')

            showError(mockT, 'test.error')

            expect(Notify.create).toHaveBeenCalledWith({
                ...defaultOptions,
                message: 'An error occurred',
                timeout: 5000,
            })
        })

        it('should use custom timeout value', () => {
            const mockT = jest.fn(() => 'Error message')
            const customTimeout = 10000

            showError(mockT, 'test.error', undefined, undefined, customTimeout)

            expect(Notify.create).toHaveBeenCalledWith({
                ...defaultOptions,
                message: 'Error message',
                timeout: customTimeout,
            })
        })

        it('should spread additional options correctly', () => {
            const mockT = jest.fn(() => 'Error message')
            const additionalOptions = {
                icon: 'error',
                closeBtn: true,
                multiLine: true,
            }

            showError(mockT, 'test.error', undefined, undefined, 5000, additionalOptions)

            expect(Notify.create).toHaveBeenCalledWith({
                ...defaultOptions,
                message: 'Error message',
                timeout: 5000,
                ...additionalOptions,
            })
        })

        it('should override default values with options', () => {
            const mockT = jest.fn(() => 'Error message')
            const options = {
                position: 'bottom-left' as const,
                classes: 'custom-error-class',
            }

            showError(mockT, 'test.error', undefined, undefined, 5000, options)

            expect(Notify.create).toHaveBeenCalledWith({
                type: 'negative',
                message: 'Error message',
                position: 'bottom-left',
                timeout: 5000,
                classes: 'custom-error-class',
            })
        })

        // Removed: new Error(null) actually creates an Error with message "null" (string).
        // JavaScript Error messages are always strings, so this edge case is not realistic.

        it('should handle translation returning undefined', () => {
            const mockT = jest.fn(() => undefined)
            const error = new Error('Error details')

            showError(mockT, 'test.error', error)

            expect(Notify.create).toHaveBeenCalledWith({
                ...defaultOptions,
                message: 'Error details',
                timeout: 5000,
            })
        })

        it('should handle translation returning falsy value when error is also falsy', () => {
            const mockT = jest.fn(() => '')
            const fallbackMessage = 'This is the fallback'

            showError(mockT, 'test.error', null, fallbackMessage)

            expect(Notify.create).toHaveBeenCalledWith({
                ...defaultOptions,
                message: fallbackMessage,
                timeout: 5000,
            })
        })

        it('should handle Error object with empty message', () => {
            const mockT = jest.fn(() => '')
            const error = new Error('')

            showError(mockT, 'test.error', error, 'Fallback')

            expect(Notify.create).toHaveBeenCalledWith({
                ...defaultOptions,
                message: 'Fallback',
                timeout: 5000,
            })
        })

        it('should handle error with 0 as message (edge case)', () => {
            const mockT = jest.fn(() => '')
            const error = new Error('0')

            showError(mockT, 'test.error', error, 'Fallback')

            expect(Notify.create).toHaveBeenCalledWith({
                ...defaultOptions,
                message: '0',
                timeout: 5000,
            })
        })

        it('should ignore error when it is falsy (null/undefined)', () => {
            const mockT = jest.fn(() => '')

            showError(mockT, 'test.error', null)

            expect(Notify.create).toHaveBeenCalledWith({
                ...defaultOptions,
                message: 'An error occurred',
                timeout: 5000,
            })
        })

        it('should prioritize in order: translation > error > fallback', () => {
            const mockT = jest.fn(() => 'From translation')
            const error = new Error('From error')

            showError(mockT, 'test.error', error, 'From fallback')

            expect(Notify.create).toHaveBeenCalledWith({
                ...defaultOptions,
                message: 'From translation',
                timeout: 5000,
            })
        })

        it('should prioritize error over fallback when translation is empty', () => {
            const mockT = jest.fn(() => '')
            const error = new Error('From error')

            showError(mockT, 'test.error', error, 'From fallback')

            expect(Notify.create).toHaveBeenCalledWith({
                ...defaultOptions,
                message: 'From error',
                timeout: 5000,
            })
        })
    })

    describe('integration scenarios', () => {
        it('should handle successful showSuccess with all parameters', () => {
            const mockT = jest.fn(() => 'Profile updated successfully')
            const translationKey = 'profile.update.success'
            const fallbackMessage = 'Update completed'
            const timeout = 6000
            const options = {
                position: 'bottom' as const,
                icon: 'check',
                actions: [{ label: 'Undo', color: 'primary' }],
            }

            showSuccess(mockT, translationKey, fallbackMessage, timeout, options)

            expect(Notify.create).toHaveBeenCalledWith({
                type: 'positive',
                message: 'Profile updated successfully',
                position: 'bottom',
                timeout: 6000,
                classes: 'br-20',
                icon: 'check',
                actions: [{ label: 'Undo', color: 'primary' }],
            })
        })

        it('should handle error with string error and custom fallback', () => {
            const mockT = jest.fn(() => '')
            const error = 'Network timeout'
            const fallbackMessage = 'Please check your connection'
            const timeout = 7000

            showError(mockT, 'api.error', error, fallbackMessage, timeout)

            expect(Notify.create).toHaveBeenCalledWith({
                type: 'negative',
                message: 'Network timeout',
                position: 'top',
                timeout: 7000,
                classes: 'br-20',
            })
        })

        it('should handle error with no translation, null error, and custom fallback', () => {
            const mockT = jest.fn(() => '')
            showError(mockT, 'api.error', null, 'Connection failed')

            expect(Notify.create).toHaveBeenCalledWith({
                type: 'negative',
                message: 'Connection failed',
                position: 'top',
                timeout: 5000,
                classes: 'br-20',
            })
        })

        it('should handle success with empty translation and no fallback', () => {
            const mockT = jest.fn(() => '')
            showSuccess(mockT, 'action.success')

            expect(Notify.create).toHaveBeenCalledWith({
                type: 'positive',
                message: 'Operation completed successfully',
                position: 'top',
                timeout: 4000,
                classes: 'br-20',
            })
        })

        it('should handle success with translation that returns non-string value', () => {
            const mockT = jest.fn(() => 123 as any)
            showSuccess(mockT, 'action.success')

            expect(Notify.create).toHaveBeenCalledWith({
                type: 'positive',
                message: 123,
                position: 'top',
                timeout: 4000,
                classes: 'br-20',
            })
        })
    })

    describe('notification type and positioning', () => {
        it('showSuccess should always use positive type', () => {
            const mockT = jest.fn(() => 'Success')
            showSuccess(mockT, 'test')

            expect(Notify.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'positive',
                }),
            )
        })

        it('showError should always use negative type', () => {
            const mockT = jest.fn(() => 'Error')
            showError(mockT, 'test')

            expect(Notify.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'negative',
                }),
            )
        })

        it('both functions should use top position by default', () => {
            const mockT = jest.fn(() => 'Message')

            showSuccess(mockT, 'test')
            showError(mockT, 'test')

            expect(Notify.create).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining({ position: 'top' }),
            )
            expect(Notify.create).toHaveBeenNthCalledWith(
                2,
                expect.objectContaining({ position: 'top' }),
            )
        })

        it('both functions should use br-20 classes by default', () => {
            const mockT = jest.fn(() => 'Message')

            showSuccess(mockT, 'test')
            showError(mockT, 'test')

            expect(Notify.create).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining({ classes: 'br-20' }),
            )
            expect(Notify.create).toHaveBeenNthCalledWith(
                2,
                expect.objectContaining({ classes: 'br-20' }),
            )
        })
    })

    describe('message resolution precedence', () => {
        it('showSuccess: translation > fallback > default', () => {
            const mockT = jest.fn(() => 'Translation message')
            showSuccess(mockT, 'test', 'Fallback message')

            expect(Notify.create).toHaveBeenCalledWith(
                expect.objectContaining({ message: 'Translation message' }),
            )
        })

        it('showError: translation > error.message > error > fallback', () => {
            const mockT = jest.fn(() => 'Translation message')
            const error = new Error('Error message')
            showError(mockT, 'test', error, 'Fallback message')

            expect(Notify.create).toHaveBeenCalledWith(
                expect.objectContaining({ message: 'Translation message' }),
            )
        })

        it('showError: error.message > error (string) > fallback when translation empty', () => {
            const mockT = jest.fn(() => '')
            const error = new Error('Error object message')
            showError(mockT, 'test', error, 'Fallback message')

            expect(Notify.create).toHaveBeenCalledWith(
                expect.objectContaining({ message: 'Error object message' }),
            )
        })

        it('showError: error (string) > fallback when translation empty and error is string', () => {
            const mockT = jest.fn(() => '')
            const error = 'String error message'
            showError(mockT, 'test', error, 'Fallback message')

            expect(Notify.create).toHaveBeenCalledWith(
                expect.objectContaining({ message: 'String error message' }),
            )
        })

        it('showError: fallback > default when translation and error are falsy', () => {
            const mockT = jest.fn(() => '')
            showError(mockT, 'test', null, 'Custom fallback')

            expect(Notify.create).toHaveBeenCalledWith(
                expect.objectContaining({ message: 'Custom fallback' }),
            )
        })

        it('showError: default fallback when translation and error are falsy', () => {
            const mockT = jest.fn(() => '')
            showError(mockT, 'test')

            expect(Notify.create).toHaveBeenCalledWith(
                expect.objectContaining({ message: 'An error occurred' }),
            )
        })
    })

    describe('default timeout values', () => {
        it('showSuccess should use 4000ms as default timeout', () => {
            const mockT = jest.fn(() => 'Success')
            showSuccess(mockT, 'test')

            expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ timeout: 4000 }))
        })

        it('showError should use 5000ms as default timeout', () => {
            const mockT = jest.fn(() => 'Error')
            showError(mockT, 'test')

            expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ timeout: 5000 }))
        })
    })

    describe('edge cases', () => {
        it('should handle error object without message property', () => {
            const mockT = jest.fn(() => '')
            // @ts-expect-error - intentionally creating error without message
            const error = new Error()
            showError(mockT, 'test', error, 'Fallback')

            expect(Notify.create).toHaveBeenCalledWith(
                expect.objectContaining({ message: 'Fallback' }),
            )
        })

        it('should handle when t() returns empty string and error is empty string', () => {
            const mockT = jest.fn(() => '')
            showError(mockT, 'test', '', 'Fallback')

            expect(Notify.create).toHaveBeenCalledWith(
                expect.objectContaining({ message: 'Fallback' }),
            )
        })

        it('should handle when t() returns whitespace-only string (truthy)', () => {
            const mockT = jest.fn(() => '   ')
            // Note: Non-empty strings are truthy in JavaScript, so whitespace is used as message
            showSuccess(mockT, 'test', 'Fallback')

            expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ message: '   ' }))
        })

        it('should preserve original error when it is a string with special characters', () => {
            const mockT = jest.fn(() => '')
            const error = 'Error with "quotes" and special chars: $@#!'
            showError(mockT, 'test', error)

            expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ message: error }))
        })
    })
})
