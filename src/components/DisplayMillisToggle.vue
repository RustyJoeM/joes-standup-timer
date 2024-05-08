<template>
  <q-checkbox v-model="displayMillis" label="Show milliseconds">
    <q-tooltip>Show ms precision on timestamps</q-tooltip>
  </q-checkbox>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMeetingStore } from 'src/stores/meetingStore';

const { displayMillis } = storeToRefs(useMeetingStore());
</script>
