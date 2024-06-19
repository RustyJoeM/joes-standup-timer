import { defineStore } from 'pinia';
import {
  MIN_TALK_TIME_MS,
  AttendantId,
  Attendant,
  newAttendant,
} from 'src/components/AttendantModel';
import { notifyMessage } from 'src/components/NotifyHelper';
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
    runningMysteryMode: false,
    nextAttendantId: undefined as AttendantId | undefined,
  }),

  getters: {
    activeAttendant: (state): Attendant | undefined => {
      if (!state.activeAttendantId) return undefined;
      return state.attendants.find((att) => att._uid == state.activeAttendantId);
    },

    nextAttendant: (state): Attendant | undefined => {
      if (!state.nextAttendantId) return undefined;
      return state.attendants.find((att) => att._uid == state.nextAttendantId);
    },
  },

  actions: {
    addAttendant(name: string) {
      this.attendants.push(newAttendant(name));
      this.updateNextAttendant();
    },

    shuffleAttendants() {
      const array = this.attendants;
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    },

    resetMeeting() {
      this.attendants = [];
      this.activeAttendantId = undefined;
      this.nextAttendantId = undefined;
    },

    resetTimes() {
      this.activeAttendantId = undefined;
      for (const att of this.attendants) {
        att.msElapsed = 0;
        att.hasFinished = false;
      }
      this.updateNextAttendant();
    },

    renameAttendant(uid: string, name: string) {
      const att = this.attendants.find((att) => att._uid == uid);
      if (!att) throw "Couldn't find attendant to rename!";
      att.name = name;
    },

    removeAttendant(uid: string) {
      if (uid == this.activeAttendantId) {
        notifyMessage('warning', "Won't delete current talker...");
        return;
      }
      const index = this.attendants.findIndex((att) => att._uid == uid);
      if (index != -1) {
        this.attendants.splice(index, 1);
      }
      this.updateNextAttendant();
    },

    updateNextAttendant() {
      if (!this.runningMysteryMode) {
        const attendant = this.attendants.find(
          (att) => !att.hasFinished && att._uid != this.activeAttendantId
        );
        this.nextAttendantId = attendant ? attendant?._uid : undefined;
        return;
      }

      const waitingAttendants: Attendant[] = this.attendants.filter((att) => att.msElapsed == 0);
      if (waitingAttendants.length == 0) {
        this.nextAttendantId = undefined;
        return;
      }
      const randomIndex = (Math.random() * waitingAttendants.length) | 0;
      this.nextAttendantId = waitingAttendants[randomIndex]._uid;
    },
  },
});
