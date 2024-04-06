<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> RustyJoe's Standup Timer </q-toolbar-title>

        <dark-mode-toggle dense size="sm"></dark-mode-toggle>
        <q-btn flat dense size="sm" icon="question_mark" class="q-ml-md">
          <q-tooltip>Vue v{{ version }} / Quasar v{{ $q.version }}</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { version } from 'vue';
import DarkModeToggle from 'src/components/DarkModeToggle.vue';
</script>
