import {
  getCurrentUserId,
} from "./auth";

import {
  DEFAULT_RATES,
} from "./currencyRateService";

import {
  DEFAULT_USER_SETTINGS,
} from "./settingsService";

import {
  supabase,
} from "./supabase";

/*
 * Ulanyjynyň ÖSÜŞ-däki ähli cloud maglumatlaryny
 * arassalaýar / başlangyç ýagdaýyna getirýär.
 *
 * Möhüm:
 * Bu funksiýa diňe internet bar wagty işlemeli.
 */
export async function clearCloudAppData() {
  if (!navigator.onLine) {
    throw new Error(
      "Maglumatlary doly pozmak üçin internet birikmesi gerek.",
    );
  }

  const userId =
    await getCurrentUserId();

  const now =
    new Date().toISOString();

  // =========================
  // GOALS
  // =========================

  {
    const { error } =
      await supabase
        .from("user_goals")
        .update({
          deleted_at: now,
          updated_at: now,
        })
        .eq("user_id", userId)
        .is("deleted_at", null);

    if (error) {
      throw error;
    }
  }

  // =========================
  // FINANCE TRANSACTIONS
  // =========================

  {
    const { error } =
      await supabase
        .from("finance_transactions")
        .update({
          deleted_at: now,
          updated_at: now,
        })
        .eq("user_id", userId)
        .is("deleted_at", null);

    if (error) {
      throw error;
    }
  }

  // =========================
  // FINANCE ACCOUNT
  // =========================

  {
    const { error } =
      await supabase
        .from("finance_accounts")
        .upsert(
          {
            user_id: userId,

            bank_balance: 0,
            monthly_income: 0,
            monthly_expense: 0,

            updated_at: now,
            deleted_at: null,
          },
          {
            onConflict: "user_id",
          },
        );

    if (error) {
      throw error;
    }
  }

  // =========================
  // PLANNER
  // =========================

  {
    const { error } =
      await supabase
        .from("planner_tasks")
        .update({
          deleted_at: now,
          updated_at: now,
        })
        .eq("user_id", userId)
        .is("deleted_at", null);

    if (error) {
      throw error;
    }
  }

  // =========================
  // WEEKLY REVIEWS
  // =========================

  {
    const { error } =
      await supabase
        .from("weekly_reviews")
        .update({
          deleted_at: now,
          updated_at: now,
        })
        .eq("user_id", userId)
        .is("deleted_at", null);

    if (error) {
      throw error;
    }
  }

  // =========================
  // SETTINGS → DEFAULT
  // =========================

  {
    const { error } =
      await supabase
        .from("user_settings")
        .upsert(
          {
            user_id: userId,

            language:
              DEFAULT_USER_SETTINGS.language,

            currency:
              DEFAULT_USER_SETTINGS.currency,

            start_page:
              DEFAULT_USER_SETTINGS.startPage,

            theme:
              DEFAULT_USER_SETTINGS.theme,

            notification_planner:
              DEFAULT_USER_SETTINGS
                .notifications.planner,

            notification_finance:
              DEFAULT_USER_SETTINGS
                .notifications.finance,

            notification_goal:
              DEFAULT_USER_SETTINGS
                .notifications.goal,

            notification_deadline:
              DEFAULT_USER_SETTINGS
                .notifications.deadline,

            notification_success:
              DEFAULT_USER_SETTINGS
                .notifications.success,

            updated_at: now,
            deleted_at: null,
          },
          {
            onConflict: "user_id",
          },
        );

    if (error) {
      throw error;
    }
  }

  // =========================
  // CURRENCY RATES → DEFAULT
  // =========================

  {
    const { error } =
      await supabase
        .from("user_currency_rates")
        .upsert(
          {
            user_id: userId,

            mode: "manual",

            usd_rate:
              DEFAULT_RATES.USD,

            eur_rate:
              DEFAULT_RATES.EUR,

            cny_rate:
              DEFAULT_RATES.CNY,

            try_rate:
              DEFAULT_RATES.TRY,

            last_updated_at: null,
            last_provider_date: null,

            updated_at: now,
            deleted_at: null,
          },
          {
            onConflict: "user_id",
          },
        );

    if (error) {
      throw error;
    }
  }

  // =========================
  // NOTIFICATIONS
  // =========================

  {
    const { error } =
      await supabase
        .from("notifications")
        .update({
          deleted_at: now,
          updated_at: now,
        })
        .eq("user_id", userId)
        .is("deleted_at", null);

    if (error) {
      throw error;
    }
  }
}