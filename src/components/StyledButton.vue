<template>
  <q-btn dense :color="CHIP_COLOR" :icon="icon" :text-color="TEXT_COLOR">
    <q-tooltip v-if="props.tooltip" :delay="500">{{ props.tooltip }}</q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { useAttendantStyling } from './AttendantStyling';

const props = defineProps<{
  icon: string;
  tooltip?: string;
}>();

const { CHIP_COLOR, TEXT_COLOR } = useAttendantStyling();
</script>
