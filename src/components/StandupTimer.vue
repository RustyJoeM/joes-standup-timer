<template>
  <q-card style="width: 80vw; height: 80vh" class="q-pa-md">
    <q-card-section id="setup">
      <span class="text-h6">Setup</span>
      <q-separator></q-separator>

      <section class="q-mt-md row q-gutter-x-md">
        <q-input
          type="number"
          v-model.number="secsPerPerson"
          dense
          outlined
          label="Seconds per person"
          class="col-2"
          :readonly="!secsEditable"
        >
          <q-tooltip v-if="!secsEditable"
            >Clear attendants list to modify this again</q-tooltip
          ></q-input
        >
        <q-input
          v-model="newName"
          dense
          outlined
          label="Add name"
          @keyup.enter="addNewAttendant()"
          class="col-3"
        >
          <template #append>
            <q-btn dense flat icon="add" @click="addNewAttendant()"></q-btn>
          </template>
        </q-input>
        <q-checkbox v-model="doCapitalize" dense label="Capitalize first letter"></q-checkbox>

        <q-space> </q-space>
        <q-btn icon="delete" label="Reset" @click="resetData()"> </q-btn>
      </section>
    </q-card-section>

    <q-card-section id="attendants">
      <section class="text-h6">
        <span v-if="attendants.length > 0">Attendants ({{ attendants.length }} in total)</span>
        <span v-else>No names yet</span>
      </section>
      <q-separator></q-separator>

      <section class="q-mt-md">
        <!-- TODO - resolve leave transition -->
        <draggable :list="attendants" item-key="name">
          <template #item="{ element, index }">
            <transition
              appear
              enter-active-class="animated zoomIn slow"
              leave-active-class="animated zoomOut slow"
            >
              <q-linear-progress
                :value="1 - element.timeLeft / secsPerPerson"
                size="3rem"
                color="primary"
                animation-speed="900"
                rounded
                class="q-mt-sm"
              >
                <div :key="index" class="absolute-full flex flex-center row">
                  <div class="col-12 row items-center q-px-md">
                    <q-badge color="grey-6" class="text-white text-subtitle1">{{
                      element.name
                    }}</q-badge>
                    <q-space></q-space>
                    <q-chip
                      v-if="element.isFinished || index == selectedAttendantIndex"
                      square
                      size="md"
                      :label="secondsToFormatted(element.timeLeft)"
                    />
                    <q-space></q-space>
                    <q-btn
                      round
                      dense
                      icon="close"
                      color="grey-6"
                      text-color="white"
                      @click="removeAttendant(index)"
                    ></q-btn>
                  </div>
                </div>
              </q-linear-progress>
            </transition>
          </template>
        </draggable>
      </section>
    </q-card-section>

    <q-card-section id="controls" v-if="attendants.length > 0">
      <q-separator></q-separator>

      <section class="q-mt-md row items-center justify-center">
        <template v-if="attendants.some((a) => !a.isFinished)">
          <q-btn
            v-if="clockTicking"
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
            label="Start/Resume"
            :disable="attendants.length == 0"
            size="md"
            @click="doResume()"
            class="col-3"
          ></q-btn>
        </template>
        <q-btn
          v-if="nextIndex > -1"
          icon="navigate_next"
          label="Next person"
          :disable="attendants.length == 0"
          size="md"
          class="col-3 q-ml-md"
          @click="doNext()"
        ></q-btn>
      </section>
    </q-card-section>
    <q-card-section v-if="attendants.length > 0 && !attendants.some((a) => !a.isFinished)">
      <section id="summary" class="row items-center text-h6 column">
        <span>Everyone finished!</span>
        <span>
          Total time taken: <q-chip square>{{ secondsToFormatted(totalTime()) }} </q-chip>
        </span>
      </section>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Attendant, newAttendant } from './AttendantModel';

import draggable from 'vuedraggable';
import { Notify } from 'quasar';

const DEFAULT_SECS = 5;

const secsEditable = ref(true);
const secsPerPerson = ref<number>(DEFAULT_SECS);

const newName = ref<string>('');

const doCapitalize = ref(true);

const attendants = ref<Attendant[]>([]);

const clockTicking = ref(false);

const addNewAttendant = () => {
  if (newName.value.length == 0) return;
  secsEditable.value = false;
  let name = newName.value;
  if (doCapitalize.value) {
    name = name.charAt(0).toUpperCase() + name.slice(1);
  }
  attendants.value.push(newAttendant(name, secsPerPerson.value));
  newName.value = '';
};

const removeAttendant = (index: number) => {
  attendants.value.splice(index, 1);
  if (attendants.value.length == 0) {
    secsEditable.value = true;
  }
};

const secondsToFormatted = (val: number) => {
  const sign = val >= 0 ? '' : 'Overtime: ';
  const valAbs = Math.abs(val);
  const minutes = Math.floor(valAbs / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (valAbs % 60).toString().padStart(2, '0');

  return `${sign}${minutes}:${seconds}`;
};

const selectedAttendantIndex = ref(-1);

const selectedAttendant = computed<Attendant | undefined>(() => {
  if (attendants.value.length == 0) return undefined;
  if (selectedAttendantIndex.value < 0) return undefined;
  return attendants.value[selectedAttendantIndex.value];
});

const doTick = () => {
  setTimeout(() => {
    if (!clockTicking.value) return;
    if (!selectedAttendant.value) return;
    selectedAttendant.value.timeLeft -= 1;
    doTick();
  }, 1000);
};

const doPause = () => {
  clockTicking.value = false;
};

const nextIndex = computed(() => {
  if (attendants.value.length == 0) return -1;
  return attendants.value.findIndex((att) => !att.isFinished);
});

const nextAttendant = computed(() => {
  if (nextIndex.value < 0) return undefined;
  return attendants.value[nextIndex.value];
});

const doResume = () => {
  if (selectedAttendantIndex.value > -1) {
    clockTicking.value = true;
    doTick();
    return;
  }

  if (nextIndex.value > -1) {
    Notify.create({ type: 'info', message: `${nextAttendant.value?.name} talks NOW! :)` });
    setTimeout(() => {
      selectedAttendantIndex.value = nextIndex.value;
      clockTicking.value = true;
      doTick();
    }, 1000);
  }
};

const doNext = () => {
  clockTicking.value = false;

  // finish currently talking name
  if (selectedAttendantIndex.value > -1) {
    attendants.value[selectedAttendantIndex.value].isFinished = true;
    selectedAttendantIndex.value = -1;
  }

  // start next name if applicable
  if (nextIndex.value > -1) {
    Notify.create({ type: 'info', message: `${nextAttendant.value?.name} talks NOW! :)` });
    setTimeout(() => {
      selectedAttendantIndex.value = nextIndex.value;
      clockTicking.value = true;
      doTick();
    }, 1000);
    return;
  }

  Notify.create({ type: 'positive', message: 'All done!' });
};

const totalTime = () => {
  return attendants.value
    .map((att) =>
      att.timeLeft < 0
        ? Math.abs(att.timeLeft) + secsPerPerson.value
        : secsPerPerson.value - att.timeLeft
    )
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
};

const resetData = () => {
  secsEditable.value = true;
  secsPerPerson.value = DEFAULT_SECS;
  newName.value = '';
  doCapitalize.value = true;
  attendants.value = [];
};
</script>
