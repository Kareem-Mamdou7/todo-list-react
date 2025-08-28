import { useState, useEffect, useRef } from "react";
import { type Task } from "./utils/types.js";
import {
  handleEditTask,
  getCompletedCount,
  moveTaskDown,
  moveTaskUp,
  toggleChecked,
} from "./utils/listHandlers.js";

function TodoList() {
  const emptyAddTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const topText = useRef<HTMLParagraphElement>(null);
  const [currentInput, setCurrentInput] = useState("");
  const [todoList, setTodoList] = useState(() => {
    const savedList = localStorage.getItem("todoList");
    return savedList ? JSON.parse(savedList) : [];
  });

  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(todoList));
  }, [todoList]);

  function handleDisplayInput(event: React.ChangeEvent<HTMLInputElement>) {
    setCurrentInput(event.target.value);
  }

  function applyCheck(taskIndex: number) {
    setTodoList(toggleChecked(todoList, taskIndex));
  }

  function handleEnterKeyInput(event: React.KeyboardEvent) {
    if (event.key === "Enter") handleAddTask();
  }

  function handleAddTask() {
    if (currentInput) {
      setTodoList([
        ...todoList,
        {
          text: currentInput,
          isChecked: false,
          isEditing: false,
          editValue: "",
        },
      ]);

      setCurrentInput("");
    } else {
      if (emptyAddTimeoutId.current) clearTimeout(emptyAddTimeoutId.current);

      if (topText.current) {
        topText.current.innerHTML = `
          <span class="empty-input-message">
            The input is Empty! Please add a todo.
          </span>
        `;
      }

      emptyAddTimeoutId.current = setTimeout(() => {
        if (topText.current)
          topText.current.innerHTML = `${getCompletedCount(todoList)} / ${todoList.length} Completed`;
      }, 1500);
    }
  }

  function applyMoveUp(taskIndex: number) {
    setTodoList(moveTaskUp(todoList, taskIndex));
  }

  function applyMoveDown(taskIndex: number) {
    setTodoList(moveTaskDown(todoList, taskIndex));
  }

  function handleEditValueChange(
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const updatedList = [...todoList];
    updatedList[index].editValue = event.target.value;
    setTodoList(updatedList);
  }

  function toggleIsEditing(taskIndex: number) {
    const updatedList = todoList.map((task: Task, editedTaskIndex: number) => {
      if (taskIndex === editedTaskIndex) {
        return {
          ...task,
          isEditing: !todoList[taskIndex].isEditing,
          editValue: task.text,
        };
      }

      return task;
    });

    setTodoList(updatedList);
  }

  function applyEditToTask(taskIndex: number) {
    setTodoList(handleEditTask(todoList, taskIndex));
  }

  function handleCancelEditedTask(taskIndex: number) {
    const updatedList = todoList.map((task: Task, editedTaskIndex: number) => {
      if (taskIndex === editedTaskIndex) {
        return {
          ...task,
          isEditing: false,
          editValue: "",
        };
      }

      return task;
    });

    setTodoList(updatedList);
  }

  function handleEditKeydown(taskIndex: number, event: React.KeyboardEvent) {
    if (event.key === "Enter") applyEditToTask(taskIndex);
    else if (event.key === "Escape") handleCancelEditedTask(taskIndex);
  }

  function handleDeleteTask(indexToDelete: number) {
    setTodoList((task: Task[]) =>
      task.filter((_, currentIndex: number) => {
        return currentIndex !== indexToDelete;
      }),
    );
  }

  return (
    <>
      <div className="container">
        <div className="todo-list-container">
          <p className="todo-completed-percentage" ref={topText}>
            {getCompletedCount(todoList) !== todoList.length ? (
              `${getCompletedCount(todoList)} / ${todoList.length} Completed`
            ) : (
              <span className="all-completed-text">
                All your tasks are completed!
              </span>
            )}
          </p>

          <div className="todo-list-top-part">
            <input
              type="text"
              className="todo-list-input"
              placeholder="Enter your todo..."
              value={currentInput}
              onChange={handleDisplayInput}
              onKeyDown={handleEnterKeyInput}
            />

            <button className="add-button" onClick={handleAddTask}>
              ADD{" "}
            </button>
          </div>

          <div className="todo-list">
            {todoList.length === 0 ? (
              <span className="empty-todo-text">Todo list is empty...</span>
            ) : (
              todoList.map((task: Task, index: number) => (
                <div key={index} className="todo-item">
                  <div className="todo-text-and-checkbox">
                    <input
                      type="checkbox"
                      className="todo-checkbox"
                      checked={task.isChecked}
                      onChange={() => {
                        applyCheck(index);
                      }}
                    />
                    {!task.isEditing ? (
                      <p
                        className={`todo-text ${task.isChecked ? "completed-todo-text" : ""}`}
                        onDoubleClick={() => {
                          toggleIsEditing(index);
                        }}
                      >
                        {task.text}
                      </p>
                    ) : (
                      <input
                        type="text"
                        className="todo-editing-input"
                        value={task.editValue}
                        autoFocus
                        onChange={(e) => {
                          handleEditValueChange(index, e);
                        }}
                        onKeyDown={(event) => {
                          handleEditKeydown(index, event);
                        }}
                      />
                    )}
                  </div>

                  <div className="todo-item-buttons">
                    {" "}
                    <button
                      className="move-todo-up-button"
                      onClick={() => {
                        applyMoveUp(index);
                      }}
                    >
                      <img
                        src="aliceblue-up.svg"
                        alt="UP"
                        className="move-arrow-image"
                      />
                    </button>
                    <button
                      className="move-todo-down-button"
                      onClick={() => {
                        applyMoveDown(index);
                      }}
                    >
                      <img
                        src="aliceblue-down.svg"
                        alt="DOWN"
                        className="move-arrow-image"
                      />
                    </button>
                    <button
                      className="edit-button"
                      onClick={() => {
                        toggleIsEditing(index);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => {
                        handleDeleteTask(index);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default TodoList;
