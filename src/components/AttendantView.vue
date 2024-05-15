<template>
  <q-linear-progress
    :value="progress"
    size="3rem"
    color="primary"
    :animation-speed="animSpeed"
    :stripe="isActive"
    rounded
    class="q-mt-sm"
  >
    <div :key="attendantIndex" class="absolute-full flex flex-center row">
      <div class="col-12 row items-center q-px-md">
        <section class="col row justify-start">
          <q-chip square :color="CHIP_COLOR">
            <span :class="`text-subtitle1 text-${TEXT_COLOR}`">{{ attendant.name }}</span>
            <q-popup-edit v-model="attendant.name" auto-save v-slot="scope">
              <q-input filled v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-chip>
        </section>
        <section class="col row justify-center">
          <q-chip
            v-if="attendant.hasFinished || isActive"
            :color="CHIP_COLOR"
            square
            size="md"
            :text-color="TEXT_COLOR"
            :label="formattedTimestamp"
          />
        </section>
        <section class="col row justify-end">
          <q-btn
            dense
            :color="CHIP_COLOR"
            icon="close"
            :text-color="TEXT_COLOR"
            size="sm"
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
import { useQuasar } from 'quasar';

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

  const showMillis = attendant.value.hasFinished || props.isActive ? displayMillis.value : false;
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

const $q = useQuasar();

const CHIP_COLOR = computed(() => ($q.dark.isActive ? 'grey-6' : 'blue-grey-3'));
const TEXT_COLOR = 'black';
</script>
