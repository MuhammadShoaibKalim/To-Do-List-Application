import { CloseIcon } from "./Icons";

export function Loader() {
  return (
    <div className="skeletons" role="status" aria-label="Loading tasks">
      {Array.from({ length: 6 }, (_, i) => (
        <div className="skeleton" key={i} style={{ "--w": `${55 + ((i * 17) % 35)}%` }} />
      ))}
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <h3>We couldn't load your tasks</h3>
      <p>{message}. Check your connection, then try again.</p>
      <button className="btn" onClick={onRetry}>Try again</button>
    </div>
  );
}

export function EmptyState({ filtered, onReset }) {
  return (
    <div className="state">
      <div className="state__art" aria-hidden="true" />
      {filtered ? (
        <>
          <h3>No tasks match these filters</h3>
          <p>Try a different search or show everyone's tasks.</p>
          <button className="btn btn--soft" onClick={onReset}>Clear filters</button>
        </>
      ) : (
        <>
          <h3>Nothing on your list</h3>
          <p>Add your first task above to get started.</p>
        </>
      )}
    </div>
  );
}

export function Notice({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="notice" role="alert">
      <span>{message}</span>
      <button className="icon-btn icon-btn--sm" onClick={onDismiss} aria-label="Dismiss message">
        <CloseIcon width={14} height={14} />
      </button>
    </div>
  );
}
