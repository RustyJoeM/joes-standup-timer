export interface Attendant {
  name: string;
  timeLeft: number;
  isFinished: boolean;
}

export function newAttendant(name: string, timeLeft: number): Attendant {
  return { name, timeLeft, isFinished: false };
}
