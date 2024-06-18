<template>
  <section>
    <section class="row">
      <section class="text-h6">
        <template v-if="attendants.length > 0">
          <span
            >Meeting roster - {{ attendants.length }}
            {{ attendants.length > 1 ? 'people' : ' person' }} - estimated total time
            {{ estimatedTotalTime }}
          </span>
        </template>
        <span v-else>Attendants not set yet</span>
      </section>

      <q-space></q-space>

      <transition appear enter-active-class="animated shakeY slower">
        <q-btn v-if="attendants.length > 1" icon="shuffle" @click="doShuffle()">
          <q-tooltip>Shuffle order of speakers</q-tooltip>
        </q-btn>
      </transition>

      <q-btn
        icon="repeat"
        :disable="!attendants.some((att) => att.msElapsed > 0)"
        @click="resetTimes()"
        class="q-ml-md"
      >
        <q-tooltip>Reset elapsed times' of all attendants</q-tooltip>
      </q-btn>

      <q-btn v-if="attendants.length > 0" icon="close" @click="resetMeeting()" class="q-ml-md">
        <q-tooltip>Reset meeting</q-tooltip>
      </q-btn>
    </section>

    <section class="q-mt-md row justify-center">
      <draggable :list="attendants" item-key="_uid" class="col-9">
        <template #item="{ element }: { element: Attendant, index: number }">
          <transition
            appear
            enter-active-class="animated zoomIn slow"
            leave-active-class="animated zoomOut slow"
          >
            <attendant-view
              :attendant="element"
              :is-active="element._uid == activeAttendantId"
            ></attendant-view>
          </transition>
        </template>
      </draggable>
    </section>

    <transition
      mode="out-in"
      enter-active-class="animated zoomIn slow"
      leave-active-class="animated zoomOut slow"
    >
      <section v-if="attendants.length > 1" class="q-mt-sm row justify-center">
        <span class="col-9">(drag around to reorder)</span>
      </section>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import draggable from 'vuedraggable';

import AttendantView from './AttendantView.vue';
import { useMeetingStore } from 'src/stores/meetingStore';
import { Attendant, msToFormatted } from './AttendantModel';

const { shuffleAttendants, resetTimes, resetMeeting, updateNextAttendant } = useMeetingStore();
const { attendants, msPerAttendant, activeAttendantId } = storeToRefs(useMeetingStore());

const estimatedTotalTime = computed(() => {
  const msTotal = msPerAttendant.value * attendants.value.length;
  return msToFormatted(msTotal, false);
});

const doShuffle = async () => {
  shuffleAttendants();
  updateNextAttendant();
};
</script>
