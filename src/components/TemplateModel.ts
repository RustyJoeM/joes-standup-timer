export interface MeetingNames {
  waiting: string[];
  absent: string[];
}

export interface MeetingTemplate {
  label: string;
  names: MeetingNames;
  msPerAttendant: number;
}
