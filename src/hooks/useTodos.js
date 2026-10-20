import { useCallback, useEffect, useReducer, useRef } from "react";
import * as api from "../api/todosApi";
import { APP_CONFIG } from "../constants";

const STORAGE_KEY = APP_CONFIG.STORAGE_KEY;

export const initialState = { items: [], status: "idle", error: null, notice: null };

export function todosReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, status: "loading", error: null };
    case "FETCH_SUCCESS":
      return { ...state, status: "success", items: action.items };
    case "FETCH_ERROR":
      return { ...state, status: "error", error: action.error };
    case "ADD":
      return { ...state, items: [action.todo, ...state.items] };
    case "TOGGLE":
      return {
        ...state,
        items: state.items.map((t) => (t.id === action.id ? { ...t, completed: !t.completed } : t)),
      };
    case "UPDATE":
      return {
        ...state,
        items: state.items.map((t) => (t.id === action.id ? { ...t, title: action.title } : t)),
      };
    case "DELETE":
      return { ...state, items: state.items.filter((t) => t.id !== action.id) };
    case "ROLLBACK":
      return { ...state, items: action.items, notice: action.notice };
    case "CLEAR_COMPLETED":
      return { ...state, items: state.items.filter((t) => !t.completed) };
    case "DISMISS_NOTICE":
      return { ...state, notice: null };
    default:
      return state;
  }
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useTodos() {
  const [state, dispatch] = useReducer(todosReducer, initialState);
  const itemsRef = useRef(state.items);
  itemsRef.current = state.items;

  const load = useCallback((signal, { force = false } = {}) => {
    const stored = force ? null : readStored();
    if (stored) {
      dispatch({ type: "FETCH_SUCCESS", items: stored });
      return;
    }
    dispatch({ type: "FETCH_START" });
    api
      .fetchTodos(signal)
      .then((items) => dispatch({ type: "FETCH_SUCCESS", items }))
      .catch((err) => {
        if (err.name !== "AbortError") dispatch({ type: "FETCH_ERROR", error: err.message });
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  // Persist local changes (JSONPlaceholder does not store writes).
  useEffect(() => {
    if (state.status === "success") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
      } catch {
        /* storage full or blocked: the app keeps working in memory */
      }
    }
  }, [state.items, state.status]);

  // Optimistic update: apply locally, sync remotely, roll back on failure.
  const optimistic = useCallback((action, remoteCall) => {
    const snapshot = itemsRef.current;
    dispatch(action);
    if (!remoteCall) return;
    remoteCall().catch(() =>
      dispatch({
        type: "ROLLBACK",
        items: snapshot,
        notice: "That change couldn't be saved, so it was undone. Check your connection and try again.",
      })
    );
  }, []);

  const addTodo = useCallback(
    (title) => {
      const todo = {
        userId: APP_CONFIG.DEFAULT_USER_ID,
        id: crypto.randomUUID(),
        title: title.trim(),
        completed: false,
      };
      optimistic({ type: "ADD", todo }, () =>
        api.createTodo({
          userId: APP_CONFIG.DEFAULT_USER_ID,
          title: todo.title,
          completed: false,
        })
      );
    },
    [optimistic]
  );

  const toggleTodo = useCallback(
    (id) => {
      const todo = itemsRef.current.find((t) => t.id === id);
      if (!todo) return;
      optimistic(
        { type: "TOGGLE", id },
        api.isRemoteId(id) ? () => api.updateTodo(id, { completed: !todo.completed }) : null
      );
    },
    [optimistic]
  );

  const editTodo = useCallback(
    (id, title) => {
      optimistic(
        { type: "UPDATE", id, title: title.trim() },
        api.isRemoteId(id) ? () => api.updateTodo(id, { title: title.trim() }) : null
      );
    },
    [optimistic]
  );

  const removeTodo = useCallback(
    (id) => optimistic({ type: "DELETE", id }, api.isRemoteId(id) ? () => api.deleteTodo(id) : null),
    [optimistic]
  );

  const clearCompleted = useCallback(() => dispatch({ type: "CLEAR_COMPLETED" }), []);
  const dismissNotice = useCallback(() => dispatch({ type: "DISMISS_NOTICE" }), []);
  const retry = useCallback(() => load(undefined, { force: true }), [load]);

  return { ...state, addTodo, toggleTodo, editTodo, removeTodo, clearCompleted, dismissNotice, retry };
}
