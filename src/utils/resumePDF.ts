import type { SiteConfig } from 'src/config/site.config'
import pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'

;(pdfMake as any).vfs = pdfFonts as any

// Helper to sanitize filename
export const sanitizeFilename = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9а-яё-]/g, '_')
        .substring(0, 100)
}

// Helper function to get translations
export const getResumeTranslations = (
    locale: string,
): { about: string; skills: string; projects: string; services: string; social: string } => {
    const translationsMap: Record<
        string,
        { about: string; skills: string; projects: string; services: string; social: string }
    > = {
        en: {
            about: 'About Me',
            skills: 'Skills',
            projects: 'Projects',
            services: 'Services',
            social: 'Social Links',
        },
        ru: {
            about: 'Обо мне',
            skills: 'Навыки',
            projects: 'Проекты',
            services: 'Услуги',
            social: 'Социальные сети',
        },
    }

    return (translationsMap[locale] || translationsMap.en) as {
        about: string
        skills: string
        projects: string
        services: string
        social: string
    }
}

// Build PDF document definition (JSON structure for pdfmake)
export const buildPDFDocument = (
    config: SiteConfig,
    currentLocale: string,
    isDark: boolean,
): any => {
    const personal = config.personal
    const projects = [...config.projects].sort((a, b) => a.order - b.order)
    const skills = config.skills
    const services = config.services
    const socials = config.socials || []

    // Get translations based on locale
    const translations = getResumeTranslations(currentLocale)

    // Цвета в зависимости от темы
    const colors = isDark
        ? {
              primary: '#6366f1',
              text: '#ffffff',
              textSecondary: '#b0b0b0',
              border: '#2a2a2a',
              background: '#0a0a0a',
              tagBg: '#1e1e1e',
              tagText: '#ffffff',
          }
        : {
              primary: '#6366f1',
              text: '#0a0a0a',
              textSecondary: '#475569',
              border: '#e5e7eb',
              background: '#ffffff',
              tagBg: '#f8f9fa',
              tagText: '#0a0a0a',
          }

    // Return document definition directly
    return {
        pageSize: 'A4',
        pageOrientation: 'portrait',
        pageMargins: [20, 20, 20, 20],
        defaultStyle: {
            font: 'Roboto',
            fontSize: 10,
            lineHeight: 1.4,
            color: colors.text,
        },
        pageColor: colors.background,
        content: (() => {
            const content: any[] = []

            // Header
            content.push({
                columns: [
                    {
                        width: '*',
                        stack: [
                            {
                                text: personal.name,
                                style: 'name',
                                margin: [0, 0, 0, 5],
                            },
                            {
                                text: personal.title,
                                style: 'title',
                                color: colors.textSecondary,
                            },
                        ],
                    },
                    {
                        width: 'auto',
                        stack: [
                            ...(personal.location
                                ? [
                                      {
                                          text: personal.location,
                                          style: 'contact',
                                          textAlign: 'right',
                                          margin: [0, 0, 0, 3],
                                      },
                                  ]
                                : []),
                            ...(personal.email
                                ? [
                                      {
                                          text: personal.email,
                                          style: 'contact',
                                          textAlign: 'right',
                                      },
                                  ]
                                : []),
                        ],
                    },
                ],
                layout: {
                    align: 'top',
                },
                margin: [0, 0, 0, 15],
            })

            // Divider line
            content.push({
                canvas: [
                    {
                        type: 'line',
                        x1: 0,
                        y1: 0,
                        x2: 555,
                        y2: 0,
                        lineWidth: 1,
                        lineColor: isDark ? '#4f46e5' : '#6366f1',
                    },
                ],
            })

            // About Section
            if (personal.about) {
                content.push({
                    text: translations.about,
                    style: 'sectionTitle',
                    margin: [0, 15, 0, 8],
                })
                content.push({
                    text: personal.about,
                    style: 'text',
                    margin: [0, 0, 0, 15],
                })
            }

            // Skills Section
            if (skills?.categories && skills.categories.length > 0) {
                content.push({
                    text: translations.skills,
                    style: 'sectionTitle',
                    margin: [0, 0, 0, 10],
                })
                content.push({
                    columns: skills.categories.map((category) => ({
                        width: '*',
                        stack: [
                            {
                                text: category.category,
                                style: 'categoryTitle',
                                margin: [0, 0, 0, 5],
                            },
                            {
                                stack: category.skills.map((skill) => ({
                                    text: skill.language,
                                    style: 'skillItem',
                                })),
                                margin: [0, 0, 0, 10],
                            },
                        ],
                    })),
                    columnGap: 20,
                    margin: [0, 0, 0, 15],
                })
            }

            // Projects Section
            if (projects.length > 0) {
                content.push({
                    text: translations.projects,
                    style: 'sectionTitle',
                    margin: [0, 0, 0, 10],
                })

                projects.forEach((project) => {
                    content.push({
                        text: project.title,
                        style: 'projectTitle',
                    })
                    content.push({
                        text: project.description,
                        style: 'text',
                        margin: [0, 0, 0, 5],
                    })
                    // Flatten technologies from categorized structure to simple array
                    const techArray: string[] = []
                    if (project.technologies) {
                        const techObj = project.technologies as any
                        if (techObj.frontend)
                            techObj.frontend.forEach((t: any) => techArray.push(t.language))
                        if (techObj.backend)
                            techObj.backend.forEach((t: any) => techArray.push(t.language))
                        if (techObj.devops)
                            techObj.devops.forEach((t: any) => techArray.push(t.language))
                        if (techObj.databases)
                            techObj.databases.forEach((t: any) => techArray.push(t.language))
                        if (techObj.languages)
                            techObj.languages.forEach((t: any) => techArray.push(t.language))
                    }

                    if (techArray.length > 0) {
                        content.push({
                            stack: techArray.map((tech) => ({
                                text: tech,
                                style: 'tech',
                                backgroundColor: colors.primary,
                                color: '#ffffff',
                                padding: [2, 6],
                                margin: [0, 0, 6, 0],
                                borderRadius: 3,
                            })),
                            margin: [0, 0, 0, 8],
                        })
                    }

                    // Project links (Demo & Code)
                    const projectLinks: any[] = []
                    if (project.link) {
                        projectLinks.push({
                            text: 'Live Demo',
                            link: project.link.startsWith('http')
                                ? project.link
                                : `https://${project.link}`,
                            color: colors.primary,
                            decoration: 'underline',
                            margin: [0, 0, 5, 0],
                        })
                    }
                    if (project.codeLink) {
                        projectLinks.push({
                            text: 'GitHub',
                            link: project.codeLink.startsWith('http')
                                ? project.codeLink
                                : `https://${project.codeLink}`,
                            color: colors.primary,
                            decoration: 'underline',
                            margin: [0, 0, 5, 0],
                        })
                    }
                    if (projectLinks.length > 0) {
                        content.push({
                            stack: projectLinks,
                            margin: [0, 0, 0, 12],
                        })
                    }

                    if (project.highlights && project.highlights.length) {
                        content.push({
                            ul: project.highlights.map((h) => ({ text: h })),
                            style: 'list',
                            margin: [0, 0, 0, 12],
                        })
                    }
                })
            }

            // Services Section
            if (services && services.length > 0) {
                content.push({
                    text: translations.services,
                    style: 'sectionTitle',
                    margin: [0, 20, 0, 10],
                })
                content.push({
                    table: {
                        body: services.map((service) => [
                            {
                                text: service.title,
                                style: 'serviceTitle',
                            },
                            {
                                text: service.description,
                                style: 'text',
                            },
                        ]),
                    },
                    margin: [0, 0, 0, 15],
                })
            }

            // Social Links Section
            if (socials.length > 0) {
                const socialItems = socials.map((social) => {
                    let displayUrl = social.link
                    let linkUrl = social.link
                    // For mailto links, show only email without mailto:
                    if (social.link.startsWith('mailto:')) {
                        displayUrl = social.link.replace('mailto:', '')
                        linkUrl = social.link // keep mailto: for actual link
                    } else if (!social.link.startsWith('http')) {
                        linkUrl = `https://${social.link}`
                    }
                    return {
                        text: `${social.name}: ${displayUrl}`,
                        link: linkUrl,
                    }
                })

                content.push({
                    text: translations.social,
                    style: 'sectionTitle',
                    margin: [0, 20, 0, 10],
                })
                content.push({
                    ul: socialItems,
                    margin: [0, 0, 0, 0],
                })
            }

            return content
        })(),

        styles: {
            name: {
                fontSize: 18,
                bold: true,
                color: colors.text,
            },
            title: {
                fontSize: 12,
                color: colors.textSecondary,
            },
            contact: {
                fontSize: 9,
                color: colors.textSecondary,
            },
            sectionTitle: {
                fontSize: 12,
                bold: true,
                color: colors.text,
                margin: [0, 10, 0, 5],
            },
            categoryTitle: {
                fontSize: 10,
                bold: true,
                color: colors.text,
                margin: [0, 0, 0, 4],
            },
            skillItem: {
                fontSize: 9,
                backgroundColor: colors.tagBg,
                color: colors.tagText,
                padding: [2, 6],
                margin: [0, 0, 4, 0],
                borderRadius: 3,
            },
            projectTitle: {
                fontSize: 11,
                bold: true,
                color: colors.text,
                margin: [0, 0, 0, 4],
            },
            text: {
                fontSize: 9,
                color: colors.textSecondary,
            },
            tech: {
                fontSize: 8,
                backgroundColor: colors.primary,
                color: '#ffffff',
                padding: [2, 6],
                margin: [0, 0, 3, 0],
                borderRadius: 3,
            },
            list: {
                fontSize: 9,
                color: colors.textSecondary,
                margin: [0, 0, 0, 8],
            },
            serviceTitle: {
                fontSize: 10,
                bold: true,
                color: colors.text,
            },
        },
    }
}

// Main function to generate and download PDF
export const downloadResumePDF = async (
    config: SiteConfig,
    locale: string,
    isDark: boolean,
): Promise<void> => {
    const docDefinition = buildPDFDocument(config, locale, isDark)
    const baseFilename = `${config.personal.name}-resume-${locale}`
    const sanitizedBase = sanitizeFilename(baseFilename)
    const filename = `${sanitizedBase}.pdf`

    // pdfmake automatically generates and downloads
    await pdfMake.createPdf(docDefinition).download(filename)
}
