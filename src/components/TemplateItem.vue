<template>
  <q-item v-close-popup clickable>
    <q-item-section class="row items-center">
      <div class="text-subtitle1">{{ props.label }}</div>
    </q-item-section>

    <q-item-section side>
      <q-btn dense flat icon="more_horiz" @click.stop>
        <q-menu ref="menuRef" dense anchor="center right" self="center left">
          <q-list>
            <q-item v-close-popup dense class="row items-center">
              <q-btn outline dense icon="edit" size="md" @click.stop>
                <q-tooltip>Edit label</q-tooltip>
                <q-popup-edit v-slot="scope" v-model="templateLabel" auto-save>
                  <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                </q-popup-edit>
              </q-btn>

              <q-btn outline dense icon="save" size="md" class="q-ml-sm" @click.stop="saveCurrent(index)">
                <q-tooltip>Save current setup here</q-tooltip>
              </q-btn>

              <q-btn outline dense icon="delete" size="md" class="q-ml-sm" @click.stop="removeTemplate(index)">
                <q-tooltip>Remove this template</q-tooltip>
              </q-btn>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-item-section>
  </q-item>

  <!-- <section class="row items-center justify-between">
    <span>{{ props.label }}</span>
    <div class="q-ml-md row">
      <q-badge outline color="grey" @click.stop>
        <q-icon name="edit" size="xs">
          <q-tooltip :delay="500">Edit label</q-tooltip>
          <q-popup-edit v-slot="scope" v-model="templateLabel" auto-save>
            <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
          </q-popup-edit>
        </q-icon>
      </q-badge>
      <q-badge outline color="grey" class="q-ml-sm" @click.stop>
        <q-icon name="close" size="xs" @click="removeTemplate(props.index)">
          <q-tooltip :delay="500">Remove this template</q-tooltip>
        </q-icon>
      </q-badge>
    </div>
  </section> -->
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { useTemplateStore } from 'src/stores/TemplateStore';
import { QMenu } from 'quasar';

const { saveCurrent, removeTemplate, editLabel } = useTemplateStore();

const menuRef = useTemplateRef<QMenu>('menuRef');

const props = defineProps<{
  index: number;
  label: string;
}>();

const templateLabel = computed({
  get: () => props.label,
  set: (val: string) => {
    editLabel(props.index, val);
    menuRef.value?.hide();
  },
});
</script>
