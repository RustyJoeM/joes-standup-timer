<template>
  <section class="q-pa-sm">
    <span class="text-h6">Meeting setup</span>

    <section class="q-mt-md row q-gutter-x-md">
      <q-input
        type="number"
        :min="MIN_TALK_TIME_MS / 1000"
        v-model.number="secPerAttendant"
        dense
        outlined
        label="Seconds per person"
        class="col-2"
        :readonly="meetingStarted"
      >
        <q-tooltip v-if="meetingStarted">Reset meeting to modify</q-tooltip>
      </q-input>

      <q-input
        v-model="newName"
        dense
        outlined
        label="Add name"
        @keyup.enter="addNewAttendant()"
        class="col-3"
      >
        <template #append>
          <q-btn flat icon="add" @click="addNewAttendant()"></q-btn>
        </template>
      </q-input>

      <q-checkbox v-model="doCapitalize" dense label="Capitalize first letter"></q-checkbox>

      <q-btn
        v-if="attendants.length > 1"
        icon="shuffle"
        label="Shuffle"
        @click="doShuffle()"
      ></q-btn>

      <q-space></q-space>

      <q-btn icon="delete" label="Clear" @click="clearAttendants()"> </q-btn>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMeetingStore } from 'src/stores/meetingStore';
import { MIN_TALK_TIME_MS } from './AttendantModel';

const { msPerAttendant, attendants } = storeToRefs(useMeetingStore());
const { addAttendant, shuffleAttendants } = useMeetingStore();

const addNewAttendant = () => {
  if (newName.value.length == 0) return;

  let name = newName.value;
  if (doCapitalize.value) {
    name = name.charAt(0).toUpperCase() + name.slice(1);
  }
  addAttendant(name);

  newName.value = '';
};

const secPerAttendant = computed({
  get: () => msPerAttendant.value / 1000,
  set: (value: number) => {
    msPerAttendant.value = value * 1000;
  },
});

const newName = ref('');

const doCapitalize = ref(true);

defineProps<{
  meetingStarted: boolean;
}>();

const clearAttendants = () => {
  newName.value = '';
  doCapitalize.value = true;
  attendants.value = [];
};

const doShuffle = () => {
  shuffleAttendants();
};
</script>
