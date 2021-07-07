<template>
  <q-menu
    ref="assigneeMenu"
    transition-show="jump-down"
    transition-hide="jump-up"
    class="q-pa-md column items-center bg-blue-grey-1"
  >
    <q-item-section>
      <!-- TODO what happens when this list is really long? -->
      <q-select
        @update:model-value="updateAssignee"
        v-model="user"
        outlined
        use-input
        hide-selected
        fill-input
        placeholder="Search"
        input-debounce="0"
        :options="options"
        @filter="filterFn"
      >
        <template v-slot:prepend>
          <q-icon name="eva-search-outline" />
        </template>
        <template v-if="user" v-slot:append>
          <q-icon
            name="cancel"
            @click.stop="clearAssignee"
            class="cursor-pointer"
          />
        </template>
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section avatar>
              <q-avatar color="teal" text-color="white">{{
                scope.opt.label[0]
              }}</q-avatar>
            </q-item-section>
            <q-item-section> {{ scope.opt.label }} </q-item-section>
          </q-item>
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-item-section>
  </q-menu>
</template>
<script lang="ts">
import { QMenu } from 'quasar';
import { TaskData } from 'src/models/Task';
import TaskViewModel from 'src/viewmodels/TaskViewModel';
import WorkspaceViewModel from 'src/viewmodels/WorkspaceViewModel';
import { defineComponent, PropType, ref } from 'vue';
export default defineComponent({
  name: 'AssignUserToTask',
  props: {
    task: {
      type: Object as PropType<TaskData>,
      required: true,
    },
  },
  setup(props) {
    const user = ref(props.task.fields.assigned_to?.display_name || null);
    const assigneeMenu = ref<QMenu | null>(null);
    const memberOptions = WorkspaceViewModel.properties.members.value.map(
      (member) => {
        return { label: member.display_name, value: member.id };
      }
    );

    const options = ref(memberOptions);

    function filterFn(
      val: string,
      update: (fn: () => void) => void,
      abort: (fn: () => void) => void
    ) {
      update(() => {
        const needle = val.toLowerCase();
        options.value = memberOptions.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    }

    async function updateAssignee(val: { label: string; value: string }) {
      console.log('assigned to', val.value);
      if (assigneeMenu.value) {
        const member = WorkspaceViewModel.properties.members.value.find(
          (m) => m.id == val.value
        );
        if (!member) return;
        assigneeMenu.value.hide();
        await TaskViewModel.assignUserToTask(member, props.task);
      }
    }

    async function clearAssignee() {
      user.value = null;
      await TaskViewModel.assignUserToTask(null, props.task);
    }

    return {
      user,
      options,
      filterFn,
      updateAssignee,
      assigneeMenu,
      clearAssignee,
    };
  },
});
</script>

<style lang="scss" scoped></style>
