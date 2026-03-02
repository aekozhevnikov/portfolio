export interface Project {
    id: string
    title: string
    description: string
    technologies: {
        frontend?: Skill[]
        backend?: Skill[]
        devops?: Skill[]
        databases?: Skill[]
        languages?: Skill[]
        integrations?: Skill[]
    }
    link?: string | undefined
    codeLink?: string | undefined
    image?: string | undefined
    images?: string[] | undefined // Additional images from assets/projects/{id}/
    featured?: boolean | undefined
    order: number
    leftSided?: boolean | undefined
    private?: boolean | undefined
    showImage?: boolean | undefined
    highlights?: Array<string | { text: string }> | undefined
    customStyle?:
        | {
              background?: string
              border?: string
              btnColor?: string
              textColor?: string
          }
        | undefined
}

export interface PersonalInfo {
    name: string
    title: string
    location: string
    email: string
    description: string
    about: string
    image?: string
    showResumeButton?: boolean
}

export interface SkillCategory {
    category: string
    skills: Skill[]
}

export interface Skill {
    language: string
    icon: string
    variant: 'original' | 'wordmark' | 'plain' // default: 'original' for Languages, 'wordmark' for others
}

export interface Review {
    name: string
    testimony: string
    testimony2?: string
    position: string
    initials: string
}

export interface SocialLink {
    name: string
    icon: string
    color: string
    link: string
}

export interface Service {
    title: string
    description: string
    icon: string
    color?: string
}

export interface SiteConfig {
    personal: PersonalInfo
    projects: Project[]
    skills: {
        categories: SkillCategory[]
    }
    reviews?: Review[]
    socials?: SocialLink[]
    services?: Service[]
}

export const skills: SiteConfig['skills'] = {
    categories: [
        {
            category: 'expertise.programmingLanguages',
            skills: [
                { language: 'JavaScript', icon: 'javascript', variant: 'original' },
                { language: 'TypeScript', icon: 'typescript', variant: 'original' },
                { language: 'Python', icon: 'python', variant: 'original' },
                { language: 'Bash', icon: 'bash', variant: 'original' },
                { language: 'HTML5', icon: 'html5', variant: 'original' },
                { language: 'CSS3', icon: 'css3', variant: 'original' },
                { language: 'SCSS', icon: 'sass', variant: 'original' },
                { language: 'Swift', icon: 'swift', variant: 'original' },
                { language: 'Dart', icon: 'dart', variant: 'original' },
            ],
        },
        {
            category: 'expertise.frontend',
            skills: [
                { language: 'Vue.js', icon: 'vuejs', variant: 'original' },
                { language: 'Quasar', icon: 'quasar', variant: 'original' },
                { language: 'Flutter', icon: 'flutter', variant: 'original' },
            ],
        },
        {
            category: 'expertise.backend',
            skills: [
                { language: 'Node.js', icon: 'nodejs', variant: 'original' },
                { language: 'Express', icon: 'express', variant: 'original' },
                { language: 'FastAPI', icon: 'fastapi', variant: 'original' },
                { language: 'Prisma', icon: 'prisma', variant: 'original' },
                { language: 'SqlAlchemy', icon: 'sqlalchemy', variant: 'original' },
            ],
        },
        {
            category: 'expertise.databases',
            skills: [
                { language: 'PostgreSQL', icon: 'postgresql', variant: 'original' },
                { language: 'Sqlite', icon: 'sqlite', variant: 'original' },
                { language: 'Firebase', icon: 'firebase', variant: 'original' },
                { language: 'Redis', icon: 'redis', variant: 'wordmark' },
            ],
        },
        {
            category: 'expertise.devops',
            skills: [
                { language: 'Git', icon: 'git', variant: 'original' },
                { language: 'Docker', icon: 'docker', variant: 'original' },
                { language: 'AWS', icon: 'amazonwebservices', variant: 'wordmark' },
                { language: 'GCP', icon: 'googlecloud', variant: 'original' },
                { language: 'Azure', icon: 'azure', variant: 'original' },
                { language: 'Vercel', icon: 'vercel', variant: 'original' },
                { language: 'Netlify', icon: 'netlify', variant: 'original' },
                { language: 'Supabase', icon: 'supabase', variant: 'original' },
                { language: 'YandexCloud', icon: 'yandexcloud', variant: 'original' },
                { language: 'Kubernetes', icon: 'kubernetes', variant: 'original' },
                { language: 'Puppeteer', icon: 'puppeteer', variant: 'original' },
            ],
        },
    ],
}

export const socials = [
    {
        name: 'GitHub',
        icon: 'code',
        color: '#24292e',
        link: 'https://github.com/aekozhevnikov',
    },
    {
        name: 'Telegram',
        icon: 'telegram',
        color: '#0088cc',
        link: 'https://t.me/hungryking',
    },
    {
        name: 'WhatsApp',
        icon: 'whatsapp',
        color: '#10b981',
        link: 'https://wa.me/79505228754',
    },
    {
        name: 'Instagram',
        icon: 'instagram',
        color: '#4f46e5',
        link: 'https://instagram.com/aekozhevnikov',
    },
    {
        name: 'X',
        icon: 'x',
        color: '#3b82f6',
        link: 'https://x.com/aekozhevnikov',
    },
    {
        name: 'Email',
        icon: 'email',
        color: '#ea4335',
        link: 'mailto:dev.aykozhevnikov@gmail.com',
    },
]

export const email = 'dev.aykozhevnikov@gmail.com'
export const avatar = 'https://avatars.githubusercontent.com/u/73868413?v=4'
