<template>
  <section class="row items-center">
    <span>{{ template.label }}</span>
    <q-badge outline color="grey" class="q-ml-md" @click.stop>
      <q-icon name="edit" size="xs">
        <q-tooltip :delay="500">Edit label</q-tooltip>
        <q-popup-edit v-model="templateLabel" auto-save v-slot="scope">
          <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
        </q-popup-edit>
      </q-icon>
    </q-badge>
    <q-badge outline color="grey" class="q-ml-sm" @click.stop>
      <q-icon name="close" size="xs" @click="emit('remove-template')">
        <q-tooltip :delay="500">Remove this template</q-tooltip>
      </q-icon>
    </q-badge>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MeetingTemplate } from './TemplateModel';

const props = defineProps<{
  template: MeetingTemplate;
}>();

const emit = defineEmits<{
  (e: 'edit-label', val: string): void;
  (e: 'remove-template'): void;
}>();

const templateLabel = computed({
  get: () => props.template.label,
  set: (val: string) => {
    emit('edit-label', val);
  },
});
</script>
