import { db } from 'src/firebase';
import { TaskData, TASKS_STORENAME } from 'src/models/Task';

const saveTask = async (task: TaskData) => {
  task.last_modified = Date.now();
  await db.collection(TASKS_STORENAME).doc(task.id).set(task);
  return task;
};

const deleteTask = async (task: TaskData) => {
  task.last_modified = Date.now();
  await db.collection(TASKS_STORENAME).doc(task.id).delete();
  return task;
};

const TaskRepository = { saveTask, deleteTask };

export default TaskRepository;
