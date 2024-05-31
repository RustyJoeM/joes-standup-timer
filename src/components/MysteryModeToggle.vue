<template>
  <q-checkbox v-model="runningMysteryMode" label="Mystery mode">
    <q-tooltip>Randomize next talker for higher attention</q-tooltip>
  </q-checkbox>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMeetingStore } from 'src/stores/meetingStore';

const { runningMysteryMode } = storeToRefs(useMeetingStore());
</script>
