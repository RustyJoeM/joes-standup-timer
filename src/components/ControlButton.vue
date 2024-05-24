<template>
  <q-btn no-caps no-wrap size="lg">
    <section class="row no-wrap items-center justify-center">
      <q-icon :name="icon" class="col-2" size="sm"></q-icon>
      <span v-if="label" class="q-ml-md col row justify-start">{{ label }}</span>
    </section>
    <slot />
  </q-btn>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  label?: string;
}>();
</script>
