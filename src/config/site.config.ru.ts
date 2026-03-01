import { avatar, email, type SiteConfig, skills, socials } from './site.config'

export const defaultSiteConfigRu: SiteConfig = {
    personal: {
        name: 'Антон Кожевников',
        title: 'Full Stack Разработчик',
        location: 'Нижневартовск, Россия',
        email: email,
        description:
            'Разработчик с опытом создания fullstack-решений и внутренних сервисов. Заинтересован в разработке надёжных и масштабируемых систем, автоматизации бизнес-процессов и глубоком погружении в DevOps-практики.',
        about: 'Я - Full Stack Разработчик с опытом более 5 лет в создании веб-приложений. Специализируюсь на JavaScript, TypeScript и экосистеме Node.js. Моя цель - создавать качественный, масштабируемый и поддерживаемый код.',
        image: avatar,
        showResumeButton: true,
    },
    projects: [
        {
            id: 'crm',
            title: 'CRM Система',
            description: 'Корпоративная CRM система для сотрудников: менеджеров, исполнителей',
            technologies: {
                frontend: [
                    { language: 'TypeScript', icon: 'typeScript', variant: 'original' },
                    { language: 'Google App Script', icon: 'googleappscript', variant: 'original' },
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
                'Переписал и доработал корпоративную CRM - систему, которая позволила ускорить рабочие бизнес процессы',
                'Ускорила работу сотрудников на 40%',
                'Сократила количество ошибок в документах',
            ],
            customStyle: {
                background: '#f0e9ee',
                border: '0.5px solid #4b135d',
                btnColor: '#d12e26',
            },
        },
        {
            id: 'partner-service',
            title: 'Партнерский сервис',
            description: 'Веб приложение для партнеров компании',
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
                'Разработал сервис для партнеров компании, что способствовало увеличению оборотов',
                'Увеличила количество партнеров на 25%',
                'Автоматизировала процессы взаимодействия',
            ],
            customStyle: {
                background: '#e9f0f4',
                border: '0.5px solid #1d4778',
                btnColor: '#007bff',
            },
        },
        {
            id: 'referral',
            title: 'Реферальная программа',
            description: 'Реферальная программа с автоматическим расчетом вознаграждений',
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
                'Разработал с нуля Реферальную программу',
                'Увеличила количество новых клиентов через рефералов',
                'Автоматизировала процесс расчета вознаграждений',
            ],
            customStyle: {
                background: '#edf4e3',
                border: '0.5px solid #2e693b',
                btnColor: '#006b35',
            },
        },
        {
            id: 'content-moderator',
            title: 'Контент модератор',
            description: 'Сервис автоматической проверки контента с гибкой настройкой правил',
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
                'Автоматическая проверка контента',
                'Обнаружение нарушения политики',
                'Гибкая настройка правил',
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
            title: 'Парсинг соцсетей',
            description: 'Получение всех лидов из соцсетей + парсинг постов',
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
                'Сбор данных из множества источников',
                'Обработка больших объемов данных',
                'Гибкая фильтрация и анализ',
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
            title: 'Генератор статей',
            description: 'Сервис по генерации статей внутри Google Tables',
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
                'Генерация контента на основе шаблонов',
                'Автоматическая публикация в Google Workspace',
                'Интеграция с Google Analytics',
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
                'Telegram-бот для ресторанной лояльности, отзывов, опросов и маркетинговой автоматизации',
            technologies: {
                languages: [{ language: 'Python', icon: 'python', variant: 'original' }],
                backend: [
                    { language: 'FastAPI', icon: 'fastapi', variant: 'original' },
                    { language: 'Aiogram', icon: 'telegram', variant: 'original' },
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
                    { language: 'Alertmanager', icon: 'alertmanager', variant: 'plain' },
                    { language: 'Git', icon: 'git', variant: 'original' },
                ],
            },
            link: 'https://github.com/aekozhevnikov/VincenzoBot',
            featured: true,
            order: 7,
            leftSided: true,
            showImage: true,
            highlights: [
                'Продуктовая система на 8,000+ клиентов в сети ресторанов',
                'Полный DevOps стек: Docker, Traefik, Vault, Ansible, K8s, AWS, Grafana, Prometheus, Loki, Alertmanager',
                'Автоматические бэкапы PostgreSQL на Яндекс Диск с Transparent Data Encryption (Percona)',
                'Сложные интеграции: IIKO лояльность, GetIt бонусы, VSEM EDI, отзывы 2GIS/Яндекс',
                'Высокое качество кода: 10/10 pylint, strict mypy, полное покрытие тестами (unit/integration/e2e)',
                'Модульная асинхронная архитектура с SQLAlchemy ORM, FastAPI, aiogram 3',
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
            name: 'Иван Петров',
            testimony: 'Профессиональный подход к работе, качественный код и соблюдение сроков.',
            testimony2:
                'Антон проявил себя как высококвалифицированный специалист, способный решать сложные задачи.',
            position: 'Руководитель IT отдела, TechCorp',
            initials: 'ИП',
        },
        {
            name: 'Мария Сидорова',
            testimony:
                'Работа выполнена на высоком уровне, решение было масштабируемым и поддерживаемым.',
            position: 'CEO, StartupX',
            initials: 'МС',
        },
    ],
    socials: socials,
    services: [
        {
            title: 'Фронтенд',
            description:
                'Создание современных отзывчивых веб-приложений с использованием последних технологий.',
            icon: 'code',
            color: 'primary',
        },
        {
            title: 'Бэкенд',
            description:
                'Создание надежных и масштабируемых серверных приложений, RESTful API и микросервисов.',
            icon: 'memory',
            color: 'primary',
        },
        {
            title: 'UI/UX дизайн',
            description:
                'Проектирование красивого и интуитивно понятного пользовательского интерфейса и опыта.',
            icon: 'palette',
            color: 'secondary',
        },
        {
            title: 'Консультации',
            description:
                'Экспертные консультации по выбору технологиологического стека и архитектурных решений.',
            icon: 'psychology',
            color: 'accent',
        },
    ],
}
