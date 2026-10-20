import { MoonIcon, SunIcon } from "./Icons";

export default function ThemeToggle({ theme, onToggle }) {
  const dark = theme === "dark";
  return (
    <button className="icon-btn icon-btn--ghost" onClick={onToggle} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}>
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
