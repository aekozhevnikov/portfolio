<template>
  <q-layout view="lHh Lpr lFf">
    <NavBar />
    <q-page-container>
      <router-view />
    </q-page-container>
    <Footer />
  </q-layout>
</template>

<script setup lang="ts">
import NavBar from 'src/app/components/ui/NavBar.vue'
import Footer from 'src/app/components/ui/Footer.vue'
</script>
