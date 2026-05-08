import { Notify } from 'quasar';

export const notifyMessage = (type: 'positive' | 'negative' | 'warning' | 'info', message: string) => {
  Notify.create({ position: 'bottom-left', type, message });
};
