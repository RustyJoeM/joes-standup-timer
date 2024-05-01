<template>
  <q-card-section id="controls" v-if="attendants.length > 0">
    <q-separator></q-separator>

    <section class="q-mt-md row items-center justify-center">
      <template v-if="attendants.some((a) => !a.hasFinished)">
        <q-btn
          v-if="tickerId"
          icon="pause"
          label="Pause"
          :disable="attendants.length == 0"
          size="md"
          @click="doPause()"
          class="col-3"
        ></q-btn>
        <q-btn
          v-else
          icon="play_arrow"
          label="Talk"
          :disable="attendants.length == 0"
          size="md"
          @click="doResume()"
          class="col-3"
        ></q-btn>
      </template>
      <q-btn
        v-if="activeAttendantIndex > -1 || nextAttendantIndex > -1"
        icon="navigate_next"
        label="Next person"
        :disable="attendants.length == 0"
        size="md"
        class="col-3 q-ml-md"
        @click="doNext()"
      ></q-btn>
    </section>
  </q-card-section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMeetingStore } from 'src/stores/meetingStore';
import { Notify } from 'quasar';

const { attendants, activeAttendantIndex, activeAttendant, nextAttendantIndex, nextAttendant } =
  storeToRefs(useMeetingStore());

const TICK_INTERVAL_MS = 100;

const tickerId = ref<NodeJS.Timeout | undefined>(undefined);

const lastTickMs = ref<number | undefined>(undefined);

const startTicker = () => {
  if (tickerId.value) {
    console.error(`Ticker already running! (${tickerId.value})`);
    return;
  }

  tickerId.value = setInterval(() => {
    if (!activeAttendant.value) {
      console.error('Missing active attendant!');
      return;
    }
    const now = performance.now();
    const elapsedMs = lastTickMs.value ? now - lastTickMs.value : TICK_INTERVAL_MS;
    activeAttendant.value.msElapsed += elapsedMs;
    lastTickMs.value = now;
  }, TICK_INTERVAL_MS);
};

const doResume = () => {
  // TODO - simplify a bit
  if (activeAttendantIndex.value > -1) {
    Notify.create({ type: 'info', message: `${activeAttendant.value?.name} continues NOW! :)` });
    startTicker();
    return;
  }

  if (nextAttendantIndex.value > -1) {
    Notify.create({ type: 'info', message: `${nextAttendant.value?.name} continues NOW! :)` });
    activeAttendantIndex.value = nextAttendantIndex.value;
    startTicker();
  }
};

const stopTicker = () => {
  clearInterval(tickerId.value);
  tickerId.value = undefined;
  lastTickMs.value = undefined;
};

const doPause = () => {
  if (!tickerId.value) return;
  stopTicker();
};

const doNext = () => {
  // stop running ticker if applicable
  if (tickerId.value) {
    stopTicker();
  }

  // finish currently talking person
  if (activeAttendant.value) {
    activeAttendant.value.hasFinished = true;
    activeAttendantIndex.value = -1;
  }

  // start next person if applicable
  if (nextAttendantIndex.value > -1) {
    Notify.create({ type: 'info', message: `${nextAttendant.value?.name} talks NOW! :)` });
    activeAttendantIndex.value = nextAttendantIndex.value;
    startTicker();
    return;
  }

  Notify.create({ type: 'positive', message: 'All have spoken!' });
};
</script>
