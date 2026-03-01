export const getSocialIcon = (socialName: string): string => {
    const iconMap: Record<string, string> = {
        GitHub: 'fab fa-github',
        LinkedIn: 'fab fa-linkedin',
        Email: 'fas fa-envelope',
        Twitter: 'fab fa-twitter',
        X: 'fab fa-x-twitter',
        Facebook: 'fab fa-facebook',
        Instagram: 'fab fa-instagram',
        Telegram: 'fab fa-telegram',
        WhatsApp: 'fab fa-whatsapp',
        YouTube: 'fab fa-youtube',
        CodePen: 'fab fa-codepen',
        'Stack Overflow': 'fab fa-stack-overflow',
        Dribbble: 'fab fa-dribbble',
        Behance: 'fab fa-behance',
        Medium: 'fab fa-medium',
        'Dev.to': 'fab fa-dev',
        GitLab: 'fab fa-gitlab',
        Bitbucket: 'fab fa-bitbucket',
        VK: 'fab fa-vk',
        OK: 'fab fa-odnoklassniki',
    }

    return iconMap[socialName] || 'fas fa-link'
}
