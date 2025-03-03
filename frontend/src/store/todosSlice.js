import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../services/todoService';

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await getTodos();
  return response;
});

export const createTodo = createAsyncThunk('todos/createTodo', async (title) => {
  const response = await addTodo(title);
  return response;
});

export const editTodo = createAsyncThunk('todos/editTodo', async ({ id, title, completed }) => {
  const response = await updateTodo(id, title, completed);
  return response;
});

export const removeTodo = createAsyncThunk('todos/removeTodo', async (id) => {
  await deleteTodo(id);
  return id;
});

const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setEditing: (state, action) => {
      const todo = state.items.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.isEditing = true;
      }
    },
    cancelEditing: (state, action) => {
      const todo = state.items.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.isEditing = false;
      }
    },
    updateTitle: (state, action) => {
      const { id, title } = action.payload;
      const todo = state.items.find((todo) => todo.id === id);
      if (todo) {
        todo.title = title;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex((todo) => todo.id === action.payload.id);
        state.items[index] = action.payload;
      })
      .addCase(removeTodo.fulfilled, (state, action) => {
        state.items = state.items.filter((todo) => todo.id !== action.payload);
      });
  },
});

export const { setEditing, cancelEditing, updateTitle } = todosSlice.actions;

export default todosSlice.reducer;