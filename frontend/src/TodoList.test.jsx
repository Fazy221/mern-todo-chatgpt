import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import TodoList from "./TodoList";

const mockStore = configureStore([]);
const store = mockStore({});

const renderWithProviders = (ui, { reduxState } = {}) => {
  const store = mockStore(reduxState);
  return render(<Provider store={store}>{ui}</Provider>);
};

test("renders TodoList with todos", () => {
  const todos = [
    { id: 1, title: "Test Todo 1", completed: false, isEditing: false },
    { id: 2, title: "Test Todo 2", completed: true, isEditing: false },
  ];
  const handleSaveEdit = jest.fn();
  const handleEdit = jest.fn();
  const handleUpdateTodo = jest.fn();
  const handleDeleteTodo = jest.fn();

  renderWithProviders(
    <TodoList
      todos={todos}
      handleSaveEdit={handleSaveEdit}
      handleEdit={handleEdit}
      handleUpdateTodo={handleUpdateTodo}
      handleDeleteTodo={handleDeleteTodo}
    />,
    { reduxState: { todos: { items: todos } } }
  );

  const todoItems = screen.getAllByRole("listitem");
  expect(todoItems).toHaveLength(2);
  expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
  expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
});
