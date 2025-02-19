<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <section class="col">
          <q-toolbar-title>
            <span class="text-subtitle2" style="opacity: 0.25">RustyJoe's</span> Standup Timer
          </q-toolbar-title>
        </section>

        <section class="col row justify-evenly">
          <template-manager></template-manager>
          <mystery-mode-toggle></mystery-mode-toggle>
        </section>

        <section class="col row justify-end">
          <dark-mode-toggle size="md" :class="GUTTER_CLASS"></dark-mode-toggle>
          <!-- <dev-tools :class="GUTTER_CLASS"></dev-tools> -->
        </section>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import TemplateManager from 'components/TemplateManager.vue';
import MysteryModeToggle from 'components/MysteryModeToggle.vue';
import DarkModeToggle from 'components/DarkModeToggle.vue';

const GUTTER_CLASS = 'q-ml-md';
</script>
