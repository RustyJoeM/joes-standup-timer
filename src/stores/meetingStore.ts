import { defineStore } from 'pinia';
import { MIN_TALK_TIME_MS, MeetingAttendant, newAttendant } from 'src/components/AttendantModel';

export const useMeetingStore = defineStore('meeting', {
  state: () => ({
    msPerAttendant: MIN_TALK_TIME_MS,
    attendants: [] as MeetingAttendant[],
    activeAttendantIndex: -1,
  }),

  getters: {
    activeAttendant: (state): MeetingAttendant | undefined => {
      if (state.activeAttendantIndex < 0) return undefined;
      if (state.attendants.length <= state.activeAttendantIndex) return undefined;
      return state.attendants[state.activeAttendantIndex];
    },

    nextAttendantIndex: (state): number => {
      return state.attendants.findIndex(
        (att, index) => !att.hasFinished && index != state.activeAttendantIndex
      );
    },

    nextAttendant: (state): MeetingAttendant | undefined => {
      return state.attendants.find(
        (att, index) => !att.hasFinished && index != state.activeAttendantIndex
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
