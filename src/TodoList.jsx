import { useState, useEffect, useRef } from "react";

function TodoList() {
  const emptyAddTimeoutId = useRef(null);
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

      const emptyAddAlert = document.querySelector(
        ".todo-completed-percentage",
      );

      emptyAddAlert.innerHTML = `
        <span class="empty-input-message">
          The input is Empty! Please add a todo.
        </span>
      `;

      emptyAddTimeoutId.current = setTimeout(() => {
        emptyAddAlert.innerHTML = `${calculateCompleted()} / ${todoList.length} Completed`;
      }, 1500);
    }
  }

  function handleEditValueChange(index, event) {
    const updatedList = [...todoList];
    updatedList[index].editValue = event.target.value;
    setTodoList(updatedList);
  }

  function handleEditTask(index) {
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

  function handleEditKeydown(index, event) {
    if (event.key === "Enter") handleSaveEditedTask(index);
    else if (event.key === "Escape") handleCancelEditedTask(index);
  }

  function handleSaveEditedTask(index) {
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

    setTodoList(updatedList);
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

  function handleDeleteTask(index) {
    setTodoList((t) =>
      t.filter((_, i) => {
        return i !== index;
      }),
    );
  }

  function moveTaskUp(index) {
    if (index === 0) return;
    const updatedList = [...todoList];

    [updatedList[index], updatedList[index - 1]] = [
      updatedList[index - 1],
      updatedList[index],
    ];

    setTodoList(updatedList);
  }

  function moveTaskDown(index) {
    if (index === todoList.length - 1) return;
    const updatedList = [...todoList];

    [updatedList[index], updatedList[index + 1]] = [
      updatedList[index + 1],
      updatedList[index],
    ];

    setTodoList(updatedList);
  }

  function toggleChecked(index) {
    const updatedList = [...todoList];
    updatedList[index] = {
      ...updatedList[index],
      isChecked: !updatedList[index].isChecked,
    };

    setTodoList(updatedList);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleAddTask();
  }

  function calculateCompleted() {
    let completed = 0;

    todoList.map((item) => {
      if (item.isChecked) completed++;
    });

    return completed;
  }

  return (
    <>
      <div className="todo-list-container">
        <p className="todo-completed-percentage">
          {calculateCompleted() !== todoList.length ? (
            `${calculateCompleted()} / ${todoList.length} Completed`
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
            onKeyDown={handleKeyDown}
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
              <div key={index} className="todo-content">
                {!item.isEditing ? (
                  <p
                    className={`todo-text ${item.isChecked ? "completed-todo-text" : ""}`}
                    onDoubleClick={() => {
                      handleEditTask(index);
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

                <button
                  className="move-todo-up-button"
                  onClick={() => {
                    moveTaskUp(index);
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
                    moveTaskDown(index);
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
                    handleEditTask(index);
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

                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={item.isChecked}
                  onChange={() => {
                    toggleChecked(index);
                  }}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default TodoList;
