import { uid } from 'quasar';

export const MIN_TALK_TIME_MS = 60 * 1000;

export interface MeetingAttendant {
  _uid: string;
  name: string;
  msElapsed: number;
  hasFinished: boolean;
}

export function newAttendant(name: string): MeetingAttendant {
  return { _uid: uid(), name, msElapsed: 0, hasFinished: false };
}

export function msToFormatted(ms: number) {
  const secondsAbs = Math.abs(Math.floor(ms / 1000));
  const minutes = Math.floor(secondsAbs / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (secondsAbs % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}
