export const loadEnv = () => {
    return {
        envVars: {
            data: {
                SUPABASE_URL: process.env.SUPABASE_URL || 'true',
                SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '/',
            },
        },
    }
}
