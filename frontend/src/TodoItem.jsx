import React from "react";
import { useDispatch } from "react-redux";
import { updateTitle } from "./store/todosSlice";

const TodoItem = ({
  todo,
  handleSaveEdit,
  handleEdit,
  handleUpdateTodo,
  handleDeleteTodo,
}) => {
  const dispatch = useDispatch();

  return (
    <li className="list__item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={(e) =>
          handleUpdateTodo(todo.id, todo.title, e.target.checked)
        }
      />
      {todo.isEditing ? (
        <>
          <input
            type="text"
            value={todo.title}
            onChange={(e) =>
              dispatch(updateTitle({ id: todo.id, title: e.target.value }))
            }
          />
          <button onClick={() => handleSaveEdit(todo.id)}>Save</button>
        </>
      ) : (
        <>
          <span
            style={{ textDecoration: todo.completed ? "line-through" : "none" }}
          >
            {todo.title}
          </span>
          <button onClick={() => handleEdit(todo.id)}>Edit</button>
        </>
      )}
      <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
    </li>
  );
};

export default TodoItem;
