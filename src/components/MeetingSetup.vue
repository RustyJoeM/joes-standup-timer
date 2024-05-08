<template>
  <section>
    <span class="text-h6">Meeting setup</span>

    <section class="q-mt-md q-ml-md row">
      <q-input
        type="number"
        :min="MIN_TALK_TIME_MS / 1000"
        v-model.number="secPerAttendant"
        dense
        outlined
        label="Seconds per person"
        class="col-2"
      >
        <q-tooltip v-if="meetingStarted">Reset meeting to modify</q-tooltip>
      </q-input>

      <q-input
        ref="newNameRef"
        v-model="newName"
        dense
        outlined
        label="Add name"
        @keyup.enter="addNewAttendant()"
        class="q-ml-md col-3"
        :rules="[(val) => nameAlreadyAdded(val) || 'Same name already added']"
      >
        <template #append>
          <q-btn dense flat icon="add" @click="addNewAttendant()"></q-btn>
        </template>
      </q-input>

      <q-checkbox
        v-model="doCapitalize"
        dense
        label="Capitalize first letter"
        class="q-ml-md"
      ></q-checkbox>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { QInput } from 'quasar';

import { useMeetingStore } from 'src/stores/meetingStore';
import { MIN_TALK_TIME_MS } from './AttendantModel';

const newNameRef = ref<QInput | null>(null);

const { attendants, msPerAttendant } = storeToRefs(useMeetingStore());
const { addAttendant } = useMeetingStore();

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

const nameAlreadyAdded = (val: string) => {
  return !attendants.value.some((att) => att.name == cappedName(val));
};

defineProps<{
  meetingStarted: boolean;
}>();
</script>
