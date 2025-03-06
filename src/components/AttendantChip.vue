<template>
  <q-chip square :color="CHIP_COLOR">
    <span :class="`text-subtitle1 text-${TEXT_COLOR}`">{{ attendant.name }}</span>
    <q-popup-edit v-slot="scope" v-model="attendantName" auto-save :validate="validateRename">
      <q-input
        v-model="scope.value"
        filled
        dense
        autofocus
        hide-bottom-space
        :rules="[(val: string) => nameNotTaken(val, attendant._uid) || 'Same name already exists']"
        @keyup.enter="scope.set"
      />
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

const { renameAttendant, nameNotTaken } = useMeetingStore();

const attendantName = computed({
  get: () => props.attendant.name,
  set: (value: string) => renameAttendant(props.attendant._uid, value),
});

const { CHIP_COLOR, TEXT_COLOR } = useAttendantStyling();

const validateRename = (val: string) => {
  return nameNotTaken(val, props.attendant._uid);
};
</script>
