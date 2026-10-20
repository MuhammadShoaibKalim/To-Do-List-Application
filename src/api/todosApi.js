import { APP_CONFIG } from "../constants";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://jsonplaceholder.typicode.com/todos";

/**
 * Robust JSON request helper with standardized error handling
 */
async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Accept: "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }
  return res.json();
}

export const fetchTodos = (signal) => request(BASE_URL, { signal });

export const createTodo = (todo) =>
  request(BASE_URL, {
    method: "POST",
    body: JSON.stringify(todo),
  });

export const updateTodo = (id, patch) =>
  request(`${BASE_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });

export const deleteTodo = (id) =>
  request(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

/**
 * JSONPlaceholder only persists IDs 1 through 200.
 * Client-generated tasks receive UUID strings and bypass remote sync to prevent 404/500 errors.
 */
export const isRemoteId = (id) =>
  typeof id === "number" && id <= APP_CONFIG.MAX_REMOTE_ID;
