import { reactive, computed } from 'vue';

const uiState = reactive({
  showNewProjectModal: false,
});

const state = computed(() => uiState);

function toggleShowNewProjectModal() {
  uiState.showNewProjectModal = !uiState.showNewProjectModal;
}

const uiStore = {
  state,
  toggleShowNewProjectModal,
};
export default uiStore;
