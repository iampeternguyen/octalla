import { TaskData } from 'src/models/Task';
import AppRepository from 'src/repository/AppRepository';

async function saveTask(task: TaskData) {
  await AppRepository.task.saveTask(task);
}

async function deleteTask(task: TaskData) {
  await AppRepository.task.deleteTask(task);
}

const TaskViewModel = {
  saveTask,
  deleteTask,
};

export default TaskViewModel;
