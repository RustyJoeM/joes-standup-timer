<template>
  <q-linear-progress
    :value="progress"
    size="3rem"
    color="primary"
    :animation-speed="animSpeed"
    rounded
    class="q-mt-sm"
  >
    <div :key="attendantIndex" class="absolute-full flex flex-center row">
      <div class="col-12 row items-center q-px-md">
        <section class="col row justify-start">
          <q-badge color="grey-5" class="text-white text-subtitle1">
            <span class="text-black">{{ attendant.name }}</span>
            <q-popup-edit v-model="attendant.name" auto-save v-slot="scope">
              <q-input filled v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-badge>
        </section>
        <section class="col row justify-center">
          <q-chip
            v-if="attendant.hasFinished || isActive"
            square
            size="md"
            :label="formattedTimestamp"
          />
        </section>
        <section class="col row justify-end">
          <q-btn
            dense
            flat
            text-color="black"
            icon="close"
            @click="attendants.splice(attendantIndex, 1)"
          ></q-btn>
        </section>
      </div>
    </div>
  </q-linear-progress>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMeetingStore } from 'src/stores/meetingStore';
import { msToFormatted } from './AttendantModel';

const props = defineProps<{
  attendantIndex: number;
  isActive: boolean;
}>();

const { msPerAttendant, attendants, tickSize, displayMillis } = storeToRefs(useMeetingStore());

const animSpeed = computed(() => 0.95 * tickSize.value);

const attendant = computed(() => {
  return attendants.value[props.attendantIndex];
});

const progress = computed(() => {
  // return exact fraction for finished talkers
  if (attendant.value.hasFinished) {
    return attendant.value.msElapsed / msPerAttendant.value;
  }
  // return full second rounded progress only for more discrete animation
  const roundedMillis = Math.floor(attendant.value.msElapsed / 1000) * 1000;
  return roundedMillis / msPerAttendant.value;
});

const formattedTimestamp = computed(() => {
  const elapsedMs = attendant.value.msElapsed;

  const showMillis = attendant.value.hasFinished ? displayMillis.value : false;
  // print elapsed time in simple way
  if (elapsedMs <= msPerAttendant.value) {
    return `${msToFormatted(elapsedMs, showMillis)}`;
  }
  // print planned + overtime
  return `${msToFormatted(msPerAttendant.value, false)} + ${msToFormatted(
    elapsedMs - msPerAttendant.value,
    showMillis
  )} overtime`;
});
</script>
