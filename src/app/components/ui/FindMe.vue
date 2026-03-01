<template>
    <section id="contact" class="q-pa-xl q-py-xl">
        <div class="q-mx-auto" style="max-width: 1200px">
            <div class="text-center q-mb-xl">
                <h2 class="text-h3 text-weight-bold text-primary q-mb-sm">
                    {{ t('contact.title') }}
                </h2>
                <p class="text-h6 theme-text-secondary">
                    {{ t('contact.subtitle') || 'Get in touch with me' }}
                </p>
            </div>

            <div class="row q-col-gutter-xl">
                <!-- Contact Information -->
                <div class="col-12 col-md-4">
                    <div
                        class="contact-info-card q-pa-lg theme-bg-overlay theme-border-default br-15 card-light-bg"
                    >
                        <h4 class="text-h5 text-weight-bold q-mb-lg">
                            {{ t('contact.infoTitle') || 'Contact Information' }}
                        </h4>

                        <div class="q-gutter-y-md">
                            <div class="row items-center q-gutter-sm">
                                <q-icon name="email" color="primary" size="24px" />
                                <div>
                                    <div class="text-caption theme-text-secondary">
                                        {{ t('contact.email') }}
                                    </div>
                                    <div class="text-body1">
                                        <a
                                            :href="`mailto:${personalInfo.email}`"
                                            class="contact-link"
                                        >
                                            {{ personalInfo.email }}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div class="row items-center q-gutter-sm">
                                <q-icon name="location_on" color="primary" size="24px" />
                                <div>
                                    <div class="text-caption theme-text-secondary">
                                        {{ t('contact.location') }}
                                    </div>
                                    <div class="text-body1">{{ personalInfo.location }}</div>
                                </div>
                            </div>

                            <div v-if="personalInfo.title">
                                <div class="row items-center q-gutter-sm">
                                    <q-icon name="badge" color="primary" size="24px" />
                                    <div>
                                        <div class="text-caption text-secondary">
                                            {{ t('contact.position') }}
                                        </div>
                                        <div class="text-body1">{{ personalInfo.title }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Social Links -->
                        <q-separator class="q-my-lg" />

                        <div class="text-subtitle1 text-weight-medium q-mb-md">
                            {{ t('socials.title') || 'Social Networks' }}:
                        </div>
                        <div class="row q-gutter-sm">
                            <div class="col-auto" v-for="(social, index) in socials" :key="index">
                                <q-btn
                                    round
                                    flat
                                    class="social-btn"
                                    size="md"
                                    :href="social.link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    :style="{
                                        color:
                                            social.name === 'GitHub' && $q.dark.isActive
                                                ? 'white'
                                                : social.color,
                                    }"
                                    :icon="getSocialIcon(social.name)"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Contact Form -->
                <div class="col-12 col-md-8">
                    <div
                        class="contact-form-card q-pa-lg theme-bg-surface shadow-2 rounded-borders theme-border-default br-20 card-light-bg"
                    >
                        <h4 class="text-h5 text-weight-bold q-mb-lg">
                            {{ t('contact.formTitle') || 'Send me a message' }}
                        </h4>

                        <q-form @submit="submitForm" class="q-gutter-md">
                            <div class="row q-col-gutter-md q-ml-xs">
                                <div class="col-12 col-md-6">
                                    <q-input
                                        v-model="formData.name"
                                        :label="t('contact.form.name') + '*'"
                                        :rules="[(val) => !!val || t('common.required')]"
                                        outlined
                                        lazy-rules
                                        rounded
                                    />
                                </div>
                                <div class="col-12 col-md-6">
                                    <q-input
                                        v-model="formData.email"
                                        :label="t('contact.form.email') + '*'"
                                        :rules="[
                                            (val) => !!val || t('common.required'),
                                            (val) =>
                                                /.+@.+\..+/.test(val) || t('common.invalidEmail'),
                                        ]"
                                        outlined
                                        rounded
                                        lazy-rules
                                        type="email"
                                    />
                                </div>
                            </div>

                            <div class="row q-col-gutter-md q-ml-xs">
                                <div class="col-12 col-md-6">
                                    <q-input
                                        v-model="formData.subject"
                                        :label="t('contact.form.subject') + '*'"
                                        :rules="[(val) => !!val || t('common.required')]"
                                        outlined
                                        rounded
                                        lazy-rules
                                    />
                                </div>
                                <div class="col-12 col-md-6">
                                    <q-select
                                        v-model="formData.inquiryType"
                                        :label="t('contact.form.type')"
                                        :options="inquiryTypeOptions"
                                        outlined
                                        rounded
                                        emit-value
                                        map-options
                                    />
                                </div>
                            </div>

                            <q-input
                                v-model="formData.message"
                                :label="t('contact.form.message') + '*'"
                                :rules="[(val) => !!val || t('common.required')]"
                                type="textarea"
                                rows="6"
                                outlined
                                rounded
                                lazy-rules
                            />

                            <div class="row items-center justify-between q-mt-md">
                                <div class="text-caption text-secondary">
                                    * {{ t('contact.form.requiredFields') || 'Required fields' }}
                                </div>
                                <div class="row q-gutter-sm form-actions">
                                    <q-btn
                                        :label="t('common.clear')"
                                        flat
                                        type="reset"
                                        @click="resetForm"
                                        class="rounded-borders"
                                    />
                                    <q-btn
                                        :label="t('common.send')"
                                        type="submit"
                                        color="primary"
                                        :loading="submitting"
                                        size="md"
                                        class="rounded-borders"
                                    />
                                </div>
                            </div>
                        </q-form>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, inject, reactive, ref } from 'vue'
import { useSiteStore } from 'src/app/stores/siteStore'
import { useI18n } from 'vue-i18n'
import { Notify, useQuasar } from 'quasar'
import { getSocialIcon } from 'src/utils/socialIcons'
import type { FormHandlerResponse, FormSubmissionRequest } from 'src/types'

const { t } = useI18n()
const $q = useQuasar()
const siteStore = useSiteStore()

// Inject Supabase client that was provided in boot file
const supabase = inject('supabase')

const personalInfo = computed(() => siteStore.config.personal)

const socials = computed(() => {
    const configuredSocials = siteStore.config.socials || []
    return configuredSocials.length > 0 ? configuredSocials : []
})

const inquiryTypeOptions = computed(() => [
    { label: t('contact.inquiryTypes.general'), value: 'general' },
    { label: t('contact.inquiryTypes.project'), value: 'project' },
    { label: t('contact.inquiryTypes.consulting'), value: 'consulting' },
    { label: t('contact.inquiryTypes.other'), value: 'other' },
])

const submitting = ref(false)

const formData = reactive({
    name: '',
    email: '',
    subject: '',
    inquiryType: 'general',
    message: '',
})

const resetForm = () => {
    Object.assign(formData, {
        name: '',
        email: '',
        subject: '',
        inquiryType: 'general',
        message: '',
    })
}

const submitForm = async () => {
    submitting.value = true

    try {
        if (!supabase) {
            throw new Error('Supabase client not initialized')
        }

        // Prepare form data as expected by the Edge Function
        const payload: FormSubmissionRequest = {
            formType: 'contact_form',
            formData: {
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                inquiryType: formData.inquiryType,
                message: formData.message,
            },
        }

        // Call the Edge Function
        const { data, error } = await supabase.functions.invoke('form-handler', {
            body: payload,
        })

        if (error) {
            throw error
        }

        const response = data as FormHandlerResponse

        if (!response.success) {
            throw new Error(response.error || 'Unknown error occurred')
        }

        Notify.create({
            type: 'positive',
            message:
                t('contact.form.success') ||
                "Your message has been sent successfully! I'll get back to you soon.",
            position: 'top',
            timeout: 4000,
            classes: 'br-20',
        })

        resetForm()
    } catch (error: any) {
        console.error('Form submission error:', error)

        Notify.create({
            type: 'negative',
            message:
                t('contact.form.error') ||
                error.message ||
                'Failed to send message. Please try again.',
            position: 'top',
            timeout: 5000,
            classes: 'br-20',
        })
    } finally {
        submitting.value = false
    }
}
</script>

<style scoped>
/* Contact link styling - using inline styles for hover */
.contact-link {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

.contact-link:hover {
    color: var(--color-primary-dark);
    text-decoration: underline;
}

/* Social button animations */
.social-btn {
    transition:
        transform 0.3s ease,
        background-color 0.3s ease;
}

.social-btn:hover {
    transform: scale(1.15) !important;
    background-color: rgba(0, 0, 0, 0.05) !important;
}

/* Icon sizes with responsive adjustments */
.social-btn i {
    font-size: 18px;

    @media (max-width: 768px) {
        font-size: 16px;
    }

    @media (max-width: 575px) {
        font-size: 14px;
    }
}

/* Form button styling - converted to utility classes */
.form-actions :deep(.q-btn) {
    border-radius: 25px;
    padding: 12px 24px;
    font-weight: 600;

    @media (max-width: 768px) {
        padding: 10px 20px;
    }
}

/* Note: Form input border-radius is handled by Quasar's 'rounded' prop */
</style>
