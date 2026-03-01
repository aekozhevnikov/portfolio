<template>
    <section id="services" class="services-section q-pa-xl">
        <div class="q-mx-auto" style="max-width: 1200px">
            <div class="text-center q-mb-xl">
                <h2 class="text-h3 text-weight-bold text-primary q-mb-sm">
                    {{ t('services.title') }}
                </h2>
                <p class="text-h6 theme-text-secondary">
                    {{ t('services.subtitle') }}
                </p>
            </div>

            <div class="row q-col-gutter-xl q-mb-xl">
                <div
                    v-for="(service, index) in services"
                    :key="index"
                    class="col-12 col-md-6 col-md-3"
                >
                    <div
                        class="service-card bg-surface rounded-borders shadow-2 column q-pa-md items-center justify-center transition-all br-20 border-default card-light-bg"
                        style="min-height: 250px"
                    >
                        <div class="row items-center">
                            <div class="service-icon q-mb-md q-mr-sm">
                                <q-icon
                                    :name="service.icon"
                                    size="64px"
                                    :color="service.color || 'primary'"
                                    class="transition-scale"
                                />
                            </div>
                            <div class="text-h5 text-weight-bold text-primary q-mb-md text-center">
                                {{ service.title }}
                            </div>
                        </div>
                        <div
                            class="text-body1 theme-text-secondary q-mb-lg text-center"
                            style="line-height: 1.7; flex-grow: 1"
                        >
                            {{ service.description }}
                        </div>
                        <q-btn
                            :label="t('services.request') || 'Request Service'"
                            :color="service.color || 'primary'"
                            outline
                            rounded
                            @click="openRequestDialog(service)"
                            class="br-20"
                        />
                    </div>
                </div>
            </div>

            <!-- Request Service Dialog -->
            <q-dialog v-model="showDialog" persistent>
                <q-card
                    class="service-request-dialog theme-bg-surface"
                    style="min-width: 500px; max-width: 90vw; border-radius: 20px"
                >
                    <q-toolbar class="bg-primary text-white">
                        <q-toolbar-title>
                            {{ t('services.requestTitle') || 'Request Service' }}
                        </q-toolbar-title>
                        <q-btn icon="close" flat round dense v-close-popup />
                    </q-toolbar>

                    <q-card-section class="q-pt-lg">
                        <div class="text-subtitle1">
                            {{ t('services.requestFor') }}:
                            <strong>{{ selectedService?.title }}</strong>
                        </div>

                        <q-form @submit="submitRequest" class="q-gutter-md q-mt-md">
                            <q-input
                                v-model="formData.name"
                                :label="t('services.form.name') + '*'"
                                :rules="[(val) => !!val || t('services.form.required')]"
                                outlined
                                rounded
                                lazy-rules
                            />

                            <q-input
                                v-model="formData.email"
                                :label="t('services.form.email') + '*'"
                                :rules="[
                                    (val) => !!val || t('services.form.required'),
                                    (val) =>
                                        /.+@.+\..+/.test(val) || t('services.form.invalidEmail'),
                                ]"
                                outlined
                                rounded
                                lazy-rules
                                type="email"
                            />

                            <q-input
                                v-model="formData.company"
                                :label="t('services.form.company')"
                                outlined
                                rounded
                            />

                            <q-select
                                v-model="formData.budget"
                                :label="t('services.form.budget')"
                                :options="budgetOptions"
                                outlined
                                rounded
                                emit-value
                                map-options
                            />

                            <q-select
                                v-model="formData.timeline"
                                :label="t('services.form.timeline')"
                                :options="timelineOptions"
                                outlined
                                rounded
                                emit-value
                                map-options
                            />

                            <q-input
                                v-model="formData.message"
                                :label="t('services.form.message') + '*'"
                                :rules="[(val) => !!val || t('services.form.required')]"
                                type="textarea"
                                rows="5"
                                outlined
                                rounded
                                lazy-rules
                            />

                            <div class="row justify-end q-gutter-sm">
                                <q-btn :label="t('common.cancel')" flat v-close-popup rounded />
                                <q-btn
                                    :label="t('common.submit')"
                                    type="submit"
                                    color="primary"
                                    rounded
                                    :loading="submitting"
                                />
                            </div>
                        </q-form>
                    </q-card-section>
                </q-card>
            </q-dialog>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, reactive, ref } from 'vue'
import { useSiteStore } from 'src/app/stores/siteStore'
import { useI18n } from 'vue-i18n'
import { Notify, useQuasar } from 'quasar'
import type { FormHandlerResponse, FormSubmissionRequest } from 'src/types'

const { t } = useI18n()
const $q = useQuasar()
const instance = getCurrentInstance()
const siteStore = useSiteStore()

// Access Supabase from Vue's global properties
const supabase = instance?.appContext.config.globalProperties.$supabase

interface Service {
    title: string
    description: string
    icon: string
    color?: string
}

const services = computed<Service[]>(() => {
    return siteStore.config.services || <Service[]>[]
})

const showDialog = ref(false)
const selectedService = ref<Service | null>(null)
const submitting = ref(false)

const formData = reactive({
    name: '',
    email: '',
    company: '',
    budget: '',
    timeline: '',
    message: '',
})

const budgetOptions = computed(() => [
    { label: t('services.budgetOptions.small'), value: 'small' },
    { label: t('services.budgetOptions.medium'), value: 'medium' },
    { label: t('services.budgetOptions.large'), value: 'large' },
    { label: t('services.budgetOptions.custom'), value: 'custom' },
])

const timelineOptions = computed(() => [
    { label: t('services.timelineOptions.asap'), value: 'asap' },
    { label: t('services.timelineOptions.weeks'), value: 'weeks' },
    { label: t('services.timelineOptions.months'), value: 'months' },
    { label: t('services.timelineOptions.flexible'), value: 'flexible' },
])

const openRequestDialog = (service: Service) => {
    selectedService.value = service
    // Reset form
    Object.assign(formData, {
        name: '',
        email: '',
        company: '',
        budget: '',
        timeline: '',
        message: '',
    })
    showDialog.value = true
}

const submitRequest = async () => {
    submitting.value = true

    try {
        if (!supabase) {
            throw new Error('Supabase client not initialized')
        }

        // Get the translated labels for budget and timeline
        const getBudgetLabel = (value: string) => {
            const option = budgetOptions.value.find(opt => opt.value === value)
            return option?.label || value
        }

        const getTimelineLabel = (value: string) => {
            const option = timelineOptions.value.find(opt => opt.value === value)
            return option?.label || value
        }

        // Prepare form data as expected by the Edge Function
        const payload: FormSubmissionRequest = {
            formType: 'service_request',
            formData: {
                service: selectedService.value?.title || '',
                name: formData.name,
                email: formData.email,
                company: formData.company || '',
                budget: getBudgetLabel(formData.budget),
                timeline: getTimelineLabel(formData.timeline),
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
                t('services.requestSent') ||
                'Your service request has been sent successfully! I will get back to you soon.',
            position: 'top',
            timeout: 3000,
            classes: 'br-20',
        })

        showDialog.value = false
    } catch (error: any) {
        console.error('Service request submission error:', error)

        Notify.create({
            type: 'negative',
            message:
                t('services.requestError') ||
                error.message ||
                'Failed to send service request. Please try again.',
            position: 'top',
            timeout: 5000,
            classes: 'br-20',
        })
    } finally {
        submitting.value = false
    }
}
</script>

<style scoped lang="scss">
/* Section background - uses page theme color */
.services-section {
    background-color: var(--color-page);
}

/* Hover effects */
.service-card {
    &:hover {
        transform: translateY(-8px) !important;
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15) !important;
    }

    .service-icon {
        .transition-scale {
            &:hover {
                transform: scale(1.1);
            }
        }
    }
}
</style>
