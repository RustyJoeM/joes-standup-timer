<template>
  <section class="column">
    <header class="row items-center justify-between">
      <section class="text-h6">
        <template v-if="presentAttendants > 0">
          <span>
            {{ presentAttendants }} {{ presentAttendants > 1 ? 'people' : ' person' }} attending -
            {{ estimatedTotalTime }} in total
          </span>
        </template>
        <span v-else>No present or setup attendants yet.</span>
      </section>

      <div v-if="presentAttendants > 0" class="row items-center">
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
          <transition-group appear enter-active-class="animated zoomIn slow" leave-active-class="animated zoomOut slow">
            <attendant-view
              v-for="attendant in spokenAttendants"
              :key="attendant._uid"
              :attendant="attendant"
              :is-active="attendant._uid == activeAttendantId"
              :allowCheckout="false"
              class="q-mt-sm"
            ></attendant-view>
          </transition-group>
        </section>
      </section>
    </template>

    <section v-if="waitingAttendants.length > 0" id="waiting-attendants" class="q-mt-lg column">
      <span class="text-subtitle1">Waiting to talk:</span>

      <template v-if="!runningMysteryMode">
        <section class="row justify-center">
          <draggable :list="waitingAttendants" item-key="_uid" class="col-9" @update="reorderedWaiting">
            <template #item="{ element }: { element: Attendant, index: number }">
              <transition appear enter-active-class="animated zoomIn slow" leave-active-class="animated zoomOut slow">
                <attendant-view
                  :attendant="element"
                  :is-active="element._uid == activeAttendantId"
                  :allow-checkout="true"
                  class="q-mt-sm"
                ></attendant-view>
              </transition>
            </template>
          </draggable>
        </section>
        <transition mode="out-in" enter-active-class="animated zoomIn slow" leave-active-class="animated zoomOut slow">
          <section v-if="!runningMysteryMode && waitingAttendants.length > 1" class="q-mt-sm row justify-center">
            <span>(drag around to reorder)</span>
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
            <q-card class="q-mt-sm">
              <!-- extra q-card for floating badge anchoring! -->
              <q-linear-progress size="3rem" rounded class="row items-center">
                <attendant-chip :attendant="att" class="q-ml-md"></attendant-chip>
                <absence-toggle-button
                  :perform="'check-out'"
                  :uid="att._uid"
                  size="sm"
                  class="q-ml-lg"
                ></absence-toggle-button>
                <attendant-remove-button :uid="att._uid" size="sm" class="q-ml-md q-mr-md"></attendant-remove-button>
              </q-linear-progress>
              <transition appear enter-active-class="animated heartBeat slow">
                <q-badge floating v-if="att._uid == nextAttendantId">NEXT</q-badge>
              </transition>
            </q-card>
          </div>
        </transition-group>
      </div>
    </section>

    <section v-if="absentAttendants.length > 0" class="q-mt-md">
      <span class="text-subtitle1">Postponed / absent talkers:</span>

      <div class="row">
        <transition-group
          appear
          enter-active-class="animated bounceIn slow"
          leave-active-class="animated bounceOut slow"
        >
          <div v-for="att of absentAttendants" :key="att._uid" class="q-ml-md">
            <q-linear-progress size="3rem" rounded class="row items-center q-mt-md">
              <attendant-chip :attendant="att" class="q-ml-sm"></attendant-chip>
              <absence-toggle-button
                :perform="'check-in'"
                :uid="att._uid"
                size="sm"
                class="q-ml-lg"
              ></absence-toggle-button>
              <attendant-remove-button :uid="att._uid" size="sm" class="q-ml-md q-mr-md"></attendant-remove-button>
            </q-linear-progress>
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

import AbsenceToggleButton from './AbsenceToggleButton.vue';
import AttendantRemoveButton from './AttendantRemoveButton.vue';

const { shuffleAttendants, resetTimes, resetMeeting, updateNextAttendant } = useMeetingStore();

const {
  waitingAttendants,
  spokenAttendants,
  absentAttendants,
  msPerAttendant,
  activeAttendantId,
  runningMysteryMode,
  nextAttendantId,
} = storeToRefs(useMeetingStore());

const presentAttendants = computed(() => {
  return spokenAttendants.value.length + waitingAttendants.value.length;
});

const estimatedTotalTime = computed(() => {
  const msTotal = msPerAttendant.value * presentAttendants.value;
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
