<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <section class="col">
          <q-toolbar-title> RustyJoe's Standup Timer </q-toolbar-title>
        </section>

        <section class="col row justify-center">
          <template-manager></template-manager>
        </section>

        <section class="col row justify-end">
          <mystery-mode-toggle></mystery-mode-toggle>
          <q-separator vertical class="q-ml-sm"></q-separator>

          <dark-mode-toggle dense size="md" :class="GUTTER_CLASS"></dark-mode-toggle>
          <dev-tools :class="GUTTER_CLASS"></dev-tools>
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
import DevTools from 'components/DevTools.vue';

const GUTTER_CLASS = 'q-ml-md';
</script>
