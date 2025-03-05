import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";

const mockStore = configureStore([]);

const renderWithProviders = (ui, { reduxState } = {}) => {
  const store = mockStore(reduxState);
  return render(
    <Provider store={store}>
      <Router>{ui}</Router>
    </Provider>
  );
};

test("renders App and checks authentication status", () => {
  const initialState = {
    auth: { isAuthenticated: false, user: null },
    todos: { items: [] },
  };

  renderWithProviders(<App />, { reduxState: initialState });

  expect(screen.getByText(/Todo App/i)).toBeInTheDocument();
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
});
