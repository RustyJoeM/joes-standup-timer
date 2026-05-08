import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { MeetingTemplate } from 'src/components/TemplateModel';
import { useMeetingStore } from './meetingStore';
import { notifyMessage } from 'src/components/NotifyHelper';

export const useTemplateStore = defineStore('templates', () => {
  const meetingStore = useMeetingStore();

  const templates = useLocalStorage<MeetingTemplate[]>('joes-standup-timer', []);

  const _templateFromCurrent = (presetLabel?: string): MeetingTemplate => {
    const msPerAttendant = meetingStore.msPerAttendant;

    const spoken = meetingStore.spokenAttendants.map((att) => att.name);
    const waiting = meetingStore.waitingAttendants.map((att) => att.name);
    const absent = meetingStore.absentAttendants.map((att) => att.name);

    const secs = Math.floor(msPerAttendant / 1000);
    const label = presetLabel
      ? presetLabel
      : `${secs} secs with ${spoken.length + waiting.length + absent.length} attendants`;

    return {
      label,
      names: { waiting: waiting.concat(spoken), absent },
      msPerAttendant,
    };
  };

  const pushCurrent = () => {
    const template = _templateFromCurrent();
    templates.value.push(template);
    notifyMessage('info', `Current setup saved as ${template.label}`);
  };

  const saveCurrent = (index: number) => {
    if (index < 0 || index >= templates.value.length) {
      notifyMessage('warning', 'Invalid template index');
      return;
    }
    const label = templates.value[index].label;
    const template = _templateFromCurrent(label);
    templates.value[index] = template;
    notifyMessage('info', `Current setup saved to ${template.label}`);
  };

  const removeTemplate = (index: number) => {
    if (index < 0 || index >= templates.value.length) return;
    templates.value.splice(index, 1);
    notifyMessage('info', 'Template removed');
  };

  const editLabel = (index: number, label: string) => {
    if (index < 0 || index >= templates.value.length) return;
    templates.value[index].label = label;
  };

  return { templates, pushCurrent, saveCurrent, removeTemplate, editLabel };
});
