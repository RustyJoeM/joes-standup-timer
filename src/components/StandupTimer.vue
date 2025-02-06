<template>
  <div class="column">
    <q-card class="q-pa-lg">
      <meeting-setup :meeting-started="meetingHasStarted"></meeting-setup>
    </q-card>

    <q-card class="q-mt-md q-pa-md">
      <component :is="attendantsComponent" class="q-mt-lg"></component>
    </q-card>

    <q-page-sticky :offset="controlsPosition">
      <meeting-controls v-touch-pan.prevent.mouse="moveControls"></meeting-controls>
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMeetingStore } from 'src/stores/meetingStore';

import MeetingSetup from './MeetingSetup.vue';
import MeetingAttendants from './MeetingAttendants.vue';
import MysteryMeetingAttendants from './MysteryMeetingAttendants.vue';
import MeetingControls from './MeetingControls.vue';
import MeetingResults from './MeetingResults.vue';

const { attendants, runningMysteryMode } = storeToRefs(useMeetingStore());

const meetingHasStarted = computed(() => attendants.value.some((att) => att.msElapsed > 0));
const meetingHasFinished = computed(
  () => attendants.value.length > 0 && !attendants.value.some((att) => !att.hasFinished)
);

const controlsPosition = ref([32, 32]);

const draggingControls = ref(false);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const moveControls = (ev: any) => {
  draggingControls.value = ev.isFirst !== true && ev.isFinal !== true;

  controlsPosition.value = [
    controlsPosition.value[0] - ev.delta.x,
    controlsPosition.value[1] - ev.delta.y,
  ];
};

const attendantsComponent = computed(() =>
  runningMysteryMode.value ? MysteryMeetingAttendants : MeetingAttendants
);
</script>
