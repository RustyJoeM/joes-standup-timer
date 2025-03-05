<template>
  <q-btn
    dense
    :color="CHIP_COLOR"
    :icon="buttonIcon"
    :text-color="TEXT_COLOR"
    @click="toggleAttendantAbsence(props.uid, props.perform)"
  >
    <q-tooltip :delay="500">{{ buttonTooltip }}</q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { useMeetingStore } from 'src/stores/meetingStore';
import { useAttendantStyling } from './AttendantStyling';
import { computed } from 'vue';

const props = defineProps<{
  perform: 'check-in' | 'check-out';
  uid: string;
}>();

const { CHIP_COLOR, TEXT_COLOR } = useAttendantStyling();

const buttonIcon = computed(() => (props.perform == 'check-in' ? 'login' : 'logout'));
const buttonTooltip = computed(() => (props.perform == 'check-in' ? 'make present' : 'postpone / make absent'));

const { toggleAttendantAbsence } = useMeetingStore();
</script>
