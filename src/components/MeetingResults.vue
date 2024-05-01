<template>
  <section class="column">
    <span class="text-h6">Everyone has spoken! </span>
    <!-- <q-icon name="thumb_up"></q-icon> -->

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
          Took a bit longer (by {{ msToFormatted(overdrawnMs) }}) than planned...
        </span>
        <q-icon name="heart_broken" size="md" color="negative" class="q-ml-md"></q-icon>
      </template>

      <template v-if="savedMs">
        <span class="q-ml-md"> Saved some time ({{ msToFormatted(savedMs) }}) in total!</span>
        <q-icon name="celebration" size="md" color="positive" class="q-ml-md"></q-icon>
      </template>
    </section>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMeetingStore } from 'src/stores/meetingStore';
import { computed } from 'vue';
import { msToFormatted } from './AttendantModel';

const { attendants, msPerAttendant } = storeToRefs(useMeetingStore());

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
</script>
