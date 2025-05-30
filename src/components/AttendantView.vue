<template>
  <q-linear-progress
    :value="progress"
    size="3rem"
    color="primary"
    :animation-speed="animSpeed"
    :stripe="isActive"
    rounded
  >
    <div class="absolute-full flex flex-center row">
      <div class="col-12 row items-center">
        <section class="q-ml-sm col row justify-start">
          <attendant-chip :attendant="attendant"></attendant-chip>
        </section>
        <section class="col row justify-center">
          <q-chip
            v-if="attendant.hasFinished || isActive"
            :color="CHIP_COLOR"
            square
            size="md"
            :text-color="TEXT_COLOR"
            :label="formattedTimestamp"
          />
        </section>
        <section class="col row justify-end">
          <absence-toggle-button
            v-if="props.allowCheckout"
            :perform="'check-out'"
            :uid="attendant._uid"
            size="sm"
          ></absence-toggle-button>
          <attendant-remove-button :uid="attendant._uid" class="q-ml-md q-mr-md" size="sm"></attendant-remove-button>
        </section>
      </div>
    </div>
  </q-linear-progress>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMeetingStore } from 'src/stores/meetingStore';
import { Attendant, msToFormatted } from './AttendantModel';
import AttendantChip from './AttendantChip.vue';
import { useAttendantStyling } from './AttendantStyling';

import AbsenceToggleButton from './AbsenceToggleButton.vue';
import AttendantRemoveButton from './AttendantRemoveButton.vue';

const props = defineProps<{
  attendant: Attendant;
  isActive: boolean;
  allowCheckout: boolean;
}>();

const { msPerAttendant, tickSize, displayMillis } = storeToRefs(useMeetingStore());

const animSpeed = computed(() => 0.95 * tickSize.value);

const progress = computed(() => {
  // return exact fraction for finished talkers
  if (props.attendant.hasFinished) {
    return props.attendant.msElapsed / msPerAttendant.value;
  }
  // return full second rounded progress only for more discrete animation
  const roundedMillis = Math.floor(props.attendant.msElapsed / 1000) * 1000;
  return roundedMillis / msPerAttendant.value;
});

const formattedTimestamp = computed(() => {
  const elapsedMs = props.attendant.msElapsed;

  const showMillis = props.attendant.hasFinished || props.isActive ? displayMillis.value : false;
  // print elapsed time in simple way
  if (elapsedMs <= msPerAttendant.value) {
    return `${msToFormatted(elapsedMs, showMillis)}`;
  }
  // print planned + overtime
  return `${msToFormatted(msPerAttendant.value, false)} + ${msToFormatted(
    elapsedMs - msPerAttendant.value,
    showMillis
  )} overtime`;
});

const { CHIP_COLOR, TEXT_COLOR } = useAttendantStyling();
</script>
