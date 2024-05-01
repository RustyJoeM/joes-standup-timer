<template>
  <section>
    <span class="text-h6">
      Total time taken:
      <span> {{ totalTime }}</span>
    </span>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMeetingStore } from 'src/stores/meetingStore';
import { computed } from 'vue';
import { msToFormatted } from './AttendantModel';

const { attendants } = storeToRefs(useMeetingStore());

const totalTime = computed(() => {
  const totalMs = attendants.value
    .map((att) => att.msElapsed)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return msToFormatted(totalMs);
});
</script>
