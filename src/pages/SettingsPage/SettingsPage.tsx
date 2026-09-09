import {
  Bell,
  Coins,
  DatabaseBackup,
  Download,
  Languages,
  Monitor,
  RotateCcw,
  Settings,
  Trash2,
  TriangleAlert,
  Upload,
  UserRound,
} from "lucide-react";
import {
  useState,
  type ChangeEvent,
} from "react";

import {
  downloadAppBackup,
  importAppBackup,
} from "../../features/backup/utils/appBackup";
import { clearAppData } from "../../features/backup/utils/clearAppData";
import CurrencyRateSettings from "../../features/settings/components/CurrencyRateSettings/CurrencyRateSettings";

import type {
  AppCurrency,
  AppLanguage,
  AppTheme,
  StartPage,
} from "../../features/settings/types/settings.types";

import { useTranslation } from "../../hooks/useTranslation";
import { useProfileStore } from "../../store/profileStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useCurrencyRateStore } from "../../store/currencyRateStore";

export default function SettingsPage() {
  const { t } = useTranslation();

  // -----------------------------
  // LOCAL UI STATE
  // -----------------------------

  const [backupStatus, setBackupStatus] =
    useState("");

  const [
    pendingBackupFile,
    setPendingBackupFile,
  ] = useState<File | null>(null);

  const [
    showImportConfirm,
    setShowImportConfirm,
  ] = useState(false);

  const [
    showClearConfirm,
    setShowClearConfirm,
  ] = useState(false);

  // -----------------------------
  // PROFILE STORE
  // -----------------------------

  const profileName =
    useProfileStore(
      (state) => state.name,
    );

  const profileRole =
    useProfileStore(
      (state) => state.role,
    );

  const setProfileName =
    useProfileStore(
      (state) => state.setName,
    );

  const setProfileRole =
    useProfileStore(
      (state) => state.setRole,
    );

  const resetProfile =
    useProfileStore(
      (state) => state.resetProfile,
    );

  const resetRates =
    useCurrencyRateStore(
      (state) => state.resetRates,
    );

  // -----------------------------
  // SETTINGS STORE
  // -----------------------------

  const language =
    useSettingsStore(
      (state) => state.language,
    );

  const currency =
    useSettingsStore(
      (state) => state.currency,
    );

  const startPage =
    useSettingsStore(
      (state) => state.startPage,
    );

  const theme =
    useSettingsStore(
      (state) => state.theme,
    );

  const notifications =
    useSettingsStore(
      (state) => state.notifications,
    );

  const setLanguage =
    useSettingsStore(
      (state) => state.setLanguage,
    );

  const setCurrency =
    useSettingsStore(
      (state) => state.setCurrency,
    );

  const setStartPage =
    useSettingsStore(
      (state) => state.setStartPage,
    );

  const setTheme =
    useSettingsStore(
      (state) => state.setTheme,
    );

  const setNotificationPreference =
    useSettingsStore(
      (state) =>
        state.setNotificationPreference,
    );

  const resetAppSettings =
    useSettingsStore(
      (state) => state.resetSettings,
    );

  // -----------------------------
  // OPTIONS
  // -----------------------------

  const languages = [
    {
      value: "tk",
      label: "Türkmençe",
    },
    {
      value: "ru",
      label: "Русский",
    },
    {
      value: "en",
      label: "English",
    },
  ];

  const currencies = [
    {
      value: "TMT",
      label: "TMT",
      description:
        language === "ru"
          ? "Туркменский манат"
          : language === "en"
            ? "Turkmen manat"
            : "Türkmen manady",
    },
    {
      value: "USD",
      label: "$ USD",
      description:
        language === "ru"
          ? "Доллар США"
          : language === "en"
            ? "US dollar"
            : "ABŞ dollary",
    },
    {
      value: "EUR",
      label: "€ EUR",
      description:
        language === "ru"
          ? "Евро"
          : language === "en"
            ? "Euro"
            : "Ýewro",
    },
    {
      value: "CNY",
      label: "¥ CNY",
      description:
        language === "ru"
          ? "Китайский юань"
          : language === "en"
            ? "Chinese yuan"
            : "Hytaý ýuany",
    },
    {
      value: "TRY",
      label: "₺ TRY",
      description:
        language === "ru"
          ? "Турецкая лира"
          : language === "en"
            ? "Turkish lira"
            : "Türk lirasy",
    },
  ];

  const startPages = [
    {
      value: "dashboard",
      label: t.nav.dashboard,
    },
    {
      value: "planner",
      label: t.nav.planner,
    },
    {
      value: "analytics",
      label: t.nav.analytics,
    },
    {
      value: "ai-coach",
      label: t.nav.aiCoach,
    },
  ];

  const themes = [
    {
      value: "dark",
      label: t.settings.dark,
    },
    {
      value: "light",
      label: t.settings.light,
    },
    {
      value: "system",
      label: t.settings.system,
    },
  ];

  const notificationItems = [
    {
      key: "planner",
      label:
        language === "ru"
          ? "Уведомления планирования"
          : language === "en"
            ? "Planning notifications"
            : "Meýilnama bildirişleri",
    },
    {
      key: "finance",
      label:
        language === "ru"
          ? "Финансовые уведомления"
          : language === "en"
            ? "Finance notifications"
            : "Maliýe bildirişleri",
    },
    {
      key: "goal",
      label:
        language === "ru"
          ? "Уведомления о целях"
          : language === "en"
            ? "Goal notifications"
            : "Maksat bildirişleri",
    },
    {
      key: "deadline",
      label:
        language === "ru"
          ? "Предупреждения о сроках"
          : language === "en"
            ? "Deadline warnings"
            : "Soňky möhlet duýduryşlary",
    },
    {
      key: "success",
      label:
        language === "ru"
          ? "Уведомления об успехах"
          : language === "en"
            ? "Success notifications"
            : "Üstünlik bildirişleri",
    },
  ];

  // -----------------------------
  // HANDLERS
  // -----------------------------

  function resetSettings() {
    resetAppSettings();
    resetProfile();
    resetRates();
  }

  function handleBackupFileSelect(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setPendingBackupFile(file);
    setShowImportConfirm(true);

    event.target.value = "";
  }

  async function handleConfirmBackupImport() {
    if (!pendingBackupFile) {
      return;
    }

    try {
      await importAppBackup(
        pendingBackupFile,
      );

      setBackupStatus(
        "Backup üstünlikli dikeldildi. Programma täzeden açylýar...",
      );

      setShowImportConfirm(false);
      setPendingBackupFile(null);

      window.setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch {
      setBackupStatus(
        "Backup faýlyny dikeltmek başartmady.",
      );

      setShowImportConfirm(false);
      setPendingBackupFile(null);
    }
  }

  function handleClearAllData() {
    clearAppData();

    setShowClearConfirm(false);

    window.location.reload();
  }

  return (
    <div className="space-y-3 pb-6 sm:space-y-5 sm:pb-8 lg:space-y-8 lg:pb-10">
      {/* ======================================
          HEADER
      ====================================== */}

      <section className="rounded-[20px] border border-border bg-surface p-4 shadow-[var(--app-shadow)] sm:rounded-3xl sm:p-6 lg:p-8">
        <div className="flex items-center gap-2 text-primary">
          <Settings size={18} />

          <span className="text-sm font-semibold">
            {t.nav.settings}
          </span>
        </div>

        <div className="mt-2 flex flex-col gap-3 sm:mt-3 sm:gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-[21px] font-bold leading-7 tracking-tight text-text-primary sm:text-3xl sm:leading-normal lg:text-4xl">
              {t.settings.title}
            </h1>

            <p className="mt-1.5 max-w-3xl text-[10px] leading-4 text-text-muted sm:mt-3 sm:text-sm sm:leading-6 lg:text-base lg:leading-7">
              {t.settings.description}
            </p>
          </div>

          <button
            type="button"
            onClick={resetSettings}
            className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-border px-3 text-[10px] font-semibold text-text-secondary transition hover:border-primary/30 hover:text-primary sm:h-10 sm:w-auto sm:gap-2 sm:rounded-xl sm:px-4 sm:text-sm"
          >
            <RotateCcw size={16} />

            {t.settings.reset}
          </button>
        </div>
      </section>

      {/* ======================================
          PROFILE
      ====================================== */}

      <section className="rounded-xl border border-border bg-surface p-3.5 shadow-[var(--app-shadow)] sm:rounded-2xl sm:p-6">
        <div className="flex items-start gap-2.5 sm:gap-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-11 sm:w-11 sm:rounded-xl">
            <UserRound size={20} />
          </div>

          <div>
            <h2 className="font-bold text-text-primary">
              Profil
            </h2>

            <p className="mt-1 text-[10px] leading-4 text-text-muted sm:mt-2 sm:text-sm sm:leading-6">
              Topbar-da görkezilýän adyňy
              we roluňy sazla.
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-4">
          <label className="block">
            <span className="text-[10px] font-semibold text-text-primary sm:text-sm">
              Adyň
            </span>

            <input
              type="text"
              value={profileName}
              onChange={(event) =>
                setProfileName(
                  event.target.value,
                )
              }
              placeholder="Meselem: Alem"
              className="mt-1.5 h-9 w-full rounded-lg border border-border bg-background/40 px-3 text-xs text-text-primary outline-none transition placeholder:text-text-disabled focus:border-primary sm:mt-2 sm:h-11 sm:rounded-xl sm:px-4 sm:text-sm"
            />
          </label>

          <label className="block">
            <span className="text-[10px] font-semibold text-text-primary sm:text-sm">
              Rol
            </span>

            <input
              type="text"
              value={profileRole}
              onChange={(event) =>
                setProfileRole(
                  event.target.value,
                )
              }
              placeholder="Meselem: Founder"
              className="mt-1.5 h-9 w-full rounded-lg border border-border bg-background/40 px-3 text-xs text-text-primary outline-none transition placeholder:text-text-disabled focus:border-primary sm:mt-2 sm:h-11 sm:rounded-xl sm:px-4 sm:text-sm"
            />
          </label>
        </div>
      </section>

      {/* ======================================
          MAIN SETTINGS GRID
      ====================================== */}

      <div className="grid grid-cols-1 gap-3 sm:gap-5 xl:grid-cols-2 xl:gap-6">
        {/* LANGUAGE */}

        <section className="rounded-xl border border-border bg-surface p-3.5 shadow-[var(--app-shadow)] sm:rounded-2xl sm:p-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-10 sm:w-10 sm:rounded-xl">
              <Languages size={18} />
            </div>

            <div>
              <h2 className="font-bold text-text-primary">
                {t.settings.language}
              </h2>

              <p className="mt-0.5 line-clamp-1 text-[8px] text-text-muted sm:mt-1 sm:line-clamp-none sm:text-xs">
                {
                  t.settings
                    .languageDescription
                }
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-1.5 sm:mt-6 sm:gap-3">
            {languages.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setLanguage(
                    item.value as AppLanguage,
                  )
                }
                className={[
                  "rounded-lg border px-2 py-2 text-[10px] font-semibold transition sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm",
                  language === item.value
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border bg-background/40 text-text-secondary hover:text-text-primary",
                ].join(" ")}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        {/* CURRENCY */}

        <section className="rounded-xl border border-border bg-surface p-3.5 shadow-[var(--app-shadow)] sm:rounded-2xl sm:p-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-10 sm:w-10 sm:rounded-xl">
              <Coins size={18} />
            </div>

            <div>
              <h2 className="font-bold text-text-primary">
                {t.settings.currency}
              </h2>

              <p className="mt-0.5 line-clamp-1 text-[8px] text-text-muted sm:mt-1 sm:line-clamp-none sm:text-xs">
                {
                  t.settings
                    .currencyDescription
                }
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-1.5 sm:mt-6 sm:gap-3">
            {currencies.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setCurrency(
                    item.value as AppCurrency,
                  )
                }
                className={[
                  "rounded-lg border p-2 text-left transition sm:rounded-xl sm:p-4",
                  currency === item.value
                    ? "border-primary/30 bg-primary/10"
                    : "border-border bg-background/40 hover:border-primary/20",
                ].join(" ")}
              >
                <p
                  className={[
                    "font-bold",
                    currency === item.value
                      ? "text-primary"
                      : "text-text-primary",
                  ].join(" ")}
                >
                  {item.label}
                </p>

                <p className="mt-0.5 line-clamp-1 text-[8px] text-text-muted sm:mt-1 sm:line-clamp-none sm:text-xs">
                  {item.description}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* START PAGE + THEME */}

        <section className="rounded-xl border border-border bg-surface p-3.5 shadow-[var(--app-shadow)] sm:rounded-2xl sm:p-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-10 sm:w-10 sm:rounded-xl">
              <Monitor size={18} />
            </div>

            <div>
              <h2 className="font-bold text-text-primary">
                {t.settings.startPage}
              </h2>

              <p className="mt-0.5 line-clamp-1 text-[8px] text-text-muted sm:mt-1 sm:line-clamp-none sm:text-xs">
                {
                  t.settings
                    .startPageDescription
                }
              </p>
            </div>
          </div>

          <div className="mt-3 sm:mt-6">
            <select
              value={startPage}
              onChange={(event) =>
                setStartPage(
                  event.target
                    .value as StartPage,
                )
              }
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-text-primary outline-none focus:border-primary sm:h-12 sm:rounded-xl sm:px-4 sm:text-sm"
            >
              {startPages.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 border-t border-border pt-3 sm:mt-6 sm:pt-5">
            <p className="text-[10px] font-semibold text-text-primary sm:text-sm">
              {t.settings.appearance}
            </p>

            <div className="mt-2 grid grid-cols-3 gap-1.5 sm:mt-3 sm:gap-2">
              {themes.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    setTheme(
                      item.value as AppTheme,
                    )
                  }
                  className={[
                    "rounded-lg border px-2 py-2 text-[10px] font-semibold transition sm:rounded-xl sm:px-3 sm:py-3 sm:text-sm",
                    theme === item.value
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-background/40 text-text-secondary",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* NOTIFICATIONS */}

        <section className="rounded-xl border border-border bg-surface p-3.5 shadow-[var(--app-shadow)] sm:rounded-2xl sm:p-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-10 sm:w-10 sm:rounded-xl">
              <Bell size={18} />
            </div>

            <div>
              <h2 className="font-bold text-text-primary">
                {
                  t.settings
                    .notifications
                }
              </h2>

              <p className="mt-0.5 line-clamp-1 text-[8px] text-text-muted sm:mt-1 sm:line-clamp-none sm:text-xs">
                {
                  t.settings
                    .notificationsDescription
                }
              </p>
            </div>
          </div>

          <div className="mt-3 space-y-1.5 sm:mt-6 sm:space-y-3">
            {notificationItems.map(
              (item) => {
                const key =
                  item.key as keyof typeof notifications;

                const enabled =
                  notifications[key];

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      setNotificationPreference(
                        key,
                        !enabled,
                      )
                    }
                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-3 py-2 text-left transition hover:border-primary/20 sm:gap-4 sm:rounded-xl sm:px-4 sm:py-3"
                  >
                    <span className="text-[10px] font-medium text-text-secondary sm:text-sm">
                      {item.label}
                    </span>

                    <span
                      className={[
                        "relative h-6 w-11 shrink-0 rounded-full transition",
                        enabled
                          ? "bg-primary"
                          : "bg-slate-700",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "absolute top-1 h-3 w-3 rounded-full bg-white transition-all sm:h-4 sm:w-4",
                          enabled
                            ? "left-5 sm:left-6"
                            : "left-1",
                        ].join(" ")}
                      />
                    </span>
                  </button>
                );
              },
            )}
          </div>
        </section>
      </div>

      <CurrencyRateSettings />

      {/* ======================================
          BACKUP
      ====================================== */}

      <section className="rounded-xl border border-border bg-surface p-3.5 shadow-[var(--app-shadow)] sm:rounded-2xl sm:p-6">
        <div className="flex items-start gap-2.5 sm:gap-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-11 sm:w-11 sm:rounded-xl">
            <DatabaseBackup size={20} />
          </div>

          <div>
            <h2 className="font-bold text-text-primary">
              Maglumatlaryň ätiýaç nusgasy
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
              Maksatlar, maliýe, meýilnama,
              sazlamalar, pul kurslary, profil,
              bildirişler we hepdelik synlary bir backup
              faýlynda sakla.
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-6 sm:flex sm:flex-wrap sm:gap-3">
          <button
            type="button"
            onClick={downloadAppBackup}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-[10px] font-semibold text-slate-950 transition hover:bg-primary-hover sm:h-11 sm:gap-2 sm:rounded-xl sm:px-5 sm:text-sm"
          >
            <Download size={16} />
            Backup ýükle
          </button>

          <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 text-[10px] font-semibold text-text-primary transition hover:border-primary/30 hover:text-primary sm:h-11 sm:gap-2 sm:rounded-xl sm:px-5 sm:text-sm">
            <Upload size={16} />
            Backup-dan dikelt

            <input
              type="file"
              accept="application/json,.json"
              onChange={
                handleBackupFileSelect
              }
              className="hidden"
            />
          </label>
        </div>

        {backupStatus && (
          <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <p className="text-sm text-text-secondary">
              {backupStatus}
            </p>
          </div>
        )}

        <div className="mt-3 border-t border-border pt-3 sm:mt-5 sm:pt-5">
          <p className="text-xs leading-5 text-text-muted">
            Backup faýlyny kompýuterde
            ýa-da bulutda howpsuz ýerde
            saklamak maslahat berilýär.
            Dikeldilende häzirki ýerli
            maglumatlar backup içindäki
            maglumatlar bilen çalşyrylar.
          </p>
        </div>
      </section>

      {/* ======================================
          AUTO SAVE
      ====================================== */}

      <section className="rounded-xl border border-primary/20 bg-primary/5 p-3 sm:rounded-2xl sm:p-5">
        <p className="text-sm font-semibold text-primary">
          {t.settings.autoSaveTitle}
        </p>

        <p className="mt-2 text-xs leading-5 text-text-muted">
          {t.settings.autoSaveDescription}
        </p>
      </section>

      {/* ======================================
          DANGER ZONE
      ====================================== */}

      <section className="rounded-xl border border-danger/20 bg-danger/5 p-3.5 sm:rounded-2xl sm:p-6">
        <div className="flex items-start gap-2.5 sm:gap-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-danger/10 text-danger sm:h-11 sm:w-11 sm:rounded-xl">
            <TriangleAlert size={20} />
          </div>

          <div className="flex-1">
            <h2 className="font-bold text-text-primary">
              Danger Zone
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
              Bu amal ähli ýerli
              maglumatlary pozar:
              maksatlar, maliýe,
              meýilnama, hepdelik synlar,
              profil, bildirişler, sazlamalar
              we pul kurslary.
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:flex sm:flex-wrap sm:gap-3">
              <button
                type="button"
                onClick={
                  downloadAppBackup
                }
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 text-[10px] font-semibold text-text-primary transition hover:border-primary/30 hover:text-primary sm:h-11 sm:gap-2 sm:rounded-xl sm:px-5 sm:text-sm"
              >
                <Download size={16} />
                Ilki backup ýükle
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowClearConfirm(
                    true,
                  )
                }
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-danger/30 bg-danger/10 px-3 text-[10px] font-semibold text-danger transition hover:bg-danger/15 sm:h-11 sm:gap-2 sm:rounded-xl sm:px-5 sm:text-sm"
              >
                <Trash2 size={16} />
                Ähli maglumatlary arassala
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================
          BACKUP IMPORT CONFIRMATION
      ====================================== */}

      {showImportConfirm &&
        pendingBackupFile && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/10 text-warning">
                <DatabaseBackup
                  size={20}
                />
              </div>

              <h2 className="mt-4 text-xl font-bold text-text-primary">
                Backup-dan dikeltmek
                isleýärsiňmi?
              </h2>

              <p className="mt-3 text-sm leading-6 text-text-muted">
                Häzirki ýerli
                maglumatlaryň backup
                faýlyndaky maglumatlar
                bilen çalşyrylar. Bu
                amaly yzyna gaýtarmak
                mümkin bolmaz.
              </p>

              <div className="mt-4 rounded-xl border border-border bg-background/40 p-4">
                <p className="text-xs text-text-muted">
                  Saýlanan faýl
                </p>

                <p className="mt-1 break-all text-sm font-semibold text-text-primary">
                  {
                    pendingBackupFile.name
                  }
                </p>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowImportConfirm(
                      false,
                    );

                    setPendingBackupFile(
                      null,
                    );
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-semibold text-text-secondary transition hover:text-text-primary"
                >
                  Goýbolsun
                </button>

                <button
                  type="button"
                  onClick={
                    handleConfirmBackupImport
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-warning px-5 text-sm font-semibold text-slate-950 transition hover:opacity-90"
                >
                  <Upload size={16} />
                  Dikeltmegi tassykla
                </button>
              </div>
            </div>
          </div>
        )}

      {/* ======================================
          CLEAR ALL DATA CONFIRMATION
      ====================================== */}

      {showClearConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-danger/20 bg-surface p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <TriangleAlert size={22} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-text-primary">
              Ähli maglumatlary hakykatdan
              pozmak isleýärsiňmi?
            </h2>

            <p className="mt-3 text-sm leading-6 text-text-muted">
              Bu hereket yzyna
              gaýtarylmaýar.
              Maglumatlaryň gerek bolup
              biljekdigine ynamyň ýok
              bolsa, ilki backup ýükle.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setShowClearConfirm(
                    false,
                  )
                }
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-semibold text-text-secondary transition hover:text-text-primary"
              >
                Goýbolsun
              </button>

              <button
                type="button"
                onClick={
                  handleClearAllData
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-danger px-5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <Trash2 size={16} />
                Hawa, ähli maglumatlary
                poz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}