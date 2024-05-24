<template>
  <transition
    appear
    enter-active-class="animated zoomIn slower"
    leave-active="animated zoomOut slower"
  >
    <q-card
      v-if="tickerId || activeAttendant || nextAttendant"
      @mouseenter="triggerDragHint()"
      @mouseleave="leaveDragHint()"
    >
      <q-card-section>
        <section class="row items-center justify-start" style="position: relative">
          <transition appear enter-active-class="animated pulse" mode="out-in">
            <span v-if="activeAttendant" class="text-subtitle1" :key="'' + tickerId">
              {{ activeAttendant.name }} is {{ tickerId ? 'talking' : 'having a pause' }}.
            </span>
            <span v-else class="text-subtitle1">No one talking now.</span>
          </transition>

          <section class="q-ml-md" v-if="activeAttendant">
            <transition appear enter-active-class="animated pulse slower" mode="out-in">
              <control-button id="pause-button" v-if="tickerId" icon="pause" @click="doPause()">
                <q-tooltip :delay="2000">{{ pauseLabel }}</q-tooltip>
              </control-button>
              <control-button id="resume-button" v-else icon="replay" @click="doResume()">
                <q-tooltip :delay="2000">{{ playLabel }}</q-tooltip>
              </control-button>
            </transition>
          </section>

          <section class="col q-ml-md" v-if="attendants.length > 0">
            <control-button
              id="finish-button"
              v-if="activeAttendant"
              color="primary"
              icon="check"
              :label="finishLabel"
              @click="finishActive()"
            >
            </control-button>
            <control-button
              id="start-next-button"
              v-else
              color="primary"
              icon="skip_next"
              :label="nextLabel"
              @click="doNext()"
            >
            </control-button>
          </section>

          <div v-show="showDragHint" style="position: absolute; bottom: 0; right: 0">
            <q-badge floating color="grey-5">(drag me if needed)</q-badge>
          </div>
        </section>
      </q-card-section>
    </q-card>
  </transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMeetingStore } from 'src/stores/meetingStore';
import { notifyMessage } from './NotifyHelper';
import ControlButton from './ControlButton.vue';

const { attendants, activeAttendant, activeAttendantId, nextAttendant, tickSize } = storeToRefs(
  useMeetingStore()
);

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
    const elapsedMs = lastTickMs.value ? now - lastTickMs.value : tickSize.value;
    activeAttendant.value.msElapsed += Math.floor(elapsedMs);
    lastTickMs.value = now;
  }, tickSize.value);
};

const doResume = () => {
  // TODO - simplify a bit
  if (activeAttendantId.value) {
    notifyMessage('info', `${activeAttendant.value?.name} resumes NOW!`);
    startTicker();
    return;
  }

  if (nextAttendant.value) {
    notifyMessage('info', `${nextAttendant.value?.name} resumes NOW!`);
    activeAttendantId.value = nextAttendant.value._uid;
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
};

const doNext = () => {
  // just to be sure
  finishActive();

  // start next person if applicable
  if (nextAttendant.value) {
    notifyMessage('info', `${nextAttendant.value?.name} talks NOW!`);
    activeAttendantId.value = nextAttendant.value._uid;
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

const showDragHint = ref(false);
const hintActuallyExited = ref(false);

const triggerDragHint = () => {
  if (!hintActuallyExited.value) {
    showDragHint.value = false;
    return;
  }
  hintActuallyExited.value = false;
  showDragHint.value = true;
  setTimeout(() => {
    showDragHint.value = false;
  }, 2000);
};

const leaveDragHint = () => {
  hintActuallyExited.value = true;
  showDragHint.value = false;
};
</script>
