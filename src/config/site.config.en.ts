import { avatar, email, type SiteConfig, skills, socials } from './site.config'

export const defaultSiteConfigEn: SiteConfig = {
    personal: {
        name: 'Anton Kozhevnikov',
        title: 'Full Stack Developer',
        location: 'Nizhnevartovsk, Russia',
        email: email,
        description:
            'Developer with experience in creating fullstack solutions and internal services. Interested in developing reliable and scalable systems, business process automation, and deep diving into DevOps practices.',
        about: 'I am a Full Stack Developer with over 5 years of experience in creating web applications. Specializing in JavaScript, TypeScript and the Node.js ecosystem. My goal is to create high-quality, scalable and maintainable code.',
        image: avatar,
        showResumeButton: true,
    },
    projects: [
        {
            id: 'crm',
            title: 'CRM System',
            description: 'Corporate CRM system for employees: managers, performers',
            technologies: {
                languages: [
                    { language: 'TypeScript', icon: 'typeScript', variant: 'original' },
                    { language: 'Google App Script', icon: 'googleappscript', variant: 'original' },
                ],
                frontend: [
                    { language: 'Vue.js', icon: 'vuejs', variant: 'original' },
                    { language: 'Quasar', icon: 'quasar', variant: 'original' },
                ],
                backend: [
                    { language: 'Node.js', icon: 'nodejs', variant: 'original' },
                    { language: 'Express', icon: 'express', variant: 'original' },
                ],
                databases: [{ language: 'PostgreSQL', icon: 'postgresql', variant: 'original' }],
                devops: [
                    { language: 'Docker', icon: 'docker', variant: 'original' },
                    { language: 'Git', icon: 'git', variant: 'original' },
                ],
            },
            link: 'https://github.com/aekozhevnikov',
            featured: true,
            order: 1,
            leftSided: true,
            showImage: true,
            highlights: [
                'Rewrote and improved the corporate CRM system, which accelerated business processes',
                'Increased employee productivity by 40%',
                'Reduced document errors',
            ],
            customStyle: {
                background: '#f0e9ee',
                border: '0.5px solid #4b135d',
                btnColor: '#d12e26',
            },
        },
        {
            id: 'partner-service',
            title: 'Partner Service',
            description: 'Web application for company partners',
            technologies: {
                frontend: [
                    { language: 'Vue.js', icon: 'vuejs', variant: 'original' },
                    { language: 'TypeScript', icon: 'typescript', variant: 'original' },
                    { language: 'Quasar', icon: 'quasar', variant: 'original' },
                ],
                backend: [
                    { language: 'Node.js', icon: 'nodejs', variant: 'original' },
                    { language: 'Express', icon: 'express', variant: 'original' },
                ],
                devops: [
                    { language: 'Docker', icon: 'docker', variant: 'original' },
                    { language: 'Git', icon: 'git', variant: 'original' },
                ],
            },
            link: 'https://partner-site.example.com',
            featured: true,
            order: 2,
            leftSided: false,
            showImage: false,
            highlights: [
                'Developed a service for partners, contributing to increased turnover',
                'Increased number of partners by 25%',
                'Automated interaction processes',
            ],
            customStyle: {
                background: '#e9f0f4',
                border: '0.5px solid #1d4778',
                btnColor: '#007bff',
            },
        },
        {
            id: 'referral',
            title: 'Referral Program',
            description: 'Referral program with automatic reward calculation',
            technologies: {
                frontend: [
                    { language: 'Vue.js', icon: 'vuejs', variant: 'original' },
                    { language: 'TypeScript', icon: 'typescript', variant: 'original' },
                    { language: 'Quasar', icon: 'quasar', variant: 'original' },
                ],
                backend: [
                    { language: 'Node.js', icon: 'nodejs', variant: 'original' },
                    { language: 'Express', icon: 'express', variant: 'original' },
                ],
                devops: [
                    { language: 'Docker', icon: 'docker', variant: 'original' },
                    { language: 'Git', icon: 'git', variant: 'original' },
                ],
            },
            link: 'https://github.com/aekozhevnikov',
            featured: false,
            order: 3,
            leftSided: true,
            showImage: true,
            highlights: [
                'Developed a Referral Program from scratch',
                'Increased number of new customers through referrals',
                'Automated reward calculation process',
            ],
            customStyle: {
                background: '#edf4e3',
                border: '0.5px solid #2e693b',
                btnColor: '#006b35',
            },
        },
        {
            id: 'content-moderator',
            title: 'Content Checker',
            description: 'Automatic content checking service with flexible rule configuration',
            technologies: {
                frontend: [
                    { language: 'Vue.js', icon: 'vuejs', variant: 'original' },
                    { language: 'TypeScript', icon: 'typescript', variant: 'original' },
                    { language: 'Quasar', icon: 'quasar', variant: 'original' },
                ],
                backend: [
                    { language: 'Node.js', icon: 'nodejs', variant: 'original' },
                    { language: 'Express', icon: 'express', variant: 'original' },
                ],
                devops: [
                    { language: 'Docker', icon: 'docker', variant: 'original' },
                    { language: 'Git', icon: 'git', variant: 'original' },
                ],
            },
            link: 'https://github.com/aekozhevnikov',
            featured: false,
            order: 4,
            leftSided: false,
            showImage: false,
            highlights: [
                'Automatic content checking',
                'Policy violation detection',
                'Flexible rule configuration',
            ],
            customStyle: {
                background: '#f3e8ff',
                border: '2px solid #7c3aed',
                btnColor: '#8b5cf6',
                textColor: '#4c1d95',
            },
        },
        {
            id: 'social-parser',
            title: 'Social Media Parser',
            description: 'Getting all leads from social networks + post parsing',
            technologies: {
                frontend: [
                    { language: 'Vue.js', icon: 'vuejs', variant: 'original' },
                    { language: 'TypeScript', icon: 'typescript', variant: 'original' },
                ],
                backend: [
                    { language: 'Python', icon: 'python', variant: 'original' },
                    { language: 'Puppeteer', icon: 'puppeteer', variant: 'original' },
                    { language: 'FastAPI', icon: 'fastapi', variant: 'original' },
                ],
                databases: [{ language: 'PostgreSQL', icon: 'postgresql', variant: 'original' }],
                devops: [
                    { language: 'Docker', icon: 'docker', variant: 'original' },
                    { language: 'Git', icon: 'git', variant: 'original' },
                    { language: 'AWS', icon: 'amazonwebservices', variant: 'wordmark' },
                    { language: 'Kubernetes', icon: 'kubernetes', variant: 'original' },
                ],
            },
            link: 'https://github.com/aekozhevnikov',
            featured: false,
            order: 5,
            leftSided: true,
            showImage: true,
            highlights: [
                'Data collection from multiple sources',
                'Processing large volumes of data',
                'Flexible filtering and analysis',
            ],
            customStyle: {
                background: '#ecfdf5',
                border: '2px solid #10b981',
                btnColor: '#34d399',
                textColor: '#047857',
            },
        },
        {
            id: 'article-generator',
            title: 'Article Generator',
            description: 'Service for generating articles within Google Tables',
            technologies: {
                languages: [
                    { language: 'Google App Script', icon: 'googleappscript', variant: 'original' },
                ],
            },
            link: 'https://github.com/aekozhevnikov',
            featured: false,
            order: 6,
            leftSided: false,
            showImage: false,
            highlights: [
                'Content generation based on templates',
                'Automatic publishing to Google Workspace',
                'Integration with Google Analytics',
            ],
            customStyle: {
                background: '#fef2f2',
                border: '2px solid #dc2626',
                btnColor: '#ef4444',
                textColor: '#7f1d1d',
            },
        },
        {
            id: 'vinchenzobot',
            title: 'VinchenzoBot',
            description:
                'Production-grade Telegram bot for restaurant loyalty, reviews, surveys and marketing automation',
            technologies: {
                languages: [{ language: 'Python', icon: 'python', variant: 'original' }],
                backend: [
                    { language: 'FastAPI', icon: 'fastapi', variant: 'original' },
                    { language: 'aiogram', icon: 'telegram', variant: 'original' },
                    { language: 'Playwright', icon: 'playwright', variant: 'original' },
                    { language: 'Selenium', icon: 'selenium', variant: 'original' },
                ],
                databases: [{ language: 'PostgreSQL', icon: 'postgresql', variant: 'original' }],
                devops: [
                    { language: 'Docker', icon: 'docker', variant: 'original' },
                    { language: 'Traefik', icon: 'traefikproxy', variant: 'original' },
                    { language: 'Vault', icon: 'vault', variant: 'original' },
                    { language: 'Ansible', icon: 'ansible', variant: 'original' },
                    { language: 'Grafana', icon: 'grafana', variant: 'original' },
                    { language: 'Prometheus', icon: 'prometheus', variant: 'original' },
                    { language: 'Loki', icon: 'loki', variant: 'original' },
                    { language: 'Alertmanager', icon: 'alertmanager', variant: 'original' },
                    { language: 'Git', icon: 'git', variant: 'original' },
                ],
            },
            link: 'https://t.me/VincenzoPizzaBot',
            featured: true,
            order: 7,
            leftSided: true,
            showImage: true,
            highlights: [
                'Production system serving 8,000+ customers in a restaurant chain',
                'Full DevOps stack: Docker, Traefik, Vault, Ansible, K8s, AWS, Grafana, Prometheus, Loki, Alertmanager',
                'Automated PostgreSQL backups to Yandex Disk with Transparent Data Encryption (Percona)',
                'Complex integrations: IIKO loyalty, GetIt bonuses, VSEM EDI, 2GIS/Yandex reviews',
                'High code quality: 10/10 pylint, strict mypy, comprehensive test coverage (unit/integration/e2e)',
                'Modular async architecture with SQLAlchemy ORM, FastAPI, aiogram 3',
            ],
            customStyle: {
                background: '#f3e8ff',
                border: '2px solid #7c3aed',
                btnColor: '#8b5cf6',
                textColor: '#4c1d95',
            },
        },
    ],
    skills: skills,
    reviews: [
        {
            name: 'Ivan Petrov',
            testimony:
                'Professional approach to work, high-quality code and adherence to deadlines.',
            testimony2:
                'Anton proved himself as a highly qualified specialist capable of solving complex problems.',
            position: 'IT Head, TechCorp',
            initials: 'IP',
        },
        {
            name: 'Maria Sidorova',
            testimony: 'Work done at a high level, the solution was scalable and maintainable.',
            position: 'CEO, StartupX',
            initials: 'MS',
        },
    ],
    socials: socials,
    services: [
        {
            title: 'Frontend',
            description:
                'Creating modern responsive web applications with the latest technologies.',
            icon: 'code',
            color: 'primary',
        },
        {
            title: 'Backend',
            description:
                'Building robust and scalable server-side applications, RESTful APIs, and microservices.',
            icon: 'memory',
            color: 'primary',
        },
        {
            title: 'UI/UX Design',
            description: 'Designing beautiful and intuitive user interfaces and experiences.',
            icon: 'palette',
            color: 'secondary',
        },
        {
            title: 'Consulting',
            description: 'Expert advice on technology stack selection and architectural solutions.',
            icon: 'psychology',
            color: 'accent',
        },
    ],
}
