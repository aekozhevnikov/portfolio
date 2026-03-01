<template>
    <q-header elevated :class="headerClass">
        <q-toolbar :style="{ minHeight: '70px' }">
            <!-- Mobile menu button (visible only on mobile) -->
            <q-btn class="lt-md q-mr-sm" flat round dense icon="menu" @click="drawer = !drawer" />

            <!-- Home button -->
            <q-btn
                flat
                :label="t('nav.home')"
                class="home-btn nav-btn text-weight-medium br-20 q-mx-xs"
                :class="{ 'active-section': activeSection === 'about' }"
                @click="scrollToTop"
                icon="home"
            />

            <q-space />

            <!-- Desktop navigation -->
            <div class="gt-sm row items-center q-gutter-xs">
                <q-btn
                    v-for="section in sections"
                    :key="section.id"
                    flat
                    :label="t(section.label)"
                    :class="{ 'active-section': activeSection === section.id }"
                    class="nav-btn text-weight-medium br-20 q-mx-xs"
                    @click="scrollToSection(section.id)"
                    :icon="section.icon"
                />
            </div>

            <!-- Language switcher (always visible) -->
            <language-switcher class="q-ml-md" />

            <!-- Theme toggle button -->
            <q-btn
                flat
                round
                dense
                :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
                :class="{ 'text-dark': !$q.dark.isActive, 'text-grey-4': $q.dark.isActive }"
                @click="toggleTheme"
                class="q-ml-sm"
            />
        </q-toolbar>

        <!-- Mobile drawer -->
        <q-drawer
            v-model="drawer"
            side="left"
            overlay
            bordered
            class="bg-surface text-primary"
            :width="250"
        >
            <q-list padding>
                <q-item
                    v-for="section in sections"
                    :key="section.id"
                    clickable
                    :active="activeSection === section.id"
                    @click="
                        () => {
                            scrollAndClose(section.id)
                        }
                    "
                >
                    <q-item-section>
                        <q-item-label>
                            <q-icon :name="section.icon" class="q-mr-sm" size="sm" />
                            {{ t(section.label) }}</q-item-label
                        >
                    </q-item-section>
                </q-item>
            </q-list>
        </q-drawer>
    </q-header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import LanguageSwitcher from 'src/app/components/LanguageSwitcher.vue'

const { t } = useI18n()
const $q = useQuasar()

interface Section {
    id: string
    label: string
    icon: string
}

const sections = ref<Section[]>([
    { id: 'about', label: 'nav.about', icon: 'person' },
    { id: 'projects', label: 'nav.projects', icon: 'work' },
    { id: 'services', label: 'nav.services', icon: 'build' },
    { id: 'skills', label: 'nav.skills', icon: 'developer_mode' },
    { id: 'reviews', label: 'nav.reviews', icon: 'rate_review' },
    { id: 'contact', label: 'nav.contact', icon: 'contact_mail' },
])

const activeSection = ref<string>('')
const drawer = ref(false)

const scrollAndClose = (sectionId: string) => {
    drawer.value = false
    // Wait for drawer to close before scrolling ( drawer transition ~300ms )
    setTimeout(() => {
        scrollToSection(sectionId)
    }, 300)
}

const headerClass = computed(() => {
    return $q.dark.isActive ? 'bg-dark text-white' : 'bg-grey-2 text-grey-9'
})

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    })
}

const scrollToSection = (sectionId: string) => {
    // Set active section immediately for better UX
    activeSection.value = sectionId

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

const handleScroll = () => {
    const currentSections = sections.value
    const offset = 120 // Matches scroll-margin-top in app.scss

    // Find the section that is currently at the top of the viewport (with offset)
    for (let i = 0; i < currentSections.length; i++) {
        const sectionId = <string>currentSections[i]?.id
        if (!sectionId) continue

        const element = document.getElementById(sectionId)
        if (element) {
            const rect = element.getBoundingClientRect()

            // Section is considered active if its top edge is at or above the offset
            // and its bottom edge is below the offset (it covers the active line)
            // This ensures we highlight the section that is currently in view at the top
            if (rect.top <= offset && rect.bottom >= offset) {
                activeSection.value = sectionId
                return // Stop at the first (topmost) active section
            }

            // If we're near the top of the page and no section has reached the offset yet,
            // the first section should be active
            if (window.scrollY < 200 && rect.top >= 0 && rect.top <= offset) {
                activeSection.value = sectionId
                return
            }
        }
    }
}

const toggleTheme = () => {
    $q.dark.toggle()
    // Optional: persist theme preference in localStorage
    localStorage.setItem('darkMode', $q.dark.isActive ? 'true' : 'false')
}

onMounted(() => {
    // Restore theme preference from localStorage
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode === 'true' && !$q.dark.isActive) {
        $q.dark.set(true)
    } else if (savedDarkMode === 'false' && $q.dark.isActive) {
        $q.dark.set(false)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.nav-btn {
    transition: all 0.3s ease;

    &:hover {
        background-color: rgba(99, 102, 241, 0.15) !important;
        transform: translateY(-2px) !important;
    }

    &.active-section {
        background-color: rgba(99, 102, 241, 0.2) !important;
        font-weight: 600 !important;
    }
}
</style>
