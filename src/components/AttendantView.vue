<template>
  <q-linear-progress
    :value="attendant.msElapsed / msPerAttendant"
    size="3rem"
    color="primary"
    :animation-speed="900"
    rounded
    class="q-mt-sm"
  >
    <div :key="attendantIndex" class="absolute-full flex flex-center row">
      <div class="col-12 row items-center q-px-md">
        <q-badge color="grey-5" class="text-white text-subtitle1">{{ attendant.name }}</q-badge>
        <q-space></q-space>
        <q-chip
          v-if="attendant.hasFinished || isActive"
          square
          size="md"
          :label="formattedTimestamp"
        />
        <q-space></q-space>
        <q-btn
          dense
          icon="close"
          color="grey-5"
          text-color="white"
          @click="attendants.splice(attendantIndex, 1)"
        ></q-btn>
      </div>
    </div>
  </q-linear-progress>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMeetingStore } from 'src/stores/meetingStore';
import { msToFormatted } from './AttendantModel';

const props = defineProps<{
  attendantIndex: number;
  isActive: boolean;
}>();

const { msPerAttendant, attendants } = storeToRefs(useMeetingStore());

const attendant = computed(() => {
  return attendants.value[props.attendantIndex];
});

const formattedTimestamp = computed(() => {
  const elapsedMs = attendant.value.msElapsed;
  const sign = elapsedMs > msPerAttendant.value ? 'Overtime: ' : '';
  const timestamp = msToFormatted(elapsedMs);
  return `${sign}${timestamp}`;
});
</script>
