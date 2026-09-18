import {
  offlineDb,
} from "../../../services/offlineDb";

/*
 * ÖSÜŞ-iň şu enjamdaky ähli ýerli
 * maglumatlaryny doly arassalaýar.
 *
 * Bu:
 * - localStorage
 * - sessionStorage
 * - Dexie / IndexedDB
 *
 * maglumatlaryny pozýar.
 */
export async function clearAppData() {
  /*
   * Zustand persist maglumatlary,
   * offline user marker we Supabase-nyň
   * şu brauzerdäki local session-y hem
   * arassalanýar.
   */
  window.localStorage.clear();

  window.sessionStorage.clear();

  /*
   * Goals
   * Planner
   * Finance
   * Weekly Review
   * Settings
   * Currency Rates
   * Notifications
   * Sync Queue
   *
   * ýaly ähli offline maglumatlaryň
   * ýerleşýän Dexie bazasyny doly poz.
   */
  await offlineDb.delete();
}