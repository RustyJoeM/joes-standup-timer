import { Notify } from 'quasar';

export const notifyMessage = (type: string, message: string) => {
  Notify.create({ position: 'bottom-left', type, message });
};
