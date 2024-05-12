import { defineStore } from 'pinia';
import {
  MIN_TALK_TIME_MS,
  AttendantId,
  Attendant,
  newAttendant,
} from 'src/components/AttendantModel';
import { MeetingTemplate } from 'src/components/TemplateModel';

const TICK_INTERVAL_MS = 100;

export const useMeetingStore = defineStore('meeting', {
  state: () => ({
    tickSize: TICK_INTERVAL_MS,
    msPerAttendant: MIN_TALK_TIME_MS,
    attendants: [] as Attendant[],
    activeAttendantId: undefined as AttendantId | undefined,
    displayMillis: false,
    meetingTemplates: [] as MeetingTemplate[],
  }),

  getters: {
    activeAttendant: (state): Attendant | undefined => {
      if (!state.activeAttendantId) return undefined;
      return state.attendants.find((att) => att._uid == state.activeAttendantId);
    },

    nextAttendant: (state): Attendant | undefined => {
      return state.attendants.find(
        (att) => !att.hasFinished && att._uid != state.activeAttendantId
      );
    },
  },

  actions: {
    addAttendant(name: string) {
      this.attendants.push(newAttendant(name));
    },

    shuffleAttendants() {
      const array = this.attendants;
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    },

    reset() {
      this.attendants = [];
    },
  },
});
