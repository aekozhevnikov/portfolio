import type { QNotifyCreateOptions } from 'quasar'
import { Notify } from 'quasar'

/**
 * Shows a positive (success) notification with optional translation support
 */
export const showSuccess = (
    t: (key: string, ...args: any[]) => string | null | undefined,
    translationKey: string,
    fallbackMessage?: string,
    timeout: number = 4000,
    options?: Partial<QNotifyCreateOptions>,
) => {
    const translation = t(translationKey)
    const message = translation || fallbackMessage || 'Operation completed successfully'

    Notify.create({
        type: 'positive',
        message,
        position: 'top',
        timeout,
        classes: 'br-20',
        ...options,
    })
}

/**
 * Shows a negative (error) notification with smart message resolution
 * Tries translation key first, then provided error message, then fallback
 */
export const showError = (
    t: (key: string, ...args: any[]) => string | null | undefined,
    translationKey: string,
    error?: Error | string | null,
    fallbackMessage: string = 'An error occurred',
    timeout: number = 5000,
    options?: Partial<QNotifyCreateOptions>,
) => {
    const translation = t(translationKey)

    // Extract error message based on type
    let errorMessage: string | undefined = undefined
    if (error) {
        if (error instanceof Error) {
            errorMessage = error.message
        } else {
            errorMessage = error
        }
    }

    // Priority: translation > error message > fallback
    const message = translation || errorMessage || fallbackMessage

    Notify.create({
        type: 'negative',
        message,
        position: 'top',
        timeout,
        classes: 'br-20',
        ...options,
    })
}
