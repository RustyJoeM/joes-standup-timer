<template>
  <section class="column justify-end">
    <q-btn v-if="tickerId" icon="pause" :label="pauseLabel" size="lg" @click="doPause()"></q-btn>
    <q-btn
      v-if="!tickerId && activeAttendant"
      icon="play_arrow"
      :label="playLabel"
      :disable="attendants.length == 0"
      size="lg"
      @click="doResume()"
    ></q-btn>

    <q-btn
      v-if="activeAttendantIndex > -1 || nextAttendantIndex > -1"
      :disable="attendants.length == 0"
      icon="play_arrow"
      size="lg"
      class="q-mt-md"
      color="secondary"
      @click="doNext()"
    >
      {{ nextAttendant ? 'Next speaker:' : 'Finish:' }} <br />{{
        nextAttendant ? nextAttendant.name : activeAttendant?.name
      }}
    </q-btn>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMeetingStore } from 'src/stores/meetingStore';
import { Notify } from 'quasar';

const { attendants, activeAttendantIndex, activeAttendant, nextAttendantIndex, nextAttendant } =
  storeToRefs(useMeetingStore());

const TICK_INTERVAL_MS = 1000;

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
    notifyMessage('info', `${activeAttendant.value?.name} continues NOW!`);
    startTicker();
    return;
  }

  if (nextAttendantIndex.value > -1) {
    notifyMessage('info', `${nextAttendant.value?.name} continues NOW!`);
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
  notifyMessage('info', `${activeAttendant.value?.name} catches a breath...`);
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
    notifyMessage('info', `${nextAttendant.value?.name} talks NOW! :)`);
    activeAttendantIndex.value = nextAttendantIndex.value;
    startTicker();
    return;
  }

  notifyMessage('positive', 'All have spoken!');
};

const playLabel = computed(() => {
  const att = activeAttendant.value;
  if (!att) return undefined;
  const verb = att.msElapsed > 0 ? 'Continue' : 'Start';
  return `${verb} ${att.name}`;
});

const pauseLabel = computed(() => {
  return `Pause ${activeAttendant.value?.name}`;
});

const notifyMessage = (type: string, message: string) => {
  Notify.create({ position: 'bottom-left', type, message });
};
</script>
