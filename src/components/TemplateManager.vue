<template>
  <q-btn dense icon="meeting_room" label="Meeting templates">
    <q-menu dense>
      <q-item clickable @click="currentToTemplate" class="row items-center">
        <q-item-section> Save new template </q-item-section>
        <q-item-section side>
          <q-icon name="question_mark" size="xs">
            <q-tooltip>into browser's local storage</q-tooltip>
          </q-icon>
        </q-item-section>
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
import { useLocalStorage } from '@vueuse/core';

import { useMeetingStore } from 'stores/meetingStore';
import { MeetingTemplate } from './TemplateModel';
import TemplateView from './TemplateView.vue';
import { notifyMessage } from './NotifyHelper';

const { addAttendant, resetMeeting } = useMeetingStore();
const { attendants, msPerAttendant } = storeToRefs(useMeetingStore());

const TEMPLATES_KEY = 'joes-standup-meeting';
const meetingTemplates = useLocalStorage<MeetingTemplate[]>(TEMPLATES_KEY, []);

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
  notifyMessage('info', 'Saved current setup to new template');
};

const setupTemplate = (template: MeetingTemplate) => {
  msPerAttendant.value = template.msPerAttendant;
  resetMeeting();
  template.names.forEach((name) => addAttendant(name));
  notifyMessage('info', `Setup meeting from template \"${template.label}\"`);
};

const editLabel = (template: MeetingTemplate, val: string) => {
  template.label = val;
};

const removeTemplate = (index: number) => {
  meetingTemplates.value.splice(index, 1);
};
</script>
