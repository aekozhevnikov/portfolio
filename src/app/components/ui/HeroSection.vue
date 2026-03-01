<template>
    <section class="q-pa-xl" id="about">
        <div class="items-center text-center">
            <div class="row justify-center">
                <div class="col-12 col-md-8">
                    <!-- Profile Image -->
                    <div class="q-mb-lg">
                        <q-avatar
                            size="300px"
                            class="profile-avatar bg-surface shadow-10 border-default"
                            style="
                                border-color: var(--color-light);
                                transition: transform 0.3s ease;
                            "
                        >
                            <img :src="profileImage" alt="Profile" />
                        </q-avatar>
                    </div>

                    <!-- Name & Title -->
                    <h1 class="text-h2 text-weight-bold text-primary q-mb-sm">
                        {{ personalInfo.name }}
                    </h1>
                    <h2 class="text-h4 text-weight-medium theme-text-secondary q-mb-lg">
                        {{ personalInfo.title }}
                    </h2>

                    <!-- Location & Contact -->
                    <div class="row justify-center items-center q-gutter-md q-mb-lg">
                        <div class="row items-center q-gutter-sm">
                            <q-icon name="location_on" color="primary" />
                            <span class="text-body1">{{ personalInfo.location }}</span>
                        </div>
                        <div class="row items-center q-gutter-sm">
                            <q-icon name="email" color="primary" />
                            <a
                                :href="`mailto:${personalInfo.email}`"
                                class="contact-email"
                                style="
                                    color: var(--q-primary);
                                    text-decoration: none;
                                    font-weight: 500;
                                    transition: color 0.3s ease;
                                "
                            >
                                {{ personalInfo.email }}
                            </a>
                        </div>
                    </div>

                    <!-- Description -->
                    <p
                        class="text-h6 theme-text-secondary q-mb-xl"
                        style="max-width: 700px; margin: 0 auto"
                    >
                        {{ personalInfo.description }}
                    </p>

                    <!-- CTA Buttons -->
                    <div class="row justify-center q-gutter-md q-mt-md">
                        <q-btn
                            :label="t('landing.cvButton')"
                            icon="download"
                            color="primary"
                            size="md"
                            rounded
                            @click="downloadCV"
                            :loading="isGenerating"
                            class="cta-button q-px-md q-py-sm flex items-center justify-center"
                        />
                        <q-btn
                            :label="t('landing.contactButton')"
                            icon="mail"
                            color="secondary"
                            size="md"
                            rounded
                            @click="scrollToContact"
                            class="cta-button q-px-md q-py-sm flex items-center justify-center"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSiteStore } from 'src/app/stores/siteStore'
import { useQuasar } from 'quasar'
import { theme } from 'src/config/theme.config'
import { downloadResumePDF } from 'src/utils/resumePDF'

const { t, locale } = useI18n()
const $q = useQuasar()
const siteStore = useSiteStore()
const personalInfo = computed(() => siteStore.config.personal)
const isGenerating = ref(false)

const downloadCV = async () => {
    try {
        isGenerating.value = true

        $q.notify({
            message: t('common.loading'),
            position: 'top',
            timeout: 2000,
            classes: 'br-15',
        })

        // Always use light theme for PDF
        const isDark = false

        // Use the utility function to generate and download PDF
        await downloadResumePDF(siteStore.config, locale.value, isDark)

        $q.notify({
            message: t('common.success'),
            position: 'top',
            timeout: 3000,
            classes: 'br-15',
        })
    } catch (error) {
        console.error('Error generating PDF:', error)
        $q.notify({
            message: t('common.error'),
            position: 'top',
            timeout: 3000,
            classes: 'br-15',
        })
    } finally {
        isGenerating.value = false
    }
}

const getHeroGradient = () => {
    return $q.dark.isActive
        ? `linear-gradient(135deg, ${theme.darkHeroGradientStart} 0%, ${theme.darkHeroGradientEnd} 100%)`
        : `linear-gradient(135deg, ${theme.heroGradientStart} 0%, ${theme.heroGradientEnd} 100%)`
}

const profileImage = computed(() => {
    return personalInfo.value.image || '/profile-placeholder.jpg'
})

const scrollToContact = () => {
    const element = document.getElementById('contact')
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}
</script>

<style scoped lang="scss">
/* Hover effects */
.profile-avatar:hover {
    transform: scale(1.05) !important;
}

.contact-email:hover {
    color: var(--q-primary-dark) !important;
    text-decoration: underline !important;
}

.cta-button:hover {
    transform: translateY(-2px) !important;
}
</style>
