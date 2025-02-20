<template>
  <section class="column">
    <header class="row items-center justify-between">
      <section class="text-h6">
        <template v-if="totalAttendants > 0">
          <span>
            {{ totalAttendants }} {{ totalAttendants > 1 ? 'people' : ' person' }} attending -
            {{ estimatedTotalTime }} in total
          </span>
        </template>
        <span v-else>No attendants set up yet</span>
      </section>

      <div v-if="totalAttendants > 0" class="row items-center">
        <transition appear enter-active-class="animated shakeY slower">
          <q-btn v-if="waitingAttendants.length > 1" dense icon="shuffle" label="shuffle" @click="doShuffle()">
            <q-tooltip :delay="500">Shuffle waiting speakers</q-tooltip>
          </q-btn>
        </transition>

        <q-btn
          dense
          icon="restore"
          label="Reset"
          :disable="spokenAttendants.length < 1"
          @click="resetTimes()"
          class="q-ml-md"
        >
          <q-tooltip :delay="500">Reset elapsed times of all attendants</q-tooltip>
        </q-btn>

        <q-btn dense icon="close" label="Delete" @click="resetMeetingDialog" class="q-ml-md">
          <q-tooltip :delay="500">Delete all participants</q-tooltip>
        </q-btn>
      </div>
    </header>

    <template v-if="spokenAttendants.length > 0">
      <span class="q-mt-md text-subtitle1">Have talked:</span>
      <section class="row justify-center">
        <section class="col-9">
          <transition-group
            v-for="attendant in spokenAttendants"
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

    <section v-if="waitingAttendants.length > 0" id="waiting-attendants" class="q-mt-md column">
      <span class="text-subtitle1">Waiting to talk:</span>

      <template v-if="!runningMysteryMode">
        <section class="row justify-center">
          <draggable :list="waitingAttendants" item-key="_uid" class="col-9" @update="reorderedWaiting">
            <template #item="{ element }: { element: Attendant, index: number }">
              <transition appear enter-active-class="animated zoomIn slow" leave-active-class="animated zoomOut slow">
                <attendant-view :attendant="element" :is-active="element._uid == activeAttendantId"></attendant-view>
              </transition>
            </template>
          </draggable>
        </section>
        <transition mode="out-in" enter-active-class="animated zoomIn slow" leave-active-class="animated zoomOut slow">
          <section v-if="!runningMysteryMode && waitingAttendants.length > 1" class="q-mt-sm row justify-center">
            <span class="col-9">(drag around to reorder)</span>
          </section>
        </transition>
      </template>
      <div v-else class="row justify-center">
        <transition-group
          appear
          enter-active-class="animated bounceIn slow"
          leave-active-class="animated bounceOut slow"
        >
          <div v-for="att of waitingAttendants" :key="att._uid" class="q-ml-md">
            <attendant-chip :attendant="att" size="lg">
              <q-btn class="q-ml-md" dense icon="close" size="xs" @click="removeAttendant(att._uid)"></q-btn>
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
import draggable from 'vuedraggable';
import { useQuasar } from 'quasar';

import AttendantView from './AttendantView.vue';
import AttendantChip from './AttendantChip.vue';
import { useMeetingStore } from 'src/stores/meetingStore';
import { Attendant, msToFormatted } from './AttendantModel';

const { shuffleAttendants, resetTimes, resetMeeting, updateNextAttendant, removeAttendant } = useMeetingStore();

const { waitingAttendants, spokenAttendants, msPerAttendant, activeAttendantId, runningMysteryMode, nextAttendantId } =
  storeToRefs(useMeetingStore());

const totalAttendants = computed(() => {
  return spokenAttendants.value.length + waitingAttendants.value.length;
});

const estimatedTotalTime = computed(() => {
  const msTotal = msPerAttendant.value * totalAttendants.value;
  return msToFormatted(msTotal, false);
});

const doShuffle = async () => {
  if (!runningMysteryMode.value) {
    shuffleAttendants();
  }
  updateNextAttendant();
};

const reorderedWaiting = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
  // update next / top-most waiting speaker if needed
  if (oldIndex == 0 || newIndex == 0) {
    updateNextAttendant();
  }
};

const $q = useQuasar();

const resetMeetingDialog = () => {
  $q.dialog({
    title: 'Delete all attendants',
    message: 'Would you like to delete all meeting attendants?',
    cancel: true,
  }).onOk(() => {
    resetMeeting();
  });
};
</script>
