import { type Task } from "./types.js";

export function getCompletedCount(todoList: Task[]) {
  return todoList.filter((item) => item.isChecked).length;
}

export const toggleChecked = (todoList: Task[], index: number) => {
  if (index < 0 || index >= todoList.length) return todoList;
  const updatedList: Task[] = [...todoList];
  const currentTask = updatedList[index];
  if (currentTask) {
    updatedList[index] = {
      ...currentTask,
      isChecked: !currentTask.isChecked,
    };
  }
  return updatedList;
};

export const moveTaskUp = (todoList: Task[], index: number) => {
  if (index <= 0 || index >= todoList.length) return todoList;
  const updatedList = [...todoList];
  const currentTask = updatedList[index];
  const previousTask = updatedList[index - 1];
  if (currentTask && previousTask) {
    updatedList[index] = previousTask;
    updatedList[index - 1] = currentTask;
  }
  return updatedList;
};

export const moveTaskDown = (todoList: Task[], index: number) => {
  if (index < 0 || index >= todoList.length - 1) return todoList;
  const updatedList = [...todoList];
  const currentTask = updatedList[index];
  const nextTask = updatedList[index + 1];
  if (currentTask && nextTask) {
    updatedList[index] = nextTask;
    updatedList[index + 1] = currentTask;
  }
  return updatedList;
};

export function handleEditTask(todoList: Task[], index: number) {
  const updatedList = todoList.map((item, i) => {
    if (index === i) {
      return {
        ...item,
        text: item.editValue,
        isEditing: false,
      };
    }

    return item;
  });

  return updatedList;
}
