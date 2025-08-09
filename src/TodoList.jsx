import { useState, useEffect, useRef } from "react";
import {
  handleEditTask,
  getCompletedCount,
  moveTaskDown,
  moveTaskUp,
  toggleChecked,
} from "./utils/listHandlers";

function TodoList() {
  const emptyAddTimeoutId = useRef(null);
  const topText = useRef(null);
  const [currentInput, setCurrentInput] = useState("");
  const [todoList, setTodoList] = useState(() => {
    const savedList = localStorage.getItem("todoList");
    return savedList ? JSON.parse(savedList) : [];
  });

  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(todoList));
  }, [todoList]);

  function handleDisplayInput(event) {
    setCurrentInput(event.target.value);
  }

  function applyCheck(index) {
    setTodoList(toggleChecked(todoList, index));
  }

  function handleEnterKeyInput(e) {
    if (e.key === "Enter") handleAddTask();
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

      topText.current.innerHTML = `
        <span class="empty-input-message">
          The input is Empty! Please add a todo.
        </span>
      `;

      emptyAddTimeoutId.current = setTimeout(() => {
        topText.current.innerHTML = `${getCompletedCount(todoList)} / ${todoList.length} Completed`;
      }, 1500);
    }
  }

  function applyMoveUp(index) {
    setTodoList(moveTaskUp(todoList, index));
  }

  function applyMoveDown(index) {
    setTodoList(moveTaskDown(todoList, index));
  }

  function handleEditValueChange(index, event) {
    const updatedList = [...todoList];
    updatedList[index].editValue = event.target.value;
    setTodoList(updatedList);
  }

  function toggleIsEditing(index) {
    const updatedList = todoList.map((item, i) => {
      if (index === i) {
        return {
          ...item,
          isEditing: !todoList[index].isEditing,
          editValue: item.text,
        };
      }

      return item;
    });

    setTodoList(updatedList);
  }

  function applyEditToTask(index) {
    setTodoList(handleEditTask(todoList, index));
  }

  function handleCancelEditedTask(index) {
    const updatedList = todoList.map((item, i) => {
      if (index === i) {
        return {
          ...item,
          isEditing: false,
          editValue: "",
        };
      }

      return item;
    });

    setTodoList(updatedList);
  }

  function handleEditKeydown(index, event) {
    if (event.key === "Enter") applyEditToTask(index);
    else if (event.key === "Escape") handleCancelEditedTask(index);
  }

  function handleDeleteTask(index) {
    setTodoList((t) =>
      t.filter((_, i) => {
        return i !== index;
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
              todoList.map((item, index) => (
                <div key={index} className="todo-item">
                  <div className="todo-text-and-checkbox">
                    <input
                      type="checkbox"
                      className="todo-checkbox"
                      checked={item.isChecked}
                      onChange={() => {
                        applyCheck(index);
                      }}
                    />
                    {!item.isEditing ? (
                      <p
                        className={`todo-text ${item.isChecked ? "completed-todo-text" : ""}`}
                        onDoubleClick={() => {
                          toggleIsEditing(index);
                        }}
                      >
                        {item.text}
                      </p>
                    ) : (
                      <input
                        type="text"
                        className="todo-editing-input"
                        value={item.editValue}
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
                        type="svg"
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
