import { defineStore } from 'pinia';
import { MIN_TALK_TIME_MS, AttendantId, Attendant, newAttendant } from 'src/components/AttendantModel';
import { notifyMessage } from 'src/components/NotifyHelper';
import { MeetingTemplate } from 'src/components/TemplateModel';

const TICK_INTERVAL_MS = 100;

export const useMeetingStore = defineStore('meeting', {
  state: () => ({
    tickSize: TICK_INTERVAL_MS,
    msPerAttendant: MIN_TALK_TIME_MS,
    displayMillis: false,
    runningMysteryMode: false,

    spokenAttendants: [] as Attendant[],
    waitingAttendants: [] as Attendant[],

    activeAttendantId: undefined as AttendantId | undefined,
    nextAttendantId: undefined as AttendantId | undefined,
    tickerId: undefined as NodeJS.Timeout | undefined,

    meetingTemplates: [] as MeetingTemplate[],
  }),

  getters: {
    activeAttendant: (state): Attendant | undefined => {
      if (!state.activeAttendantId) return undefined;
      return state.spokenAttendants.find((att) => att._uid == state.activeAttendantId);
    },

    nextAttendant: (state): Attendant | undefined => {
      if (!state.nextAttendantId) return undefined;
      return state.waitingAttendants.find((att) => att._uid == state.nextAttendantId);
    },
  },

  actions: {
    addAttendant(name: string) {
      this.waitingAttendants.push(newAttendant(name));
      this.updateNextAttendant();
    },

    shuffleAttendants() {
      const array = this.waitingAttendants;
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    },

    resetMeeting() {
      if (this.tickerId != undefined) {
        clearInterval(this.tickerId);
        this.tickerId = undefined;
      }
      this.spokenAttendants = [];
      this.waitingAttendants = [];
      this.activeAttendantId = undefined;
      this.nextAttendantId = undefined;
    },

    resetTimes() {
      if (this.tickerId != undefined) {
        clearInterval(this.tickerId);
        this.tickerId = undefined;
      }
      this.activeAttendantId = undefined;
      this.waitingAttendants = this.waitingAttendants.concat(...this.spokenAttendants);
      this.spokenAttendants = [];
      for (const att of this.waitingAttendants) {
        att.msElapsed = 0;
        att.hasFinished = false;
      }
      this.updateNextAttendant();
      notifyMessage('info', 'Spoken times reset!');
    },

    renameAttendant(uid: string, name: string) {
      let att = this.waitingAttendants.find((att) => att._uid == uid);
      if (att) {
        att.name = name;
        return;
      }
      att = this.spokenAttendants.find((att) => att._uid == uid);
      if (!att) throw "Couldn't find attendant to rename!";
      att.name = name;
    },

    removeAttendant(uid: string) {
      if (uid == this.activeAttendantId) {
        notifyMessage('warning', "Won't delete current talker...");
        return;
      }
      const index = this.waitingAttendants.findIndex((att) => att._uid == uid);
      if (index != -1) {
        this.waitingAttendants.splice(index, 1);
      } else {
        const index = this.spokenAttendants.findIndex((att) => att._uid == uid);
        if (index != -1) {
          this.spokenAttendants.splice(index, 1);
        }
      }
      this.updateNextAttendant();
    },

    updateNextAttendant() {
      if (this.tickerId) return; // do no change when time is running
      if (!this.tickerId && this.activeAttendantId) return; // paused talker

      if (!this.runningMysteryMode) {
        const attendant = this.waitingAttendants[0] ?? undefined;
        this.nextAttendantId = attendant ? attendant?._uid : undefined;
        return;
      }

      if (this.waitingAttendants.length == 0) {
        this.nextAttendantId = undefined;
        return;
      }
      const randomIndex = (Math.random() * this.waitingAttendants.length) | 0;
      this.nextAttendantId = this.waitingAttendants[randomIndex]._uid;
    },
  },
});
