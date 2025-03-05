<template>
  <q-btn dense :color="CHIP_COLOR" icon="close" :text-color="TEXT_COLOR" @click="removeAttendant(props.uid)">
    <q-tooltip :delay="500">remove from meeting</q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { useMeetingStore } from 'src/stores/meetingStore';
import { useAttendantStyling } from './AttendantStyling';

const props = defineProps<{
  uid: string;
}>();

const { CHIP_COLOR, TEXT_COLOR } = useAttendantStyling();

const { removeAttendant } = useMeetingStore();
</script>
