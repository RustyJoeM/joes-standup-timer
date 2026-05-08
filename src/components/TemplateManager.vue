<template>
  <q-btn dense icon="meeting_room" label="Meeting templates">
    <q-menu dense anchor="bottom left" self="top start">
      <q-list>
        <template-item
          v-for="(template, index) in templates"
          :key="index"
          :index="index"
          :label="template.label"
          @click="applyTemplate(template)"
        />

        <q-separator></q-separator>

        <q-item clickable @click="pushCurrent">
          <q-item-section side><q-icon name="save" size="sm" /></q-item-section>
          <q-item-section>Save current setup as new template</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useMeetingStore } from 'stores/meetingStore';
import { useTemplateStore } from 'src/stores/TemplateStore';
import TemplateItem from './TemplateItem.vue';

const templateStore = useTemplateStore();
const { templates } = storeToRefs(templateStore);
const { pushCurrent } = templateStore;

const { applyTemplate } = useMeetingStore();
</script>
