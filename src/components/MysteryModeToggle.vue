<template>
  <q-checkbox v-model="runningMysteryMode" label="Mystery mode">
    <q-tooltip :delay="500">Randomize next talker for higher attention</q-tooltip>
  </q-checkbox>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMeetingStore } from 'src/stores/meetingStore';
import { watch } from 'vue';

const { updateNextAttendant } = useMeetingStore();
const { runningMysteryMode } = storeToRefs(useMeetingStore());

watch(
  runningMysteryMode,
  () => {
    updateNextAttendant();
  },
  { immediate: true }
);
</script>
