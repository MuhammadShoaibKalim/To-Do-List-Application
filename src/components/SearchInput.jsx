import { CloseIcon, SearchIcon } from "./Icons";

export default function SearchInput({ value, onChange }) {
  return (
    <div className="search">
      <SearchIcon />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tasks"
        aria-label="Search tasks"
      />
      {value && (
        <button className="icon-btn icon-btn--sm" onClick={() => onChange("")} aria-label="Clear search">
          <CloseIcon width={14} height={14} />
        </button>
      )}
    </div>
  );
}
