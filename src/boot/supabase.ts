import { boot } from 'quasar/wrappers'
import { createClient } from '@supabase/supabase-js'

export default boot(({ app }) => {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

    // Validate URL format
    const isValidUrl = (url: string | undefined): boolean => {
        if (!url) return false
        try {
            new URL(url)
            return url.startsWith('http://') || url.startsWith('https://')
        } catch {
            return false
        }
    }

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error(
            '❌ Supabase configuration error: SUPABASE_URL or SUPABASE_ANON_KEY is missing. Please check your environment variables.',
        )
        console.error('   Make sure you have .env.local.dev file with correct values.')
        // Don't create client with invalid config
        return
    }

    if (!isValidUrl(supabaseUrl)) {
        console.error(
            `❌ Invalid Supabase URL: "${supabaseUrl}". Must be a valid HTTP or HTTPS URL.`,
        )
        return
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        // Provide supabase instance to the app
        app.config.globalProperties.$supabase = supabase

        // Make it available in the boot context for other boot files
        app.provide('supabase', supabase)
    } catch (error) {
        console.error('❌ Failed to initialize Supabase client:', error)
    }
})
