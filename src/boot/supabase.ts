import { boot } from 'quasar/wrappers'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

declare module '@quasar/app-vite' {
    interface QuasarAppBootConfig {
        supabase: (app: any) => SupabaseClient | void
    }
}

export default boot(({ app }) => {
    const supabaseUrl = String(process.env.SUPABASE_URL)
    const supabaseAnonKey = String(process.env.SUPABASE_ANON_KEY)

    if (!supabaseUrl) {
        console.warn(
            'Supabase URL is not configured. Please set SUPABASE_URL in your environment variables.',
        )
    }

    if (!supabaseAnonKey) {
        console.warn(
            'Supabase anon key is not configured. Please set SUPABASE_ANON_KEY in your environment variables.',
        )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Provide supabase instance to the app
    app.config.globalProperties.$supabase = supabase

    // Make it available in the boot context for other boot files
    app.provide('supabase', supabase)
})
