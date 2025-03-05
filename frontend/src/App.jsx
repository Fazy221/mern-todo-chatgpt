import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodos,
  createTodo,
  editTodo,
  removeTodo,
  setEditing,
  cancelEditing,
  updateTitle,
} from "./store/todosSlice";
import { checkAuth, logout } from "./store/authSlice";
import TodoList from "./TodoList";
import Login from "./Login";
import Register from "./Register";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.items);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const [newTodo, setNewTodo] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Checking authentication status...");
    dispatch(checkAuth())
      .then((result) => {
        if (result.payload && result.payload.isAuthenticated) {
          console.log("User is authenticated, fetching todos...");
          dispatch(fetchTodos());
        } else {
          console.log("User is not authenticated");
        }
      })
      .catch((error) => {
        console.error("Error checking authentication status:", error);
      });
  }, [dispatch]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    newTodo.trim();
    if (newTodo === "") {
      alert("Please enter a todo");
      return;
    }
    try {
      await dispatch(createTodo(newTodo)).unwrap();
      setNewTodo("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateTodo = async (id, title, completed) => {
    try {
      await dispatch(editTodo({ id, title, completed })).unwrap();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await dispatch(removeTodo(id)).unwrap();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (id) => {
    dispatch(setEditing(id));
  };

  const handleSaveEdit = async (id) => {
    const todoToSave = todos.find((todo) => todo.id === id);
    try {
      await dispatch(
        editTodo({
          id,
          title: todoToSave.title,
          completed: todoToSave.completed,
        })
      ).unwrap();
      dispatch(cancelEditing(id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await dispatch(logout()).unwrap();
    window.location.href = "/login"; // Redirect to login page after logout
  };

  return (
    <Router>
      <div className="App">
        <h1>Todo App</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {isAuthenticated && (
          <button className="logout__btn-style" onClick={handleLogout}>
            Logout
          </button>
        )}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <>
                  <h4>Welcome, {user?.username}</h4>
                  <form className="form__container" onSubmit={handleAddTodo}>
                    <input
                      type="text"
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      placeholder="Add a new todo"
                    />
                    <button type="submit">Add Todo</button>
                  </form>
                  <TodoList
                    todos={todos}
                    handleSaveEdit={handleSaveEdit}
                    handleEdit={handleEdit}
                    handleUpdateTodo={handleUpdateTodo}
                    handleDeleteTodo={handleDeleteTodo}
                    setTodos={(updatedTodos) =>
                      dispatch(updateTitle(updatedTodos))
                    }
                  />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
