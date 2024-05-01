<template>
  <section>
    <section class="row">
      <section class="text-h6">
        <span v-if="attendants.length > 0">Attendants ({{ attendants.length }} in total)</span>
        <span v-else>Attendants not set yet</span>
      </section>

      <q-space></q-space>

      <q-btn
        v-if="attendants.length > 1"
        icon="shuffle"
        label="Shuffle"
        @click="shuffleAttendants()"
      >
        <q-tooltip>Shuffle order of speakers</q-tooltip>
      </q-btn>

      <q-btn
        v-if="attendants.length > 0"
        icon-right="close"
        label="Remove all"
        @click="attendants = []"
        class="q-ml-md"
      >
        <q-tooltip>Clear all attendants</q-tooltip>
      </q-btn>
    </section>

    <section class="q-mt-md row justify-center">
      <draggable :list="attendants" item-key="_uid" class="col-9">
        <template #item="{ index }">
          <transition
            appear
            enter-active-class="animated zoomIn slow"
            leave-active-class="animated zoomOut slow"
          >
            <attendant-view
              :attendant-index="index"
              :is-active="index == activeAttendantIndex"
            ></attendant-view>
          </transition>
        </template>
      </draggable>
    </section>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import draggable from 'vuedraggable';
import AttendantView from './AttendantView.vue';
import { useMeetingStore } from 'src/stores/meetingStore';

const { shuffleAttendants } = useMeetingStore();
const { attendants, activeAttendantIndex } = storeToRefs(useMeetingStore());
</script>