import { describe, expect, it } from "vitest";
import { initialState, todosReducer } from "../hooks/useTodos";

const base = {
  ...initialState,
  status: "success",
  items: [
    { id: 1, userId: 1, title: "one", completed: false },
    { id: 2, userId: 1, title: "two", completed: true },
  ],
};

describe("todosReducer", () => {
  it("toggles a todo", () => {
    expect(todosReducer(base, { type: "TOGGLE", id: 1 }).items[0].completed).toBe(true);
  });
  it("adds new todos to the top", () => {
    const next = todosReducer(base, { type: "ADD", todo: { id: "x", title: "new", completed: false } });
    expect(next.items[0].id).toBe("x");
  });
  it("updates a title", () => {
    expect(todosReducer(base, { type: "UPDATE", id: 2, title: "renamed" }).items[1].title).toBe("renamed");
  });
  it("deletes a todo", () => {
    expect(todosReducer(base, { type: "DELETE", id: 1 }).items).toHaveLength(1);
  });
  it("clears completed todos", () => {
    expect(todosReducer(base, { type: "CLEAR_COMPLETED" }).items.map((t) => t.id)).toEqual([1]);
  });
  it("rolls back with a notice", () => {
    const next = todosReducer({ ...base, items: [] }, { type: "ROLLBACK", items: base.items, notice: "undone" });
    expect(next.items).toHaveLength(2);
    expect(next.notice).toBe("undone");
  });
});
