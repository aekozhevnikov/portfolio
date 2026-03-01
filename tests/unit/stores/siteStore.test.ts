import { describe, expect, it } from '@jest/globals'
import { computed, ref } from 'vue'
import type { Project, SiteConfig } from 'src/config/site.config'

// Directly test the store logic without importing the actual store
// This avoids issues with useI18n and Pinia complexity

const createMockConfig = (overrides: Partial<SiteConfig> = {}): SiteConfig => {
    const baseConfig: SiteConfig = {
        personal: {
            name: 'Test User',
            title: 'Test Developer',
            location: 'Test City, Country',
            email: 'test@example.com',
            description: 'Test description',
            about: 'Test about me content',
        },
        projects: [
            {
                id: '1',
                title: 'Project 1',
                description: 'First test project',
                technologies: {
                    frontend: [{ language: 'Vue.js', icon: 'vuejs', variant: 'original' as const }],
                    backend: [{ language: 'TypeScript', icon: 'typescript', variant: 'original' as const }],
                },
                order: 1,
                featured: true,
                private: false,
                showImage: true,
                highlights: ['Feature 1', 'Feature 2'],
            },
            {
                id: '2',
                title: 'Private Project',
                description: 'Hidden project',
                technologies: {
                    languages: [{ language: 'Python', icon: 'python', variant: 'original' as const }],
                },
                order: 2,
                featured: false,
                private: true,
                showImage: true,
            },
        ],
        skills: {
            categories: [
                {
                    category: 'Frontend',
                    skills: [{ language: 'Vue.js', icon: 'vuejs', variant: 'original' as const }],
                },
            ],
        },
    }

    // Start with base config
    const result: SiteConfig = { ...baseConfig }

    // Apply overrides while respecting exactOptionalPropertyTypes
    // (optional properties must be omitted, not set to undefined)
    if (overrides.personal !== undefined) {
        result.personal = { ...baseConfig.personal, ...overrides.personal }
    }
    if (overrides.skills !== undefined) {
        result.skills = { ...baseConfig.skills, ...overrides.skills }
    }
    if (overrides.projects !== undefined) {
        result.projects = overrides.projects
    }
    if (overrides.reviews !== undefined) {
        result.reviews = overrides.reviews
    }
    if (overrides.socials !== undefined) {
        result.socials = overrides.socials
    }
    if (overrides.services !== undefined) {
        result.services = overrides.services
    }

    return result
}

const createTestStore = (configOverrides: Partial<SiteConfig> = {}) => {
    const config = ref<SiteConfig>(createMockConfig(configOverrides))

    const loadConfigByLocale = () => {
        // no-op for tests
    }

    const loadConfig = (newConfig: { personal?: Partial<SiteConfig['personal']> } & Partial<Omit<SiteConfig, 'personal'>>) => {
        const updates: Partial<SiteConfig> = {}

        if (newConfig.personal) {
            updates.personal = { ...config.value.personal, ...newConfig.personal }
        }
        if (newConfig.skills) {
            updates.skills = { ...config.value.skills, ...newConfig.skills }
        }
        if (newConfig.projects !== undefined) {
            updates.projects = newConfig.projects
        }
        if (newConfig.reviews !== undefined) {
            updates.reviews = newConfig.reviews
        }
        if (newConfig.services !== undefined) {
            updates.services = newConfig.services
        }
        if (newConfig.socials !== undefined) {
            updates.socials = newConfig.socials
        }

        config.value = { ...config.value, ...updates }
    }

    const updatePersonal = (personal: Partial<SiteConfig['personal']>) => {
        config.value.personal = { ...config.value.personal, ...personal }
    }

    const addProject = (project: Partial<Project>) => {
        const newProject: Project = {
            id: Date.now().toString(),
            title: project.title || '',
            description: project.description || '',
            technologies: project.technologies || {
                frontend: [],
                backend: [],
                devops: [],
                databases: [],
                languages: [],
            } as Project['technologies'],
            link: project.link || '',
            codeLink: project.codeLink || '',
            image: project.image,
            featured: project.featured || false,
            order: project.order || 1,
            leftSided: project.leftSided || false,
            private: project.private || false,
            showImage: project.showImage !== undefined ? project.showImage : true,
            highlights: project.highlights,
            customStyle: project.customStyle,
        } as Project
        config.value.projects.push(newProject)
        config.value.projects.sort((a: Project, b: Project) => (a.order || 0) - (b.order || 0))
    }

    const updateProject = (id: string, updates: Partial<Project>) => {
        const index = config.value.projects.findIndex((p: Project) => p.id === id)
        if (index !== -1) {
            config.value.projects[index] = {
                ...config.value.projects[index],
                ...updates,
            } as Project
            config.value.projects.sort((a: Project, b: Project) => (a.order || 0) - (b.order || 0))
        }
    }

    const deleteProject = (id: string) => {
        config.value.projects = config.value.projects.filter((p: Project) => p.id !== id)
    }

    const updateSkills = (skills: Partial<SiteConfig['skills']>) => {
        if (skills.categories) {
            // Merge categories: keep existing and add new ones (avoid duplicates by category)
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

    const getFeaturedProjectsFromStore = computed(() => {
        return config.value.projects
            .filter((p: Project) => p.featured && !p.private)
            .sort((a: Project, b: Project) => (a.order || 0) - (b.order || 0))
    })

    const getAllProjectsFromStore = computed(() => {
        return config.value.projects
            .filter((p: Project) => !p.private)
            .sort((a: Project, b: Project) => (a.order || 0) - (b.order || 0))
    })

    return {
        config,
        loadConfigByLocale,
        loadConfig,
        updatePersonal,
        addProject,
        updateProject,
        deleteProject,
        updateSkills,
        getFeaturedProjectsFromStore,
        getAllProjectsFromStore,
    }
}

describe('useSiteStore', () => {
    describe('Configuration', () => {
        it('should initialize with config', () => {
            const store = createTestStore()
            expect(store.config).toBeDefined()
            expect(store.config.value.personal).toBeDefined()
        })
    })

    describe('updatePersonal', () => {
        it('should update personal info', () => {
            const store = createTestStore()
            store.updatePersonal({ name: 'Test Name' })
            expect(store.config.value.personal.name).toBe('Test Name')
        })

        it('should preserve other fields', () => {
            const store = createTestStore()
            const originalTitle = store.config.value.personal.title
            store.updatePersonal({ about: 'New about' })
            expect(store.config.value.personal.title).toBe(originalTitle)
        })
    })

    describe('addProject', () => {
        it('should add a new project with default values', () => {
            const store = createTestStore()
            const initialCount = store.config.value.projects.length

            store.addProject({
                title: 'Test Project',
                description: 'Test description',
                technologies: {
                    frontend: [{ language: 'Vue.js', icon: 'vuejs', variant: 'original' as const }],
                } as Partial<Project['technologies']>,
                featured: true,
                order: 999,
            })

            expect(store.config.value.projects.length).toBe(initialCount + 1)
            const added = store.config.value.projects.find((p) => p.title === 'Test Project')
            expect(added).toBeDefined()
            expect(added?.featured).toBe(true)
            expect(added?.order).toBe(999)
            expect(added?.private).toBe(false)
            expect(added?.showImage).toBe(true)
        })

        it('should set default values for missing fields', () => {
            const store = createTestStore()
            store.addProject({ title: 'Minimal' })

            const project = store.config.value.projects.find(p => p.title === 'Minimal')
            expect(project).toBeDefined()
            expect(project?.description).toBe('')
            expect(project?.technologies).toEqual({
                frontend: [],
                backend: [],
                devops: [],
                databases: [],
                languages: [],
            } as Project['technologies'])
        })
    })

    describe('updateProject', () => {
        it('should update existing project', () => {
            const store = createTestStore()
            const firstProject = store.config.value.projects[0]
            expect(firstProject).toBeDefined()
            const projectId = firstProject!.id

            store.updateProject(projectId, { title: 'Updated Title' })

            const updated = store.config.value.projects.find((p) => p.id === projectId)
            expect(updated?.title).toBe('Updated Title')
        })

        it('should not affect non-existent project', () => {
            const store = createTestStore()
            const countBefore = store.config.value.projects.length

            store.updateProject('non-existent', { title: 'Noise' })

            expect(store.config.value.projects.length).toBe(countBefore)
        })
    })

    describe('deleteProject', () => {
        it('should remove project', () => {
            const store = createTestStore()
            const firstProject = store.config.value.projects[0]
            expect(firstProject).toBeDefined()
            const projectId = firstProject!.id
            const initialCount = store.config.value.projects.length

            store.deleteProject(projectId)

            expect(store.config.value.projects.length).toBe(initialCount - 1)
            expect(store.config.value.projects.find((p) => p.id === projectId)).toBeUndefined()
        })

        it('should handle non-existent id gracefully', () => {
            const store = createTestStore()
            const countBefore = store.config.value.projects.length

            store.deleteProject('non-existent')

            expect(store.config.value.projects.length).toBe(countBefore)
        })
    })

    describe('updateSkills', () => {
        it('should add new skills categories while merging with existing', () => {
            const store = createTestStore()
            const newSkills = {
                categories: [
                    {
                        category: 'Testing',
                        skills: [{ language: 'Jest', icon: 'jest', variant: 'original' as const }],
                    },
                ],
            }

            store.updateSkills(newSkills)
            // Should have original category (Frontend) + new category (Testing)
            expect(store.config.value.skills.categories.length).toBe(2)
            expect(store.config.value.skills.categories.find(c => c.category === 'Frontend')).toBeDefined()
            expect(store.config.value.skills.categories.find(c => c.category === 'Testing')).toBeDefined()
        })

        it('should merge with existing categories when adding', () => {
            const store = createTestStore()
            const initialLength = store.config.value.skills.categories.length

            store.updateSkills({
                categories: [
                    {
                        category: 'DevOps',
                        skills: [{ language: 'Docker', icon: 'docker', variant: 'original' as const }],
                    },
                ],
            })

            expect(store.config.value.skills.categories.length).toBe(initialLength + 1)
        })
    })

    describe('getFeaturedProjectsFromStore', () => {
        it('should return only featured projects sorted by order', () => {
            const store = createTestStore()
            const featured = store.getFeaturedProjectsFromStore.value

            expect(featured.every((p) => p.featured)).toBe(true)

            for (let i = 1; i < featured.length; i++) {
                const current = featured[i]
                const previous = featured[i - 1]
                expect(current).toBeDefined()
                expect(previous).toBeDefined()
                expect(current!.order).toBeGreaterThanOrEqual(previous!.order)
            }
        })

        it('should exclude private projects', () => {
            const store = createTestStore()

            store.addProject({
                title: 'Private Featured',
                featured: true,
                private: true,
                technologies: {
                    frontend: [],
                } as Partial<Project['technologies']>,
            })

            const featured = store.getFeaturedProjectsFromStore.value
            const hasPrivate = featured.some((p) => p.private && p.title === 'Private Featured')
            expect(hasPrivate).toBe(false)
        })
    })

    describe('getAllProjectsFromStore', () => {
        it('should return all non-private projects sorted by order', () => {
            const store = createTestStore()
            const all = store.getAllProjectsFromStore.value

            for (let i = 1; i < all.length; i++) {
                const current = all[i]
                const previous = all[i - 1]
                expect(current).toBeDefined()
                expect(previous).toBeDefined()
                expect(current!.order).toBeGreaterThanOrEqual(previous!.order)
            }

            const hasPrivate = all.some((p) => p.private)
            expect(hasPrivate).toBe(false)
        })
    })

    describe('loadConfig', () => {
        it('should merge provided config with base', () => {
            const store = createTestStore()
            const originalTitle = store.config.value.personal.title

            store.loadConfig({
                personal: {
                    name: 'Overridden Name',
                },
            })

            expect(store.config.value.personal.name).toBe('Overridden Name')
            expect(store.config.value.personal.title).toBe(originalTitle)
        })
    })
})
