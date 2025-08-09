export const getCompletedCount = (todoList) => {
  return todoList.filter((item) => item.isChecked).length;
};

export const toggleChecked = (todoList, index) => {
  const updatedList = [...todoList];
  updatedList[index] = {
    ...updatedList[index],
    isChecked: !updatedList[index].isChecked,
  };
  return updatedList;
};

export const moveTaskUp = (todoList, index) => {
  if (index === 0) return todoList;
  const updatedList = [...todoList];
  [updatedList[index], updatedList[index - 1]] = [
    updatedList[index - 1],
    updatedList[index],
  ];
  return updatedList;
};

export const moveTaskDown = (todoList, index) => {
  if (index === todoList.length - 1) return todoList;
  const updatedList = [...todoList];
  [updatedList[index], updatedList[index + 1]] = [
    updatedList[index + 1],
    updatedList[index],
  ];
  return updatedList;
};

export function handleEditTask(todoList, index) {
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
