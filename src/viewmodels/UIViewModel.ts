import { computed, ref } from 'vue';

import {
  Loading,

  // optional!, for example below
  // with custom spinner
  QSpinnerGears,
} from 'quasar';

const _showNewProjectModal = ref(false);
const _loadingMessage = ref('');

const appLayoutLeftDrawerOpen = ref(true);
const appLayoutLeftDrawerMini = ref(false);

const showNewProjectModal = computed(() => _showNewProjectModal.value);

// Workspace Left Drawer

function onToggleProjectLeftDrawer() {
  appLayoutLeftDrawerOpen.value = !appLayoutLeftDrawerOpen.value;
}

function onProjectLeftDrawerClicked(e: Event) {
  // if in "mini" state and user
  // click on drawer, we switch it to "normal" mode
  if (appLayoutLeftDrawerMini.value) {
    appLayoutLeftDrawerMini.value = false;

    // notice we have registered an event with capture flag;
    // we need to stop further propagation as this click is
    // intended for switching drawer to "normal" mode only
    e.stopPropagation();
  }
}

function collapseProjectLeftDrawer() {
  appLayoutLeftDrawerMini.value = true;
}

// Loading Modal
function toggleShowNewProjectModal() {
  _showNewProjectModal.value = !_showNewProjectModal.value;
}

function showLoading() {
  // fully customizable
  Loading.show({
    spinner: QSpinnerGears,
    message: _loadingMessage.value,

    customClass: 'bg-secondary',
    boxClass: 'bg-grey-2 text-secondary text-weight-bold',
    spinnerColor: 'secondary',

    // other props
  });
}

function hideLoading() {
  _loadingMessage.value = '';
  Loading.hide();
}

function updateLoadingMessage(message: string) {
  _loadingMessage.value = message;
}
const UIViewModel = {
  showNewProjectModal,
  toggleShowNewProjectModal,
  updateLoadingMessage,
  showLoading,
  hideLoading,
  appLeftDrawer: {
    open: appLayoutLeftDrawerOpen,
    mini: appLayoutLeftDrawerMini,
    onToggleProjectLeftDrawer,
    onProjectLeftDrawerClicked,
    collapseProjectLeftDrawer,
  },
};
export default UIViewModel;
