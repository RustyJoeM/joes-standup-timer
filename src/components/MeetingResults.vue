<template>
  <section class="column">
    <span class="text-h6">Everyone has spoken </span>

    <section class="q-mt-md row items-center">
      <q-input
        dense
        outlined
        class="q-ml-md col-2"
        :model-value="msToFormatted(totalTimeMs)"
        label="Total time taken"
        readonly
      ></q-input>

      <template v-if="overdrawnMs">
        <span class="q-ml-md">
          The team took a bit longer (by {{ msToFormatted(overdrawnMs) }}) than planned...
        </span>
        <transition mode="out-in" appear enter-active-class="animated heartBeat slower">
          <q-icon
            name="heart_broken"
            size="md"
            color="negative"
            class="q-ml-md"
            :key="posCounter"
            @click="posCounter++"
          ></q-icon>
        </transition>
      </template>

      <template v-if="savedMs">
        <span class="q-ml-md">
          The team saved some time ({{ msToFormatted(savedMs) }}) in total!</span
        >
        <transition mode="out-in" appear enter-active-class="animated rubberBand slower">
          <q-icon
            name="celebration"
            size="md"
            color="positive"
            class="q-ml-md"
            :key="negCounter"
            @click="negCounter++"
          ></q-icon>
        </transition>
      </template>
    </section>

    <section class="q-mt-lg">
      <span class="text-h6">Noteworthy heroes of the meeting </span>

      <min-max-award-chip
        class="q-ml-md q-mt-md"
        :attendants="attendants"
        :title-pool="MIN_TIME_TITLES"
        reason="using the least time"
        mode="min"
        :delay-anim-ms="1000"
      >
        <template #rivet><q-spinner-hearts size="2rem"></q-spinner-hearts></template>
      </min-max-award-chip>

      <min-max-award-chip
        class="q-ml-md q-mt-md"
        :attendants="attendants"
        :title-pool="MAX_TIME_TITLES"
        reason="the good use of large slice of meeting"
        mode="max"
        :delay-anim-ms="2000"
      >
        <template #rivet><q-spinner-infinity size="2rem"></q-spinner-infinity></template>
      </min-max-award-chip>
    </section>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMeetingStore } from 'src/stores/meetingStore';
import { computed, ref } from 'vue';
import { msToFormatted } from './AttendantModel';

import MinMaxAwardChip from './MinMaxAwardChip.vue';

const { attendants, msPerAttendant } = storeToRefs(useMeetingStore());

// animation keys
const posCounter = ref(0);
const negCounter = ref(0);

const totalTimeMs = computed(() => {
  return attendants.value
    .map((att) => att.msElapsed)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
});

const plannedMs = computed(() => attendants.value.length * msPerAttendant.value);

const overdrawnMs = computed(() =>
  totalTimeMs.value > plannedMs.value ? totalTimeMs.value - plannedMs.value : undefined
);

const savedMs = computed(() =>
  totalTimeMs.value < plannedMs.value ? plannedMs.value - totalTimeMs.value : undefined
);

const MIN_TIME_TITLES = ['time savior', 'most considerate', 'standup lightning'];
const MAX_TIME_TITLES = ['enthusiastic talker', 'chatty one', 'pedantic'];
</script>
