import {
  clearCloudAppData,
} from "../../../services/appDataResetService";

import {
  offlineDb,
} from "../../../services/offlineDb";

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

/*
 * ÖSÜŞ-däki ähli ulanyjy maglumatlaryny arassalaýar.
 *
 * Tertip:
 * 1. Ilki cloud / Supabase maglumatlary arassalanýar.
 * 2. Soň IndexedDB / Dexie pozulýar.
 * 3. Soň diňe ÖSÜŞ-e degişli localStorage maglumatlary pozulýar.
 *
 * Auth / Supabase login sessiýasyna degilmeýär.
 */
export async function clearAppData() {
  /*
   * Cloud maglumatlar ilki pozulmaly.
   * Eger cloud arassalamak şowsuz bolsa,
   * local maglumatlara degmeýäris.
   */
  await clearCloudAppData();

  /*
   * Offline maglumatlaryň hemmesi:
   * - goals
   * - planner
   * - finance
   * - weekly reviews
   * - settings
   * - currency rates
   * - notifications
   * - sync queue
   */
  await offlineDb.delete();

  /*
   * Diňe programmanyň öz persist maglumatlaryny poz.
   *
   * localStorage.clear() ulanmaýarys,
   * sebäbi ol Supabase auth sessiýasyny hem
   * pozup biler.
   */
  OSUS_STORAGE_KEYS.forEach((key) => {
    window.localStorage.removeItem(key);
  });
}