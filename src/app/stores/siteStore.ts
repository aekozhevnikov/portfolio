import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { type Project, type SiteConfig } from 'src/config/site.config'
import { defaultSiteConfigEn } from 'src/config/site.config.en'
import { defaultSiteConfigRu } from 'src/config/site.config.ru'
import { ProjectConfig } from 'src/config/projects.config'

export const useSiteStore = defineStore('site', () => {
    const { locale } = useI18n()
    const config = ref<SiteConfig>(
        locale.value === 'en' ? defaultSiteConfigEn : defaultSiteConfigRu,
    )

    // Загрузка конфигурации в зависимости от локали
    const loadConfigByLocale = () => {
        config.value = locale.value === 'en' ? defaultSiteConfigEn : defaultSiteConfigRu
    }

    // Следим за изменением локали
    watch(locale, () => {
        loadConfigByLocale()
    })

    // Загрузка конфигурации (в будущем можно добавить загрузку с сервера)
    const loadConfig = (newConfig: SiteConfig) => {
        const baseConfig = locale.value === 'en' ? defaultSiteConfigEn : defaultSiteConfigRu
        config.value = { ...baseConfig, ...newConfig }
    }

    // Обновление персональной информации
    const updatePersonal = (personal: Partial<SiteConfig['personal']>) => {
        config.value.personal = { ...config.value.personal, ...personal }
    }

    // Добавление проекта
    const addProject = (project: Partial<Project>) => {
        const newProject: Project = {
            id: Date.now().toString(),
            title: project.title || '',
            description: project.description || '',
            technologies: project.technologies || {},
            link: project.link,
            codeLink: project.codeLink,
            image: project.image,
            featured: project.featured || false,
            order: project.order || 1,
            leftSided: project.leftSided || false,
            private: project.private || false,
            showImage: project.showImage !== undefined ? project.showImage : true,
            highlights: project.highlights,
            customStyle: project.customStyle,
        }
        config.value.projects.push(newProject)
        config.value.projects.sort((a: Project, b: Project) => (a.order || 0) - (b.order || 0))
    }

    // Обновление проекта
    const updateProject = (id: string, updates: Partial<ProjectConfig>) => {
        const index = config.value.projects.findIndex((p: Project) => p.id === id)
        if (index !== -1) {
            config.value.projects[index] = {
                ...config.value.projects[index],
                ...updates,
            } as Project
            config.value.projects.sort((a: Project, b: Project) => (a.order || 0) - (b.order || 0))
        }
    }

    // Удаление проекта
    const deleteProject = (id: string) => {
        config.value.projects = config.value.projects.filter((p: Project) => p.id !== id)
    }

    // Обновление навыков
    const updateSkills = (skills: Partial<SiteConfig['skills']>) => {
        if (skills.categories) {
            // Merge categories: keep existing and add new ones
            const existingCategories = config.value.skills?.categories || []
            const newCategories = skills.categories.filter(
                newCat => !existingCategories.some(existingCat => existingCat.category === newCat.category)
            )
            config.value.skills = {
                ...config.value.skills,
                ...skills,
                categories: [...existingCategories, ...newCategories],
            }
        } else {
            config.value.skills = { ...config.value.skills, ...skills }
        }
    }

    // Получение проектов из стора (для совместимости)
    const getFeaturedProjectsFromStore = computed(() => {
        return config.value.projects
            .filter((p: Project) => p.featured)
            .sort((a: Project, b: Project) => (a.order || 0) - (b.order || 0))
    })

    const getAllProjectsFromStore = computed(() => {
        return config.value.projects.sort(
            (a: Project, b: Project) => (a.order || 0) - (b.order || 0),
        )
    })

    return {
        config,
        loadConfig,
        updatePersonal,
        addProject,
        updateProject,
        deleteProject,
        updateSkills,
        getFeaturedProjectsFromStore,
        getAllProjectsFromStore,
    }
})
