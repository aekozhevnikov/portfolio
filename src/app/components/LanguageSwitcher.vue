<template>
    <q-btn-group push class="br-20">
        <q-btn
            flat
            dense
            rounded
            :class="['q-px-md q-py-sm', { 'active-lang': i18n.locale.value === 'ru' }]"
            @click="changeLanguage('ru')"
        >
            ru
        </q-btn>
        <q-btn
            flat
            dense
            rounded
            :class="['q-px-md q-py-sm', { 'active-lang': i18n.locale.value === 'en' }]"
            @click="changeLanguage('en')"
        >
            en
        </q-btn>
    </q-btn-group>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const changeLanguage = (lang: string) => {
    i18n.locale.value = lang
    try {
        localStorage.setItem('locale', lang)
    } catch (e) {
        // localStorage may not be available (e.g., private browsing)
        console.warn('Could not persist language to localStorage:', e)
    }
}

defineExpose({
    i18n,
    changeLanguage
})
</script>

<style scoped>
/* Active language button styling */
.active-lang {
    background-color: var(--color-primary) !important;
    font-weight: 600 !important;
}
</style>
