const STATUSES = [
  { id: "all", label: "All tasks" },
  { id: "active", label: "To do" },
  { id: "completed", label: "Done" },
];

export default function FilterBar({ status, onStatus, counts, userId, onUser, users }) {
  return (
    <div className="filters">
      <nav aria-label="Filter by status">
        <ul className="status-list">
          {STATUSES.map((s) => (
            <li key={s.id}>
              <button
                className={`status-btn${status === s.id ? " is-active" : ""}`}
                aria-pressed={status === s.id}
                onClick={() => onStatus(s.id)}
              >
                <span>{s.label}</span>
                <span className="count">{counts[s.id]}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <label className="select">
        <span>Assigned to</span>
        <select value={userId} onChange={(e) => onUser(e.target.value)}>
          <option value="all">Everyone</option>
          {users.map((u) => (
            <option key={u} value={u}>User {u}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
