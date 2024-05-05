<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> RustyJoe's Standup Timer </q-toolbar-title>

        <dark-mode-toggle dense size="md"></dark-mode-toggle>
        <dev-tools class="q-ml-md"></dev-tools>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import DarkModeToggle from 'components/DarkModeToggle.vue';
import DevTools from 'components/DevTools.vue';
</script>
