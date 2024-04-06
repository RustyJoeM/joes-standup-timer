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
          :min="10"
          :max="300"
          label="Seconds per person"
          class="col-2"
        ></q-input>
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
      </section>
    </q-card-section>

    <q-card-section id="attendants">
      <section class="text-h6">
        <span v-if="attendants.length > 0">Attendants ({{ attendants.length }} in total)</span>
        <span v-else>No names yet</span>
      </section>
      <q-separator></q-separator>

      <section class="q-mt-md">
        <draggable :list="attendants" item-key="name">
          <template #item="{ element, index }">
            <attendant-view
              :attendant="element"
              @remove="removeAttendant(index)"
              class="q-ml-md"
            ></attendant-view>
          </template>
        </draggable>
      </section>
    </q-card-section>

    <q-card-section id="controls" v-if="attendants.length > 0">
      <span class="text-h6">Now talking</span>
      <q-separator></q-separator>

      <section v-if="progressValue != undefined" class="q-mt-md">
        <span class="text-h6 row items-center justify-center"
          >{{ activeAttendant?.name }}'s slot</span
        >
        <q-linear-progress
          :value="progressValue"
          size="3rem"
          :color="progressColor"
          animation-speed="900"
        >
          <div class="absolute-full flex flex-center">
            <q-chip
              v-if="activeAttendant"
              square
              size="md"
              :label="secondsToFormatted(activeAttendant?.timeLeft)"
            />
          </div>
        </q-linear-progress>
      </section>

      <section class="q-mt-md row items-center justify-center">
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
          @click="doPlay()"
          class="col-3"
        ></q-btn>
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
    {{ attendants }}
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Attendant, newAttendant } from './AttendantModel';

import draggable from 'vuedraggable';
import AttendantView from './AttendantView.vue';
import { Notify } from 'quasar';

const secsPerPerson = ref<number>(5);

const newName = ref<string>('');

const doCapitalize = ref(true);

const attendants = ref<Attendant[]>([]);

const clockTicking = ref(false);

const addNewAttendant = () => {
  if (newName.value.length == 0) return;
  let name = newName.value;
  if (doCapitalize.value) {
    name = name.charAt(0).toUpperCase() + name.slice(1);
  }
  attendants.value.push(newAttendant(name, secsPerPerson.value));
  newName.value = '';
};

const removeAttendant = (index: number) => {
  attendants.value.splice(index, 1);
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

const activeIndex = ref(-1);

const activeAttendant = computed<Attendant | undefined>(() => {
  if (attendants.value.length == 0) return undefined;
  if (activeIndex.value < 0) return undefined;
  return attendants.value[activeIndex.value];
});

const doTick = () => {
  setTimeout(() => {
    if (!clockTicking.value) return;
    const activeAtt = activeAttendant.value;
    if (!activeAtt) return;
    activeAtt.timeLeft -= 1;
    doTick();
  }, 1000);
};

const progressValue = computed(() => {
  const attendant = activeAttendant.value;
  if (!attendant) return undefined;
  return 1 - attendant.timeLeft / secsPerPerson.value;
});

const progressColor = computed(() => {
  const attendant = activeAttendant.value;
  if (!attendant) return undefined;
  return attendant.timeLeft >= 0 ? 'info' : 'warning';
});

const doPause = () => {
  clockTicking.value = false;
};

const nextIndex = computed(() => {
  if (attendants.value.length == 0) return -1;
  return attendants.value.findIndex((att) => !att.isFinished);
});

const doPlay = () => {
  if (nextIndex.value < 0) {
    Notify.create({ type: 'info', message: 'No more people to talk.' });
    return;
  }
  activeIndex.value = nextIndex.value;
  clockTicking.value = true;
  doTick();
};

const doNext = () => {
  if (activeIndex.value > -1) {
    attendants.value[activeIndex.value].isFinished = true;
    activeIndex.value = -1;
  }
  if (nextIndex.value < 0) return;
  activeIndex.value = nextIndex.value;
};
</script>
