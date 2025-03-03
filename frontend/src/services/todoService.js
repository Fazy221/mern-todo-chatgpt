import axios from "axios";

const API_URL = "http://localhost:5000/todos";

export const getTodos = async () => {
  const response = await axios.get(API_URL, { withCredentials: true });
  return response.data;
};

export const addTodo = async (title) => {
  const response = await axios.post(
    API_URL,
    { title },
    { withCredentials: true }
  );
  return response.data;
};

export const updateTodo = async (id, title, completed) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    { title, completed },
    { withCredentials: true }
  );
  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    withCredentials: true,
  });
  return response.data;
};
