<template>
    <div id="skills" class="text-body1 q-py-xl q-px-md">
        <div class="text-h4 text-weight-bold text-center q-pt-lg q-mb-xl">
            {{ t('expertise.title') }}
        </div>
        <div>
            <div
                v-for="(skillCategory, categoryIndex) in skillCategories"
                :key="categoryIndex"
                class="q-mb-xl"
            >
                <div
                    class="text-h6 text-weight-bold text-primary q-mb-lg q-pl-sm relative-position text-center"
                >
                    {{ t(skillCategory.category) }}
                </div>
                <div class="row items-center justify-center q-gutter-md">
                    <div
                        v-for="(skill, skillIndex) in skillCategory.skills"
                        :key="skillIndex"
                        class="br-20 q-pa-sm"
                    >
                        <!-- Devicon icon with tooltip -->
                        <q-tooltip
                            anchor="bottom middle"
                            self="top middle"
                            :offset="[0, 10]"
                            class="bg-primary text-white br-20"
                        >
                            {{ skill.language }}
                        </q-tooltip>
                        <img
                            v-if="!skillImageErrors.has(`${skill.icon}-${skill.variant}`)"
                            :src="getDeviconUrl(skill.icon, skill.variant)"
                            :alt="skill.language"
                            style="width: 48px; height: 48px"
                            @error="handleImageError(`${skill.icon}-${skill.variant}`)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSiteStore } from '../../stores/siteStore'
import { SkillCategory } from 'src/config/site.config'
import { getDeviconUrl } from 'src/utils/techIcons'

const { t } = useI18n()
const siteStore = useSiteStore()

// Track image load errors
const skillImageErrors = ref<Set<string>>(new Set())

const handleImageError = (techKey: string) => {
    skillImageErrors.value.add(techKey)
}

const skillCategories = computed<SkillCategory[]>(() => {
    const categories = siteStore.config.skills?.categories

    if (categories && categories.length > 0) {
        return categories
    } else {
        return <SkillCategory[]>[]
    }
})
</script>
