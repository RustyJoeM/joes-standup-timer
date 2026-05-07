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
          <template-manager />
          <mystery-mode-toggle />
        </section>

        <section class="col row justify-end">
          <dark-mode-toggle size="md" class="q-ml-md" />
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
import DarkModeToggle from 'components/controls/DarkModeToggle.vue';
</script>
