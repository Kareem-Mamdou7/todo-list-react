import { useState, useEffect } from "react";

function TodoList() {
  const [todoList, setTodoList] = useState(() => {
    const savedList = localStorage.getItem("todoList");
    return savedList ? JSON.parse(savedList) : [];
  });
  const [currentInput, setCurrentInput] = useState("");

  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(todoList));
  }, [todoList]);

  function handleDisplayInput(event) {
    setCurrentInput(event.target.value);
  }

  function handleAddTask() {
    if (currentInput) {
      setTodoList([...todoList, { text: currentInput, isChecked: false }]);
      setCurrentInput("");
    }
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

  return (
    <>
      <div className="todo-list-container">
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
            ADD
          </button>
        </div>

        <div className="todo-list">
          {todoList.length === 0 ? (
            <span className="empty-todo-text">Todo list is empty...</span>
          ) : (
            todoList.map((item, index) => (
              <div key={index} className="todo-content">
                <p
                  className={`todo-text ${item.isChecked ? "completed-todo-text" : ""}`}
                >
                  - {item.text}
                </p>
                <button
                  className="move-todo-up-button"
                  onClick={() => {
                    moveTaskUp(index);
                  }}
                >
                  <img
                    src="up-arrow-svgrepo-com.svg"
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
                    src="/down-arrow-svgrepo-com.svg"
                    alt="DOWN"
                    className="move-arrow-image"
                  />
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
