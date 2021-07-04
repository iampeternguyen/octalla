import Task, { TaskData } from 'src/models/Task';
import AppRepository from 'src/repository/AppRepository';

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

async function updateTask(task: TaskData) {
  await AppRepository.task.saveTask(task);
}

async function deleteTask(task: TaskData) {
  await AppRepository.task.deleteTask(task);
}

async function changeStatus(taskData: TaskData, status: string) {
  const task = Task.deserialize(taskData);
  task.changeStatus(status);
  await AppRepository.task.saveTask(task.serialize());
}

async function toggleComplete(taskData: TaskData) {
  const task = Task.deserialize(taskData);
  task.toggleComplete();
  await AppRepository.task.saveTask(task.serialize());
}

async function toggleStatus(taskData: TaskData) {
  const task = Task.deserialize(taskData);
  task.toggleStatus();
  await AppRepository.task.saveTask(task.serialize());
}

const TaskViewModel = {
  updateTask,
  deleteTask,
  toggleComplete,
  toggleStatus,
  changeStatus,
  statuses,
};

export default TaskViewModel;
