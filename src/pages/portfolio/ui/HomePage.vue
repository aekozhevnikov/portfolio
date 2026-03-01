<template>
    <q-page>
        <HeroSection />
        <ProjectsSection />
        <ServicesSection />
        <ExpertiseSection />
        <ReviewsSection />
        <FindMe />
        <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
            <q-btn fab icon="keyboard_arrow_up" color="primary" />
        </q-page-scroller>
    </q-page>
</template>

<script setup lang="ts">
import HeroSection from 'src/app/components/ui/HeroSection.vue'
import ProjectsSection from 'src/app/components/ui/ProjectsSection.vue'
import ServicesSection from 'src/app/components/ui/ServicesSection.vue'
import ExpertiseSection from 'src/app/components/ui/ExpertiseSection.vue'
import ReviewsSection from 'src/app/components/ui/ReviewsSection.vue'
import FindMe from 'src/app/components/ui/FindMe.vue'
</script>
