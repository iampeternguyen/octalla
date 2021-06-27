import { reactive, computed } from 'vue';

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

const state = computed(() => uiState);

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
};
export default uiStore;
