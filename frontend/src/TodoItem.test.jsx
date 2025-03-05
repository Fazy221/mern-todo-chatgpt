import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import TodoItem from "./TodoItem";

const mockStore = configureStore([]);

const renderWithProviders = (ui, { reduxState } = {}) => {
  const store = mockStore(reduxState);
  return render(<Provider store={store}>{ui}</Provider>);
};

test("renders TodoItem and toggles checkbox", () => {
  const todo = {
    id: 1,
    title: "Test Todo",
    completed: false,
    isEditing: false,
  };
  const handleUpdateTodo = jest.fn();
  const handleSaveEdit = jest.fn();
  const handleEdit = jest.fn();
  const handleDeleteTodo = jest.fn();

  renderWithProviders(
    <TodoItem
      todo={todo}
      handleSaveEdit={handleSaveEdit}
      handleEdit={handleEdit}
      handleUpdateTodo={handleUpdateTodo}
      handleDeleteTodo={handleDeleteTodo}
    />,
    { reduxState: { todos: { items: [todo] } } }
  );

  const checkbox = screen.getByRole("checkbox");
  expect(checkbox).not.toBeChecked();

  fireEvent.click(checkbox);
  expect(handleUpdateTodo).toHaveBeenCalledWith(todo.id, todo.title, true);
});
