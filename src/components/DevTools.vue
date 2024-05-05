<template>
  <q-btn dense flat size="md" icon="build">
    <q-menu dense class="column q-pa-sm">
      <q-item class="text-no-wrap">Vue v{{ version }} / Quasar v{{ $q.version }}</q-item>
      <q-item>Git# "{{ GIT_HASH }}" </q-item>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { version } from 'vue';

const GIT_HASH = import.meta.env.VITE_GIT_HASH || 'dev';
</script>
