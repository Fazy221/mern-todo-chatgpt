import React from "react";
import TodoItem from "./TodoItem";

const TodoList = ({
  todos,
  handleSaveEdit,
  handleEdit,
  handleUpdateTodo,
  handleDeleteTodo,
}) => {
  return (
    <ul className="list_items_container">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleSaveEdit={handleSaveEdit}
          handleEdit={handleEdit}
          handleUpdateTodo={handleUpdateTodo}
          handleDeleteTodo={handleDeleteTodo}
        />
      ))}
    </ul>
  );
};

export default TodoList;
