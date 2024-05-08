<template>
  <q-card>
    <q-card-section>
      <meeting-setup :meeting-started="meetingHasStarted"></meeting-setup>

      <q-separator class="q-mt-lg"></q-separator>
      <meeting-attendants class="q-mt-lg"></meeting-attendants>

      <q-page-sticky position="bottom" :offset="[32, 32]">
        <meeting-controls></meeting-controls>
      </q-page-sticky>

      <transition
        appear
        enter-active-class="animated backInDown slow"
        leave-active-class="animated backOutUp slow"
      >
        <section v-if="meetingHasFinished">
          <q-separator class="q-mt-lg"></q-separator>
          <meeting-results class="q-mt-lg"></meeting-results>
        </section>
      </transition>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMeetingStore } from 'src/stores/meetingStore';

import MeetingSetup from './MeetingSetup.vue';
import MeetingAttendants from './MeetingAttendants.vue';
import MeetingControls from './MeetingControls.vue';
import MeetingResults from './MeetingResults.vue';

const { attendants } = storeToRefs(useMeetingStore());

const meetingHasStarted = computed(() => attendants.value.some((att) => att.msElapsed > 0));
const meetingHasFinished = computed(
  () => attendants.value.length > 0 && !attendants.value.some((att) => !att.hasFinished)
);
</script>
