import { config } from 'dotenv'
import { existsSync } from 'fs'

// Load .env files based on environment
const loadDotEnv = () => {
    const env = process.env.DEV ? 'dev' : 'prod'
    const envFile = `.env.local.${env}`

    // Try to load environment-specific file
    if (existsSync(envFile)) {
        config({ path: envFile })
    } else if (existsSync('.env.local')) {
        config({ path: '.env.local' })
    } else if (existsSync('.env')) {
        config({ path: '.env' })
    } else {
        console.warn('⚠️ No .env file found')
    }

    // Debug: Log if variables are set
    if (!process.env.SUPABASE_URL) {
        console.warn('⚠️ SUPABASE_URL is not set')
    }

    if (!process.env.SUPABASE_ANON_KEY) {
        console.warn('⚠️ SUPABASE_ANON_KEY is not set')
    }
}

loadDotEnv()

export const loadEnv = () => {
    return {
        envVars: {
            data: {
                SUPABASE_URL: process.env.SUPABASE_URL || '',
                SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
            },
        },
    }
}
