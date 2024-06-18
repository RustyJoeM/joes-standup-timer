<template>
  <section class="column">
    <section id="header" class="row">
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
        <q-btn v-if="attendants.length > 1" icon="shuffle" @click="updateNextAttendant()">
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

    <template v-if="talkedAttendants.length > 0 || activeAttendant">
      <span class="q-mt-md text-subtitle1">Have talked:</span>
      <section class="row justify-center">
        <section class="col-9">
          <transition-group
            v-for="attendant in talkedAttendants"
            :key="attendant._uid"
            leave-active-class="animated zoomOut slow"
          >
            <attendant-view
              :key="attendant._uid"
              :attendant="attendant"
              :is-active="attendant._uid == activeAttendantId"
            ></attendant-view>
          </transition-group>
        </section>
      </section>
    </template>

    <section id="waiting-attendants" v-if="waitingAttendants.length > 0" class="q-mt-md column">
      <span class="text-subtitle1">Waiting to talk:</span>
      <div class="row">
        <transition-group
          appear
          enter-active-class="animated bounceIn slow"
          leave-active-class="animated bounceOut slow"
        >
          <div v-for="att of waitingAttendants" :key="att._uid" class="q-ml-md row">
            <attendant-chip :attendant="att" size="lg" class="col-shrink">
              <transition appear enter-active-class="animated heartBeat slow">
                <q-badge floating v-if="att._uid == nextAttendantId">NEXT</q-badge>
              </transition>
            </attendant-chip>
          </div>
        </transition-group>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import AttendantView from './AttendantView.vue';
import { useMeetingStore } from 'src/stores/meetingStore';
import { msToFormatted } from './AttendantModel';
import AttendantChip from './AttendantChip.vue';

const { resetTimes, resetMeeting, updateNextAttendant } = useMeetingStore();

const { attendants, msPerAttendant, activeAttendantId, activeAttendant, nextAttendantId } =
  storeToRefs(useMeetingStore());

const estimatedTotalTime = computed(() => {
  const msTotal = msPerAttendant.value * attendants.value.length;
  return msToFormatted(msTotal, false);
});

const talkedAttendants = computed(() =>
  attendants.value.filter((att) => att.hasFinished || att._uid == activeAttendantId.value)
);

const waitingAttendants = computed(() =>
  attendants.value.filter((att) => !att.hasFinished && att.msElapsed == 0)
);
</script>
