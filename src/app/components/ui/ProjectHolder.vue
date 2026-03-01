<template>
    <div
        class="project-holder q-pa-lg rounded-borders shadow-2 transition-all br-20 card-light-bg"
        :style="holderStyle"
    >
        <div class="row q-col-gutter-lg">
            <!-- Project Image -->
            <div v-if="project.showImage && project.image" class="col-12 col-md-6">
                <q-img
                    :src="project.image"
                    :alt="project.title"
                    class="rounded-borders br-15"
                    fit="cover"
                    height="250px"
                >
                    <template v-slot:loading>
                        <q-inner-loading showing color="primary" />
                    </template>
                </q-img>
            </div>

            <!-- Project Content -->
            <div :class="project.showImage ? 'col-12 col-md-6' : 'col-12'">
                <div class="project-content flex flex-column justify-center items-start">
                    <!-- Title -->
                    <h3 class="text-h5 text-weight-bold q-mb-md full-width">
                        {{ project.title }}
                    </h3>

                    <!-- Description -->
                    <p class="text-body1 theme-text-secondary q-mb-lg full-width">
                        {{ project.description }}
                    </p>

                    <!-- Highlights -->
                    <div v-if="project.highlights?.length" class="q-mb-xl">
                        <div class="text-subtitle2 text-weight-medium text-primary q-mb-md">
                            {{ t('projects.highlights') }}:
                        </div>
                        <q-list dense class="bg-transparent">
                            <q-item
                                v-for="(highlight, index) in project.highlights"
                                :key="index"
                                class="q-pa-none"
                            >
                                <q-item-section avatar>
                                    <q-icon
                                        name="check_circle"
                                        :style="{ color: project.customStyle?.btnColor }"
                                        size="sm"
                                    />
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label
                                        class="text-body2 theme-text-primary"
                                        style="line-height: 1.6"
                                    >
                                        {{
                                            typeof highlight === 'object' && highlight !== null
                                                ? highlight.text
                                                : highlight
                                        }}
                                    </q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </div>

                    <!-- View Project Button -->
                    <div class="full-width">
                        <q-btn
                            :label="t('projects.view')"
                            :style="{ color: project.customStyle?.btnColor }"
                            size="md"
                            @click="openProjectDialog(project)"
                            outline
                            rounded
                            class="q-px-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Project Modal -->
    <ProjectModal v-model="showModal" :project="selectedProject" @close="closeModal" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Project } from 'src/config/site.config'
import ProjectModal from './ProjectModal.vue'

const { t } = useI18n()

interface Props {
    project: Project
}

const props = defineProps<Props>()

const holderStyle = computed(() => ({
    backgroundColor: props.project.customStyle?.background || 'var(--color-surface)',
    borderColor: props.project.customStyle?.border ? undefined : 'var(--color-border)',
    border: props.project.customStyle?.border || '1px solid var(--color-border)',
}))

const showModal = ref(false)
const selectedProject = ref<Project | null>(null)

const openProjectDialog = (project: Project) => {
    selectedProject.value = project
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    selectedProject.value = null
}
</script>

<style scoped lang="scss">
/* Hover effects */
.project-holder {
    transition: all 0.3s ease-in-out !important;

    &:hover {
        transform: translateY(-4px) !important;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12) !important;
    }
}
</style>
