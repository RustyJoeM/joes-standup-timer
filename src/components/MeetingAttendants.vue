<template>
  <section class="q-pa-md">
    <section class="text-h6">
      <span v-if="attendants.length > 0">Attendants ({{ attendants.length }} in total)</span>
      <span v-else>Attendants not set yet</span>
    </section>

    <section class="q-mt-md">
      <draggable :list="attendants" item-key="_uid">
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

const { attendants, activeAttendantIndex } = storeToRefs(useMeetingStore());
</script>
