<template>
  <q-linear-progress
    :value="progress"
    size="3rem"
    color="primary"
    :animation-speed="animSpeed"
    rounded
    class="q-mt-sm"
  >
    <div :key="attendantIndex" class="absolute-full flex flex-center row">
      <div class="col-12 row items-center q-px-md">
        <q-badge color="grey-5" class="text-white text-subtitle1">
          <span class="text-black">{{ attendant.name }}</span>
          <q-popup-edit v-model="attendant.name" auto-save v-slot="scope">
            <q-input filled v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
          </q-popup-edit>
        </q-badge>
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

const { msPerAttendant, attendants, tickSize } = storeToRefs(useMeetingStore());

const animSpeed = computed(() => 0.95 * tickSize.value);

const attendant = computed(() => {
  return attendants.value[props.attendantIndex];
});

const progress = computed(() => {
  const roundedMillis = Math.floor(attendant.value.msElapsed / 1000) * 1000;
  return roundedMillis / msPerAttendant.value;
});

const formattedTimestamp = computed(() => {
  const elapsedMs = attendant.value.msElapsed;
  const sign = elapsedMs > msPerAttendant.value ? 'Overtime: ' : '';
  const timestamp = msToFormatted(elapsedMs);
  return `${sign}${timestamp}`;
});
</script>
