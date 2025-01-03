import { useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import PropTypes from "prop-types";
import { useTodo } from "./context/TodoContext";

export function TodoItem({ todo, index, moveTodo }) {
  const [isTodoEditable, setIsTodoEditable] = useState(false);
  const [todoMsg, setTodoMsg] = useState(todo.todo);
  const { updateTodo, toggleTodo, deleteTodo } = useTodo();
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: "todo",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "todo",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveTodo(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  drag(drop(ref)); // Combine drag and drop refs

  const editTodo = () => {
    updateTodo(todo.id, { ...todo, todo: todoMsg });
  };

  const toggleCompleted = () => {
    toggleTodo(todo.id);
  };

  const containerClasses = `flex items-center justify-between border border-black/10 rounded-lg px-3 py-1.5 shadow-sm shadow-white/50 duration-300 text-black ${
    todo.completed ? "bg-[#c6e9a7]" : "bg-[#ccbed7]"
  }`;

  return (
    <div
      ref={ref}
      className={containerClasses}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {/* Left side: Content */}
      <div className="flex items-center gap-x-3">
        <input
          type="checkbox"
          className="cursor-pointer"
          checked={todo.completed}
          onChange={toggleCompleted}
        />
        {isTodoEditable ? (
          <input
            type="text"
            className="border outline-none w-full bg-transparent rounded-lg border-black/10 px-2"
            value={todoMsg}
            onChange={(e) => setTodoMsg(e.target.value)}
            readOnly={!isTodoEditable}
          />
        ) : (
          <p className={`${todo.completed ? "line-through" : ""}`}>
            {todo.todo}
          </p>
        )}
      </div>

      {/* Right side: Buttons */}
      <div className="flex gap-x-2">
        {/* Edit, Save Button */}
        <button
          className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50"
          onClick={() => {
            if (todo.completed) return;
            if (isTodoEditable) {
              editTodo(); // Save changes when exiting edit mode
            } else {
              setTodoMsg(todo.todo); // Reset to original if toggling off without saving
            }
            setIsTodoEditable((prev) => !prev); // Toggle edit mode
          }}
          disabled={todo.completed}
        >
          {isTodoEditable ? "📁" : "✏️"}
        </button>

        {/* Delete Todo Button */}
        <button
          className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0"
          onClick={() => deleteTodo(todo.id)}
        >
          ❌
        </button>
      </div>
    </div>
  );
}

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    todo: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  moveTodo: PropTypes.func.isRequired,
};
