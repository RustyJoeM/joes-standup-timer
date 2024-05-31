<template>
  <q-chip square :color="CHIP_COLOR">
    <span :class="`text-subtitle1 text-${TEXT_COLOR}`">{{ attendant.name }}</span>
    <q-popup-edit v-model="attendantName" auto-save v-slot="scope">
      <q-input filled v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
    </q-popup-edit>
    <slot />
  </q-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Attendant } from './AttendantModel';
import { useMeetingStore } from 'src/stores/meetingStore';
import { useAttendantStyling } from './AttendantStyling';

const props = defineProps<{
  attendant: Attendant;
}>();

const { renameAttendant } = useMeetingStore();

const attendantName = computed({
  get: () => props.attendant.name,
  set: (value: string) => renameAttendant(props.attendant._uid, value),
});

const { CHIP_COLOR, TEXT_COLOR } = useAttendantStyling();
</script>
