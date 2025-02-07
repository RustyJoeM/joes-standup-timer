<template>
  <div class="q-mb-xl column">
    <q-card class="q-pa-lg">
      <meeting-setup :meeting-started="meetingHasStarted"></meeting-setup>
    </q-card>

    <q-card class="q-mt-lg q-pa-lg">
      <meeting-attendants></meeting-attendants>
    </q-card>

    <q-page-sticky :offset="controlsPosition">
      <meeting-controls v-touch-pan.prevent.mouse="moveControls"></meeting-controls>
    </q-page-sticky>

    <transition appear enter-active-class="animated backInDown slow" leave-active-class="animated backOutUp slow">
      <q-card v-if="meetingHasFinished" class="q-mt-lg q-pa-lg">
        <q-card-section>
          <meeting-results></meeting-results>
        </q-card-section>
      </q-card>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMeetingStore } from 'src/stores/meetingStore';

import MeetingSetup from './MeetingSetup.vue';
import MeetingAttendants from './MeetingAttendants.vue';
import MeetingControls from './MeetingControls.vue';
import MeetingResults from './MeetingResults.vue';

const { spokenAttendants, waitingAttendants, activeAttendantId } = storeToRefs(useMeetingStore());

const meetingHasStarted = computed(() => spokenAttendants.value.length > 0);
const meetingHasFinished = computed(
  () => spokenAttendants.value.length > 0 && waitingAttendants.value.length == 0 && !activeAttendantId.value
);

const controlsPosition = ref([32, 32]);

const draggingControls = ref(false);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const moveControls = (ev: any) => {
  draggingControls.value = ev.isFirst !== true && ev.isFinal !== true;

  controlsPosition.value = [controlsPosition.value[0] - ev.delta.x, controlsPosition.value[1] - ev.delta.y];
};
</script>
