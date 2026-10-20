export default function ProgressRing({ done, total }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  const r = 54;
  const c = 2 * Math.PI * r;

  return (
    <div className="ring" role="img" aria-label={`${pct}% complete, ${done} of ${total} tasks done`}>
      <svg viewBox="0 0 128 128" className="ring__svg">
        <circle className="ring__track" cx="64" cy="64" r={r} />
        <circle
          className="ring__bar"
          cx="64"
          cy="64"
          r={r}
          stroke="var(--done)"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
        />
      </svg>
      <div className="ring__label">
        <strong>
          {pct}<small>%</small>
        </strong>
        <span>{done} of {total} done</span>
      </div>
    </div>
  );
}
