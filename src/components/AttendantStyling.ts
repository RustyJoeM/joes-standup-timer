import { computed } from 'vue';
import { useQuasar } from 'quasar';

export function useAttendantStyling() {
  const $q = useQuasar();

  const CHIP_COLOR = computed(() => ($q.dark.isActive ? 'grey-6' : 'blue-grey-3'));
  const TEXT_COLOR = 'black';

  return { CHIP_COLOR, TEXT_COLOR };
}
