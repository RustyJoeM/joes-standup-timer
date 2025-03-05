<template>
  <div class="column">
    <header class="row items-center justify-between">
      <span class="text-h6">Meeting setup</span>
      <q-btn flat icon="share" label="share" @click="setupToClipboard" dense>
        <q-tooltip :delay="500">Copy current setup to URL link</q-tooltip>
      </q-btn>
    </header>

    <section class="q-mt-md row items-baseline">
      <q-input
        type="number"
        :min="MIN_TALK_TIME_MS / 1000"
        v-model.number="secPerAttendant"
        outlined
        label="Seconds per person"
        class="col"
      >
      </q-input>

      <q-input
        ref="newNameRef"
        v-model="newName"
        outlined
        hide-bottom-space
        label="Add name"
        @keyup.enter="addNewAttendant()"
        class="q-ml-md col"
        :rules="[(val) => nameNotTaken(val) || 'Same name already added']"
      >
        <template #append>
          <q-btn dense flat icon="add" @click="addNewAttendant()"></q-btn>
        </template>
      </q-input>

      <q-checkbox v-model="doCapitalize" dense label="Capitalize first letter" class="q-ml-md"></q-checkbox>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Notify, QInput, copyToClipboard } from 'quasar';

import { useMeetingStore } from 'src/stores/meetingStore';
import { MIN_TALK_TIME_MS } from './AttendantModel';

const newNameRef = ref<QInput | null>(null);

const { allAttendantNames, msPerAttendant } = storeToRefs(useMeetingStore());
const { addAttendant, updateNextAttendant, resetMeeting } = useMeetingStore();

const cappedName = (name: string) => {
  if (doCapitalize.value) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  return name;
};

const addNewAttendant = () => {
  if (!newNameRef.value?.validate()) {
    return;
  }

  if (newName.value.length == 0) return;
  addAttendant(cappedName(newName.value));
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

const nameNotTaken = (val: string) => {
  return !allAttendantNames.value.some((name) => name == cappedName(val));
};

defineProps<{
  meetingStarted: boolean;
}>();

import { watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const NAME_SEPARATOR = ',';

interface SetupQueryProps {
  secs: number | undefined;
  names: string | undefined;
}

watch(
  () => route.query,
  (newQuery) => {
    resetMeeting();
    const queryProps = newQuery as unknown as SetupQueryProps;
    if (queryProps.secs) {
      msPerAttendant.value = queryProps.secs * 1000;
    }
    if (queryProps.names) {
      const namesStr = decodeURIComponent(queryProps.names);
      namesStr.split(NAME_SEPARATOR).forEach((name) => addAttendant(name));
      updateNextAttendant();
    }
  },
  { immediate: true }
);

const setupToClipboard = () => {
  const loc = window.location;
  const path = `${loc.protocol}//${loc.host}${loc.pathname}`;
  const secs = '' + msPerAttendant.value / 1000;
  // TODO preserve present/absent groups?
  const namesStr = allAttendantNames.value.join(NAME_SEPARATOR);
  const url = `${path}#/?secs=${secs}&names=${encodeURIComponent(namesStr)}`;
  copyToClipboard(url);
  Notify.create({ position: 'bottom', type: 'info', message: 'URL copied to clipboard...' });
};
</script>
