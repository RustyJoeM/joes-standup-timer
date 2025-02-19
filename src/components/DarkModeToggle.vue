<template>
  <q-btn :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" @click="$q.dark.toggle()">
    <q-tooltip :delay="500">Toggle to {{ $q.dark.isActive ? 'light' : 'dark' }} mode</q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

const $q = useQuasar();
</script>
