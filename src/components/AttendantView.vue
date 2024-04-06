<template>
  <q-chip
    outline
    square
    size="lg"
    removable
    icon-remove="close"
    @remove="emit('remove')"
    :label="props.attendant.name"
  ></q-chip>
</template>

<script setup lang="ts">
import { Attendant } from './AttendantModel';

const props = defineProps<{
  attendant: Attendant;
}>();

const emit = defineEmits(['remove']);
</script>
