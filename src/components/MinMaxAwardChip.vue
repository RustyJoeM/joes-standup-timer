<template>
  <span class="row items-center text-subtitle1">
    <b>{{ matchingNames?.join(' & ') }}</b> &nbsp; get{{
      matchingNames && matchingNames.length > 1 ? '' : 's'
    }}
    the &nbsp;
    <transition
      :appear="props.delayAnimMs == undefined"
      mode="out-in"
      enter-active-class="animated rubberBand slower"
    >
      <q-chip clickable color="amber" :key="counter" @click="counter++">
        <slot name="rivet"></slot> &nbsp; {{ randomizedTitle }} &nbsp; <slot name="rivet"></slot>
      </q-chip>
    </transition>
    &nbsp; award for {{ props.reason }}!
  </span>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { MeetingAttendant } from './AttendantModel';

const props = defineProps<{
  attendants: MeetingAttendant[];
  titlePool: string[];
  reason: string;
  mode: 'min' | 'max';
  delayAnimMs?: number;
}>();

const counter = ref(0);

const randomizedTitle = ref('');

const matchingNames = computed(() => {
  const arr = props.attendants;
  if (!arr || arr.length < 1) return undefined;

  let people: string[] = [];

  let record = arr[0].msElapsed;

  for (const { name, msElapsed } of arr) {
    const cmp = props.mode == 'min' ? msElapsed < record : msElapsed > record;
    if (cmp) {
      people = [name];
    } else if (msElapsed == record) {
      people.push(name);
    }
  }

  return people;
});

onMounted(() => {
  randomizedTitle.value =
    props.titlePool[(Math.random() * props.titlePool.length) | 0].toUpperCase();

  if (props.delayAnimMs) {
    setTimeout(() => {
      counter.value++;
    }, props.delayAnimMs);
  }
});
</script>
