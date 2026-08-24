const OSUS_STORAGE_KEYS = [
  "osus-goal-storage",
  "osus-finance-storage",
  "osus-planner-storage",
  "osus-settings-storage",
  "osus-currency-rates-storage",
  "osus-notification-storage",
  "osus-weekly-review-storage",
  "osus-profile-storage",
];

export function clearAppData() {
  OSUS_STORAGE_KEYS.forEach((key) => {
    window.localStorage.removeItem(key);
  });
}