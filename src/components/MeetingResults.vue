<template>
  <section class="column">
    <span class="text-h6">Everyone has spoken </span>

    <section class="q-mt-md row items-center">
      <span class="q-ml-md text-subtitle1">
        Total time spent - "<span class="text-bold">{{ msToFormatted(totalElapsedMs, displayMillis) }} </span>".
      </span>

      <template v-if="overdrawnMs">
        <span class="text-subtitle1">
          &nbsp; The team took a bit longer (by {{ msToFormatted(overdrawnMs, displayMillis) }}) than planned...
        </span>
        <transition mode="out-in" appear enter-active-class="animated heartBeat slower delay-2s">
          <q-icon
            :key="posCounter"
            name="heart_broken"
            size="md"
            color="negative"
            class="q-ml-md"
            @click="posCounter++"
          ></q-icon>
        </transition>
      </template>

      <template v-if="savedMs">
        <span class="text-subtitle1">
          &nbsp; The team saved some time ({{ msToFormatted(savedMs, displayMillis) }}) in total!
        </span>
        <transition mode="out-in" appear enter-active-class="animated rubberBand slower delay-2s">
          <q-icon :key="negCounter" name="star" size="md" color="amber" class="q-ml-md" @click="negCounter++"></q-icon>
        </transition>
      </template>
    </section>

    <section class="q-mt-lg">
      <span class="text-h6">Noteworthy heroes of the meeting:</span>

      <min-max-award-chip
        class="q-ml-md q-mt-md"
        :attendants="spokenAttendants"
        :title-pool="MIN_TIME_TITLES"
        reason="using the least time"
        mode="min"
        :delay-anim-ms="1000"
      >
        <template #rivet><q-spinner-hearts size="2rem"></q-spinner-hearts></template>
      </min-max-award-chip>

      <min-max-award-chip
        class="q-ml-md q-mt-md"
        :attendants="spokenAttendants"
        :title-pool="MAX_TIME_TITLES"
        reason="the good use of large slice of meeting"
        mode="max"
        :delay-anim-ms="2000"
      >
        <template #rivet><q-spinner-infinity size="2rem"></q-spinner-infinity></template>
      </min-max-award-chip>
    </section>

    <section v-if="absentAttendants.length > 0" class="q-mt-lg column">
      <span class="text-h6">{{
        absentAttendants.length > 1 ? 'Voices that were not headerd:' : 'Unheared voice:'
      }}</span>
      <span class="q-ml-md q-mt-md">{{ absentAttendants.map((att: Attendant) => att.name).join(', ') }} </span>
    </section>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMeetingStore } from 'src/stores/meetingStore';
import { computed, ref } from 'vue';
import { Attendant, msToFormatted } from './AttendantModel';

import MinMaxAwardChip from './MinMaxAwardChip.vue';

const { spokenAttendants, absentAttendants, msPerAttendant, displayMillis } = storeToRefs(useMeetingStore());

// animation keys
const posCounter = ref(0);
const negCounter = ref(0);

const totalElapsedMs = computed(() => {
  return spokenAttendants.value
    .map((att) => att.msElapsed)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
});

const plannedMs = computed(() => spokenAttendants.value.length * msPerAttendant.value);

const overdrawnMs = computed(() =>
  totalElapsedMs.value > plannedMs.value ? totalElapsedMs.value - plannedMs.value : undefined
);

const savedMs = computed(() =>
  totalElapsedMs.value < plannedMs.value ? plannedMs.value - totalElapsedMs.value : undefined
);

const MIN_TIME_TITLES = ['time savior', 'most considerate', 'standup lightning'];
const MAX_TIME_TITLES = ['enthusiastic talker', 'chatty one', 'pedantic'];
</script>
