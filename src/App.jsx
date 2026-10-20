import { useEffect, useMemo, useState } from "react";
import { useTodos } from "./hooks/useTodos";
import { useDebounce } from "./hooks/useDebounce";
import { useTheme } from "./hooks/useTheme";
import { APP_CONFIG, FILTER_STATUS } from "./constants";
import ProgressRing from "./components/ProgressRing";
import FilterBar from "./components/FilterBar";
import SearchInput from "./components/SearchInput";
import AddTodoForm from "./components/AddTodoForm";
import TodoList from "./components/TodoList";
import Pagination from "./components/Pagination";
import ThemeToggle from "./components/ThemeToggle";
import { EmptyState, ErrorMessage, Loader, Notice } from "./components/States";

const PAGE_SIZE = APP_CONFIG.PAGE_SIZE;

export default function App() {
  const {
    items,
    status,
    error,
    notice,
    addTodo,
    toggleTodo,
    editTodo,
    removeTodo,
    clearCompleted,
    dismissNotice,
    retry,
  } = useTodos();

  const [theme, toggleTheme] = useTheme();
  const [filter, setFilter] = useState(FILTER_STATUS.ALL);
  const [userId, setUserId] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebounce(query, APP_CONFIG.DEBOUNCE_DELAY_MS);

  const users = useMemo(
    () => [...new Set(items.map((t) => t.userId))].sort((a, b) => a - b),
    [items]
  );

  // Counts reflect the current user + search scope, keeping metrics synchronized
  const scoped = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return items.filter(
      (t) =>
        (userId === "all" || t.userId === Number(userId)) &&
        (!q || t.title.toLowerCase().includes(q))
    );
  }, [items, userId, debouncedQuery]);

  const counts = useMemo(() => {
    const done = scoped.filter((t) => t.completed).length;
    return {
      all: scoped.length,
      completed: done,
      active: scoped.length - done,
    };
  }, [scoped]);

  const visible = useMemo(
    () =>
      scoped.filter((t) =>
        filter === FILTER_STATUS.ALL
          ? true
          : filter === FILTER_STATUS.COMPLETED
          ? t.completed
          : !t.completed
      ),
    [scoped, filter]
  );

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = visible.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [filter, userId, debouncedQuery]);

  const hasFilters = filter !== FILTER_STATUS.ALL || userId !== "all" || query !== "";
  const resetFilters = () => {
    setFilter(FILTER_STATUS.ALL);
    setUserId("all");
    setQuery("");
  };

  const overallDone = items.filter((t) => t.completed).length;

  return (
    <div className="shell">
      <aside className="panel" aria-label="Task metrics and filters">
        <header className="brand">
          <span className="brand__mark" aria-hidden="true" />
          <div className="brand__text">
            <h1>Taskflow</h1>
            <span className="brand__badge">v1.0</span>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>

        <div className="panel__ring-wrap">
          <ProgressRing done={overallDone} total={items.length} />
        </div>

        <div className="panel__filters-wrap">
          <FilterBar
            status={filter}
            onStatus={setFilter}
            counts={counts}
            userId={userId}
            onUser={setUserId}
            users={users}
          />
        </div>

        <footer className="panel__footer">
          <button
            className="panel__clear"
            onClick={clearCompleted}
            disabled={!overallDone}
          >
            Clear {overallDone || ""} completed
          </button>
        </footer>
      </aside>

      <main className="main" aria-label="Tasks workspace">
        <header className="main__header">
          <Notice message={notice} onDismiss={dismissNotice} />
          <AddTodoForm onAdd={addTodo} />
          <SearchInput value={query} onChange={setQuery} />
        </header>

        <section aria-live="polite" className="list-wrap">
          {status === "loading" || status === "idle" ? (
            <Loader />
          ) : status === "error" ? (
            <ErrorMessage message={error} onRetry={retry} />
          ) : pageItems.length === 0 ? (
            <EmptyState filtered={hasFilters} onReset={resetFilters} />
          ) : (
            <TodoList
              todos={pageItems}
              onToggle={toggleTodo}
              onEdit={editTodo}
              onDelete={removeTodo}
            />
          )}
        </section>

        <footer className="main__footer">
          {status === "success" && (
            <Pagination
              page={safePage}
              pageCount={pageCount}
              total={visible.length}
              pageSize={PAGE_SIZE}
              onPage={setPage}
            />
          )}
          <p className="hint">
            Tip: double-click a task to rename it. Changes are saved in your browser.
          </p>
        </footer>
      </main>
    </div>
  );
}
