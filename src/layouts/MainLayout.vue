<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> RustyJoe's Standup Timer </q-toolbar-title>

        <display-millis-toggle></display-millis-toggle>

        <dark-mode-toggle dense size="md" class="q-ml-md"></dark-mode-toggle>
        <dev-tools class="q-ml-md"></dev-tools>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import DisplayMillisToggle from 'components/DisplayMillisToggle.vue';
import DarkModeToggle from 'components/DarkModeToggle.vue';
import DevTools from 'components/DevTools.vue';
</script>
