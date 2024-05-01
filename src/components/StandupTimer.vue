<template>
  <section style="width: 66vw; height: 80vh" class="q-pa-md">
    <q-card>
      <q-card-section>
        <meeting-setup :meeting-started="meetingHasStarted"></meeting-setup>
      </q-card-section>

      <q-card-section>
        <meeting-attendants></meeting-attendants>
      </q-card-section>

      <q-card-section v-if="attendants.length > 0">
        <meeting-controls></meeting-controls>
      </q-card-section>
    </q-card>

    <!-- <q-card-section v-if="attendants.length > 0 && !attendants.some((a) => !a.hasFinished)">
      <section id="summary" class="row items-center text-h6 column">
        <span>Everyone finished!</span>
        <span>
          Total time taken: <q-chip square>{{ secondsToFormatted(totalTime()) }} </q-chip>
        </span>
      </section>
    </q-card-section> -->
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMeetingStore } from 'src/stores/meetingStore';
import MeetingSetup from './MeetingSetup.vue';
import MeetingAttendants from './MeetingAttendants.vue';
import MeetingControls from './MeetingControls.vue';
import { computed } from 'vue';

const { attendants } = storeToRefs(useMeetingStore());

const meetingHasStarted = computed(() => attendants.value.some((att) => att.msElapsed > 0));
// const meetingHasFinished = computed(() => !attendants.value.some((att) => att.hasFinished));
</script>
