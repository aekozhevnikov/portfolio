<template>
    <footer :class="`${footerClass} q-pa-md`">
        <div class="q-mx-auto" style="max-width: 1200px">
            <!-- Navigation Links -->
            <div
                class="row justify-center items-center q-gutter-xs q-mb-lg q-pt-lg q-pb-lg q-bt-thin"
            >
                <div class="col-auto" v-for="section in sections" :key="section.id">
                    <q-btn
                        flat
                        :label="t(section.label)"
                        class="text-weight-medium text-body2 q-px-md q-py-sm"
                        style="border-radius: 20px"
                        @click="scrollToSection(section.id)"
                    />
                </div>
            </div>

            <!-- Social Links -->
            <div class="text-center q-mb-md">
                <div class="text-h6 text-weight-bold q-mb-md">
                    {{ t('footer.followMe') }}
                </div>
                <div class="row justify-center items-center q-gutter-md">
                    <div class="col-auto" v-for="(social, index) in socialLinks" :key="index">
                        <q-btn
                            round
                            flat
                            class="transition-slow"
                            size="md"
                            :href="social.link"
                            target="_blank"
                            rel="noopener noreferrer"
                            :icon="getSocialIcon(social.name)"
                            :style="{
                                color:
                                    social.name === 'GitHub' && $q.dark.isActive
                                        ? 'white'
                                        : social.color,
                            }"
                        />
                    </div>
                </div>
            </div>

            <!-- Copyright -->
            <div class="text-center">
                <div class="text-caption text-grey-5">
                    © {{ currentYear }} {{ siteStore.config.personal.name }}.
                    {{ t('footer.allRightsReserved') }}
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSiteStore } from 'src/app/stores/siteStore'
import { SocialLink } from 'src/config/site.config'
import { useQuasar } from 'quasar'
import { getSocialIcon } from 'src/utils/socialIcons'

const { t } = useI18n()
const siteStore = useSiteStore()
const $q = useQuasar()

const currentYear = computed(() => new Date().getFullYear())
const footerClass = computed(() => {
    return $q.dark.isActive ? 'bg-dark text-white' : 'bg-grey-2 text-grey-9'
})

interface Section {
    id: string
    label: string
}

const sections = ref<Section[]>([
    { id: 'about', label: 'nav.about' },
    { id: 'projects', label: 'nav.projects' },
    { id: 'services', label: 'nav.services' },
    { id: 'skills', label: 'nav.skills' },
    { id: 'reviews', label: 'nav.reviews' },
    { id: 'contact', label: 'nav.contact' },
])

const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
        if (element.id === 'about') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
        } else {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }
}

// We need to import and share activeSection state from NavBar or implement similar
// For now, let's just use the same scroll logic. Active highlighting will be handled by the main scroll listener in NavBar

const socialLinks = computed(() => {
    const configuredSocials = siteStore.config.socials || []

    if (configuredSocials.length > 0) {
        return configuredSocials.map((social: SocialLink) => ({
            name: social.name,
            icon: social.icon || 'link',
            color: social.color || 'primary',
            link: social.link,
        }))
    }

    return <
        {
            name: string
            icon: string
            color: string
            link: string
        }[]
    >[]
})
</script>
