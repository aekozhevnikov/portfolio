<template>
    <q-dialog
        v-model="showDialog"
        maximized
        transition-show="slide-up"
        transition-hide="slide-down"
    >
        <q-card v-if="project" class="bg-surface">
            <q-card-section class="row items-center justify-between q-pa-md">
                <div class="text-h5 text-weight-bold text-primary">{{ project.title }}</div>
                <q-btn icon="close" flat round dense v-close-popup @click="closeDialog" />
            </q-card-section>

            <q-separator />

            <q-card-section class="scroll" style="max-height: 80vh; overflow-y: auto">
                <div class="q-pa-md">
                    <!-- Gallery -->
                    <div v-if="projectImages.length > 0" class="q-mb-xl">
                        <q-carousel
                            v-model="currentSlide"
                            animated
                            arrows
                            navigation
                            infinite
                            height="500px"
                            class="rounded-borders"
                        >
                            <q-carousel-slide
                                v-for="(img, index) in projectImages"
                                :key="index"
                                :name="index"
                            >
                                <q-img
                                    :src="img"
                                    :alt="`${project.title} - image ${index + 1}`"
                                    fit="contain"
                                />
                            </q-carousel-slide>
                        </q-carousel>
                    </div>

                    <!-- Description -->
                    <div class="text-body1 theme-text-secondary q-mb-xl" style="line-height: 1.8">
                        {{ project.description }}
                    </div>

                    <!-- Technologies by Category -->
                    <div v-if="project.technologies" class="q-mb-xl">
                        <!-- Languages -->
                        <div v-if="project.technologies.languages?.length" class="q-mb-md">
                            <div class="text-subtitle2 text-weight-medium text-primary q-mb-sm">
                                {{ t('expertise.programmingLanguages') }}:
                            </div>
                            <div class="row items-center q-gutter-sm flex flex-wrap">
                                <q-badge
                                    v-for="tech in project.technologies.languages"
                                    :key="tech.language"
                                    class="row items-center q-gutter-xs br-20 q-px-md q-py-sm"
                                    style="background: var(--color-primary-light)"
                                >
                                    <img
                                        v-if="!techImageErrors.has(`${tech.icon}-${tech.variant}`)"
                                        :src="getTechBadgeUrl(tech.icon, tech.variant)"
                                        :alt="tech.language"
                                        :style="style"
                                        @error="handleImageError(`${tech.icon}-${tech.variant}`)"
                                    />
                                    <span class="text-body2 theme-text-primary">{{
                                        tech.language
                                    }}</span>
                                </q-badge>
                            </div>
                        </div>
                        <!-- Frontend -->
                        <div v-if="project.technologies.frontend?.length" class="q-mb-md">
                            <div class="text-subtitle2 text-weight-medium text-primary q-mb-sm">
                                {{ t('expertise.frontend') }}:
                            </div>
                            <div class="row items-center q-gutter-sm flex flex-wrap">
                                <q-badge
                                    v-for="tech in project.technologies.frontend"
                                    :key="tech.language"
                                    class="row items-center q-gutter-xs br-20 q-px-md q-py-sm"
                                    style="background: var(--color-primary-light)"
                                >
                                    <img
                                        v-if="!techImageErrors.has(`${tech.icon}-${tech.variant}`)"
                                        :src="getTechBadgeUrl(tech.icon, tech.variant)"
                                        :alt="tech.language"
                                        :style="style"
                                        @error="handleImageError(`${tech.icon}-${tech.variant}`)"
                                    />
                                    <span class="text-body2 theme-text-primary">{{
                                        tech.language
                                    }}</span>
                                </q-badge>
                            </div>
                        </div>

                        <!-- Backend -->
                        <div v-if="project.technologies.backend?.length" class="q-mb-md">
                            <div class="text-subtitle2 text-weight-medium text-primary q-mb-sm">
                                {{ t('expertise.backend') }}:
                            </div>
                            <div class="row items-center q-gutter-sm flex flex-wrap">
                                <q-badge
                                    v-for="tech in project.technologies.backend"
                                    :key="tech.language"
                                    class="row items-center q-gutter-xs br-20 q-px-md q-py-sm"
                                    style="background: var(--color-primary-light)"
                                >
                                    <img
                                        v-if="!techImageErrors.has(`${tech.icon}-${tech.variant}`)"
                                        :src="getTechBadgeUrl(tech.icon, tech.variant)"
                                        :alt="tech.language"
                                        :style="style"
                                        @error="handleImageError(`${tech.icon}-${tech.variant}`)"
                                    />
                                    <span class="text-body2 theme-text-primary">{{
                                        tech.language
                                    }}</span>
                                </q-badge>
                            </div>
                        </div>

                        <!-- Databases -->
                        <div v-if="project.technologies.databases?.length" class="q-mb-md">
                            <div class="text-subtitle2 text-weight-medium text-primary q-mb-sm">
                                {{ t('expertise.databases') }}:
                            </div>
                            <div class="row items-center q-gutter-sm flex flex-wrap">
                                <q-badge
                                    v-for="tech in project.technologies.databases"
                                    :key="tech.language"
                                    class="row items-center q-gutter-xs br-20 q-px-md q-py-sm"
                                    style="background: var(--color-primary-light)"
                                >
                                    <img
                                        v-if="!techImageErrors.has(`${tech.icon}-${tech.variant}`)"
                                        :src="getTechBadgeUrl(tech.icon, tech.variant)"
                                        :alt="tech.language"
                                        :style="style"
                                        @error="handleImageError(`${tech.icon}-${tech.variant}`)"
                                    />
                                    <span class="text-body2 theme-text-primary">{{
                                        tech.language
                                    }}</span>
                                </q-badge>
                            </div>
                        </div>

                        <!-- DevOps -->
                        <div v-if="project.technologies.devops?.length" class="q-mb-md">
                            <div class="text-subtitle2 text-weight-medium text-primary q-mb-sm">
                                {{ t('expertise.devops') }}:
                            </div>
                            <div class="row items-center q-gutter-sm flex flex-wrap">
                                <q-badge
                                    v-for="tech in project.technologies.devops"
                                    :key="tech.language"
                                    class="row items-center q-gutter-xs br-20 q-px-md q-py-sm"
                                    style="background: var(--color-primary-light)"
                                >
                                    <img
                                        v-if="!techImageErrors.has(`${tech.icon}-${tech.variant}`)"
                                        :src="getTechBadgeUrl(tech.icon, tech.variant)"
                                        :alt="tech.language"
                                        :style="style"
                                        @error="handleImageError(`${tech.icon}-${tech.variant}`)"
                                    />
                                    <span class="text-body2 theme-text-primary">{{
                                        tech.language
                                    }}</span>
                                </q-badge>
                            </div>
                        </div>
                    </div>

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

                    <!-- Action Buttons -->
                    <div
                        class="row q-gutter-md justify-center q-mt-xl"
                        v-if="project.link || project.codeLink"
                    >
                        <q-btn
                            v-if="project.link"
                            :label="t('projects.view')"
                            :color="project.customStyle?.btnColor || 'primary'"
                            size="md"
                            :href="project.link"
                            target="_blank"
                            outline
                            rounded
                        />
                        <q-btn
                            v-if="project.codeLink"
                            :label="t('projects.code')"
                            :color="project.customStyle?.btnColor || 'primary'"
                            size="md"
                            :href="project.codeLink"
                            target="_blank"
                            outline
                            rounded
                            icon="code"
                        />
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Project } from 'src/config/site.config'
import { getDeviconUrl } from 'src/utils/techIcons'

const { t } = useI18n()

// Track image load errors for each tech
const techImageErrors = ref<Set<string>>(new Set())

const handleImageError = (techKey: string) => {
    techImageErrors.value.add(techKey)
}

interface Props {
    modelValue: boolean
    project: Project | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

const showDialog = ref(false)
const currentSlide = ref(0)
const style = 'width: 20px; height: 20px'

const projectImages = computed(() => {
    if (!props.project) return []
    const images = []

    // Main image
    if (props.project.image) {
        images.push(props.project.image)
    }

    // Additional images from assets folder
    if (props.project.id && props.project.images) {
        images.push(...props.project.images)
    }

    return images
})

const closeDialog = () => {
    emit('update:modelValue', false)
}

watch(
    () => props.modelValue,
    (newVal) => {
        showDialog.value = newVal
        if (newVal) {
            currentSlide.value = 0
        }
    },
)

watch(showDialog, (newVal) => {
    emit('update:modelValue', newVal)
})

const getTechBadgeUrl = (tech: string, variant: string) => {
    return getDeviconUrl(tech, variant)
}
</script>

<style scoped lang="scss">
.scroll::-webkit-scrollbar {
    width: 8px;
}

.scroll::-webkit-scrollbar-track {
    background: var(--color-surface);
}

.scroll::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 4px;
}

.scroll::-webkit-scrollbar-thumb:hover {
    background: var(--color-text-secondary);
}
</style>
