<template>
    <div id="reviews" class="reviews-section q-pa-xl">
        <div class="q-mx-auto" style="max-width: 900px">
            <div class="text-h4 text-weight-bold text-center q-mb-xl q-pt-lg">
                {{ t('reviews.title') || 'Reviews' }}
            </div>

            <div
                v-for="(review, index) in reviews"
                :key="index"
                class="bg-surface rounded-borders q-pa-lg shadow-2 q-mb-xl br-15 border-default card-light-bg"
            >
                <!-- Testimony with fixed quote icon on right -->
                <div class="relative-position">
                    <div class="text-body1 theme-text-secondary q-pr-xl">
                        {{ review.testimony }}
                    </div>
                    <q-icon
                        name="format_quote"
                        size="lg"
                        color="primary"
                        class="absolute-top-right"
                        style="right: 0; top: 0"
                    />
                </div>

                <!-- Second testimony (if exists) -->
                <div v-if="review.testimony2" class="text-body2 theme-text-secondary q-mt-sm">
                    {{ review.testimony2 }}
                </div>

                <div class="row items-center q-mt-lg q-pt-lg border-t flex">
                    <q-avatar
                        class="flex flex-center rounded q-mr-md text-bold"
                        size="xl"
                        color="primary"
                        text-color="white"
                    >
                        {{ review.initials }}
                    </q-avatar>
                    <div class="author-info">
                        <div class="text-weight-bold theme-text-primary">
                            {{ review.name }}
                        </div>
                        <div class="text-caption theme-text-secondary">
                            {{ review.position }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSiteStore } from '../../stores/siteStore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const siteStore = useSiteStore()

interface Review {
    name: string
    testimony: string
    testimony2?: string
    position: string
    initials: string
}

const reviews = computed<Review[]>(() => {
    const configuredReviews = siteStore.config.reviews || []

    if (configuredReviews.length > 0) {
        return configuredReviews
    }

    // Default reviews if not configured
    return []
})
</script>
