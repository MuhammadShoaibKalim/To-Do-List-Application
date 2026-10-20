/**
 * Taskflow - Application-wide configuration and design constants
 */
export const APP_CONFIG = {
  PAGE_SIZE: Number(import.meta.env.VITE_PAGE_SIZE) || 10,
  STORAGE_KEY: "taskflow:todos",
  THEME_STORAGE_KEY: "taskflow:theme",
  MAX_REMOTE_ID: 200,
  DEFAULT_USER_ID: 1,
  DEBOUNCE_DELAY_MS: 250,
};

export const FILTER_STATUS = Object.freeze({
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed",
});
