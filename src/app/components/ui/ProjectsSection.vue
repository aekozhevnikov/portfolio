<template>
    <section id="projects" class="q-pa-xl" :style="sectionStyle">
        <div class="q-mx-auto" style="max-width: 1500px">
            <div class="text-center q-mb-xl">
                <h2 class="text-h3 text-weight-bold text-primary q-mb-sm">
                    {{ t('projects.title') }}
                </h2>
                <p class="text-h6 theme-text-secondary">
                    {{ t('projects.subtitle') }}
                </p>
            </div>

            <div class="row q-col-gutter-xl">
                <div v-for="project in displayedProjects" :key="project.id" class="col-12 col-md-6">
                    <ProjectHolder :project="project" />
                </div>
            </div>

            <!-- Show all projects button -->
            <div v-if="!showAllProjects && hasMoreProjects" class="text-center q-mt-xl">
                <q-btn
                    :label="t('projects.showAll')"
                    color="primary"
                    size="md"
                    outline
                    rounded
                    @click="showAllProjects = true"
                    class="q-px-lg q-py-sm"
                />
            </div>

            <!-- Hide projects button -->
            <div v-if="showAllProjects && hasMoreProjects" class="text-center q-mt-xl">
                <q-btn
                    :label="t('projects.showLess')"
                    color="primary"
                    size="md"
                    outline
                    rounded
                    @click="showAllProjects = false"
                    class="q-px-lg q-py-sm"
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSiteStore } from 'src/app/stores/siteStore'
import { Project } from 'src/config/site.config'
import ProjectHolder from './ProjectHolder.vue'

const { t } = useI18n()
const siteStore = useSiteStore()

const showAllProjects = ref(false)
const initialLimit = 4

const displayedProjects = computed(() => {
    const filteredProjects = siteStore.config.projects
        .filter((p: Project) => !p.private)
        .sort((a: Project, b: Project) => a.order - b.order)

    return showAllProjects.value ? filteredProjects : filteredProjects.slice(0, initialLimit)
})

const hasMoreProjects = computed(() => {
    const publicProjects = siteStore.config.projects
        .filter((p: Project) => !p.private)
        .sort((a: Project, b: Project) => a.order - b.order)

    return publicProjects.length > initialLimit
})

const sectionStyle = computed(() => ({
    backgroundColor: 'var(--color-page)',
    minHeight: 'auto',
}))
</script>
