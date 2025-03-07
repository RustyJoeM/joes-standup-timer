<template>
  <transition appear enter-active-class="animated zoomIn slower" leave-active="animated zoomOut slower">
    <q-card v-if="tickerId || activeAttendant || nextAttendant" class="q-pa-md">
      <section class="row items-center">
        <div>
          <transition appear enter-active-class="animated pulse" mode="out-in">
            <span v-if="activeAttendant" :key="'' + tickerId" class="text-subtitle1">
              {{ activeAttendant.name }} is {{ tickerId ? 'talking' : 'having a pause' }}.
            </span>
            <span v-else class="text-subtitle1">No one talking now.</span>
          </transition>
        </div>

        <section v-if="activeAttendant" class="q-ml-md">
          <transition appear enter-active-class="animated pulse slower" mode="out-in">
            <control-button v-if="tickerId" id="pause-button" icon="pause" @click="doPause()">
              <q-tooltip :delay="2000">{{ pauseLabel }}</q-tooltip>
            </control-button>
            <control-button v-else id="resume-button" icon="replay" @click="doResume()">
              <q-tooltip :delay="2000">{{ playLabel }}</q-tooltip>
            </control-button>
          </transition>
        </section>

        <section v-if="waitingAttendants.length > 0 || activeAttendantId" class="col q-ml-md">
          <control-button
            v-if="activeAttendant"
            id="finish-button"
            color="secondary"
            icon="check"
            :label="finishLabel"
            @click="finishActive()"
          >
          </control-button>
          <control-button
            v-else
            id="start-next-button"
            color="primary"
            icon="skip_next"
            :label="nextLabel"
            @click="doNext()"
          >
          </control-button>
        </section>
      </section>
    </q-card>
  </transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { AttendeeEvent, useMeetingStore } from 'src/stores/meetingStore';
import { notifyMessage } from './NotifyHelper';
import ControlButton from './ControlButton.vue';

const { updateNextAttendant } = useMeetingStore();

const {
  spokenAttendants,
  waitingAttendants,
  activeAttendant,
  activeAttendantId,
  nextAttendant,
  tickSize,
  tickerId,
  lastEvent,
} = storeToRefs(useMeetingStore());

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
    const elapsedMs = lastTickMs.value ? now - lastTickMs.value : tickSize.value;
    activeAttendant.value.msElapsed += Math.floor(elapsedMs);
    lastTickMs.value = now;
  }, tickSize.value);
};

const doResume = () => {
  if (!activeAttendantId.value) return;
  startTicker();
  notifyMessage('info', `${activeAttendant.value?.name} resumes NOW!`);
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

// TODO this should be handled by store completely?
const finishActive = () => {
  // stop running ticker if applicable
  if (tickerId.value) {
    stopTicker();
  }

  // finish currently talking person
  if (activeAttendant.value) {
    activeAttendant.value.hasFinished = true;
    activeAttendantId.value = undefined;
  }

  updateNextAttendant();
};

const doNext = () => {
  lastEvent.value = AttendeeEvent.Talking;
  // start next person if applicable
  if (nextAttendant.value) {
    notifyMessage('info', `${nextAttendant.value?.name} talks NOW!`);
    activeAttendantId.value = nextAttendant.value._uid;

    const nextAttWaitIndex = waitingAttendants.value.findIndex((att) => att._uid == nextAttendant.value?._uid);
    const n = waitingAttendants.value.splice(nextAttWaitIndex, 1)[0];
    spokenAttendants.value.push(n);
    startTicker();
    return;
  }

  notifyMessage('positive', 'All have spoken!');
};

const playLabel = computed(() => {
  const att = activeAttendant.value;
  if (!att) return '';
  const verb = att.msElapsed > 0 ? 'Resume' : 'Start';
  return `${verb} ${att.name.toLocaleUpperCase()}`;
});

const pauseLabel = computed(() => `Pause ${activeAttendant.value?.name.toLocaleUpperCase()}`);
const finishLabel = computed(() => `Finish ${activeAttendant.value?.name.toLocaleUpperCase()}`);
const nextLabel = computed(() => `Next: ${nextAttendant.value?.name.toLocaleUpperCase()}`);
</script>
