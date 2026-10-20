import { ChevronIcon } from "./Icons";

export default function Pagination({ page, pageCount, total, pageSize, onPage }) {
  if (pageCount <= 1) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <nav className="pagination" aria-label="Pagination">
      <span className="pagination__info">Showing {from}–{to} of {total}</span>
      <div className="pagination__controls">
        <button className="icon-btn" onClick={() => onPage(page - 1)} disabled={page === 1} aria-label="Previous page">
          <ChevronIcon dir="left" />
        </button>
        <span aria-current="page">Page {page} of {pageCount}</span>
        <button className="icon-btn" onClick={() => onPage(page + 1)} disabled={page === pageCount} aria-label="Next page">
          <ChevronIcon />
        </button>
      </div>
    </nav>
  );
}
