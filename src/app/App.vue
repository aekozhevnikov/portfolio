<template>
    <router-view />
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()
$q.screen.setSizes({ sm: 300, md: 500, lg: 1000, xl: 2000 })
</script>
