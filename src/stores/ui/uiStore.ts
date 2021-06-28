import { reactive, computed, ref } from 'vue';

import {
  Loading,

  // optional!, for example below
  // with custom spinner
  QSpinnerGears,
} from 'quasar';

const uiState = reactive({
  showNewProjectModal: false,
  loadingMessage: '',
});

const appLayoutLeftDrawerOpen = ref(true);
const appLayoutLeftDrawerMini = ref(false);

const state = computed(() => uiState);

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
  uiState.showNewProjectModal = !uiState.showNewProjectModal;
}

function showLoading() {
  // fully customizable
  Loading.show({
    spinner: QSpinnerGears,
    message: uiState.loadingMessage,

    customClass: 'bg-secondary',
    boxClass: 'bg-grey-2 text-secondary text-weight-bold',
    spinnerColor: 'secondary',

    // other props
  });
}

function hideLoading() {
  uiState.loadingMessage = '';
  Loading.hide();
}

function updateLoadingMessage(message: string) {
  uiState.loadingMessage = message;
}
const uiStore = {
  state,
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
export default uiStore;
