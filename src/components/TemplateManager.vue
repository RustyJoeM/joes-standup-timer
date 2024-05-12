<template>
  <q-btn dense flat icon="meeting_room" label="Meeting templates">
    <q-menu dense>
      <q-item clickable @click="currentToTemplate" class="row items-center">
        Save new template
      </q-item>
      <q-item clickable v-if="meetingTemplates.length > 0">
        <q-item-section>Setup from template</q-item-section>
        <q-item-section side>
          <q-icon name="keyboard_arrow_right" />
        </q-item-section>

        <q-menu dense anchor="top end" self="top start">
          <q-item
            v-for="(t, index) in meetingTemplates"
            :key="index"
            clickable
            v-close-popup
            @click="setupTemplate(t)"
          >
            <template-view
              :template="t"
              @edit-label="editLabel(t, $event)"
              @remove-template="removeTemplate(index)"
            ></template-view>
          </q-item>
        </q-menu>
      </q-item>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMeetingStore } from 'stores/meetingStore';
import { MeetingTemplate } from './TemplateModel';
import TemplateView from './TemplateView.vue';
import { newAttendant } from './AttendantModel';
import { Notify } from 'quasar';

const { attendants, msPerAttendant, meetingTemplates } = storeToRefs(useMeetingStore());

const currentToTemplate = () => {
  const names = attendants.value.map((att) => att.name);
  const withStr = names.length > 0 ? names.join(', ') : 'nobody';
  const label = `${Math.floor(msPerAttendant.value / 1000)} secs with ${withStr}`;
  const newTemplate: MeetingTemplate = {
    label,
    msPerAttendant: msPerAttendant.value,
    names,
  };
  meetingTemplates.value.push(newTemplate);
  Notify.create({ type: 'info', message: 'Saved current setup to new template' });
};

const setupTemplate = (template: MeetingTemplate) => {
  msPerAttendant.value = template.msPerAttendant;
  attendants.value = template.names.map((name) => newAttendant(name));
  Notify.create({ type: 'info', message: `Setup meeting from template \"${template.label}\"` });
};

const editLabel = (template: MeetingTemplate, val: string) => {
  template.label = val;
};

const removeTemplate = (index: number) => {
  meetingTemplates.value.splice(index, 1);
};
</script>
