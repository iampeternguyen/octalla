import { TaskData } from 'src/models/Task';
import AppRepository from 'src/repository/AppRepository';
import { computed } from 'vue';

export enum TASK_STATUS {
  OPEN = 'Open',
  IN_PROGRESS = 'In-Progress',
  REVIEW = 'Review',
  COMPLETE = 'Compelte',
}

const statuses = [
  TASK_STATUS.OPEN,
  TASK_STATUS.IN_PROGRESS,
  TASK_STATUS.REVIEW,
  TASK_STATUS.COMPLETE,
];

async function saveTask(task: TaskData) {
  await AppRepository.task.saveTask(task);
}

async function deleteTask(task: TaskData) {
  await AppRepository.task.deleteTask(task);
}

async function changeStatus(task: TaskData, status: string) {
  task.status = status;
  status == TASK_STATUS.COMPLETE
    ? (task.isComplete = true)
    : (task.isComplete = false);

  await AppRepository.task.saveTask(task);
}

async function toggleComplete(task: TaskData) {
  task.isComplete = !task.isComplete;
  if (task.isComplete) {
    task.status = TASK_STATUS.COMPLETE;
  } else if (task.status == TASK_STATUS.COMPLETE) {
    task.status = TASK_STATUS.OPEN;
  }

  await AppRepository.task.saveTask(task);
}

async function toggleStatus(task: TaskData) {
  switch (task.status) {
    case TASK_STATUS.OPEN:
      task.status = TASK_STATUS.IN_PROGRESS;
      break;
    case TASK_STATUS.IN_PROGRESS:
      task.status = TASK_STATUS.REVIEW;
      break;
    case TASK_STATUS.REVIEW:
      task.status = TASK_STATUS.COMPLETE;
      break;
    case TASK_STATUS.COMPLETE:
      task.status = TASK_STATUS.OPEN;
      break;
    default:
      break;
  }

  task.status == TASK_STATUS.COMPLETE
    ? (task.isComplete = true)
    : (task.isComplete = false);
  await AppRepository.task.saveTask(task);
}

const TaskViewModel = {
  saveTask,
  deleteTask,
  toggleComplete,
  toggleStatus,
  changeStatus,
  statuses,
};

export default TaskViewModel;
