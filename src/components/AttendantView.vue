<template>
  <q-linear-progress
    :value="progress"
    size="3rem"
    :color="progressColor"
    :animation-speed="animSpeed"
    :stripe="isActive"
    rounded
    class="done"
    @mouseover="showTimeReset = true"
    @mouseleave="showTimeReset = false"
  >
    <div class="absolute-full flex flex-center row">
      <div class="col-12 row items-center">
        <section class="q-ml-sm col row justify-start">
          <attendant-chip :attendant="attendant"></attendant-chip>
        </section>
        <section class="col row justify-center">
          <q-chip
            v-if="attendant.msElapsed > 0 || isActive"
            :color="CHIP_COLOR"
            square
            size="md"
            :text-color="TEXT_COLOR"
            :label="formattedTimestamp"
          />
        </section>
        <section class="col row justify-end q-mx-md">
          <styled-button
            v-if="showTimeReset && props.attendant.msElapsed > 0 && !props.attendant.hasFinished"
            size="sm"
            icon="alarm_off"
            tooltip="clear time talked"
            @click="resetPendingTime(props.attendant._uid)"
          />
          <styled-button
            v-if="showTimeReset && attendant.hasFinished"
            size="sm"
            class="q-ml-md"
            icon="alarm_add"
            tooltip="re-queue to talk again"
            @click="requeueFinishedAttendant(props.attendant._uid)"
          />
          <absence-toggle-button
            v-if="props.allowCheckout"
            :perform="'check-out'"
            :uid="attendant._uid"
            size="sm"
            class="q-ml-md"
          ></absence-toggle-button>
          <attendant-remove-button :uid="attendant._uid" class="q-ml-md" size="sm"></attendant-remove-button>
        </section>
      </div>
    </div>
  </q-linear-progress>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMeetingStore } from 'src/stores/meetingStore';
import { Attendant, msToFormatted } from './AttendantModel';
import AttendantChip from './AttendantChip.vue';
import { useAttendantStyling } from './AttendantStyling';

import AbsenceToggleButton from './AbsenceToggleButton.vue';
import AttendantRemoveButton from './AttendantRemoveButton.vue';
import StyledButton from './StyledButton.vue';

const props = defineProps<{
  attendant: Attendant;
  isActive: boolean;
  allowCheckout: boolean;
}>();

const { msPerAttendant, tickSize, displayMillis } = storeToRefs(useMeetingStore());

const { resetPendingTime, requeueFinishedAttendant } = useMeetingStore();

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

const progressColor = computed(() => (props.isActive ? 'primary' : undefined));

const showTimeReset = ref(false);

const barGrayscaleLevel = computed(() => (props.isActive ? 0 : 100));
</script>

<style scoped>
.done {
  filter: grayscale(v-bind(barGrayscaleLevel));
}
</style>
