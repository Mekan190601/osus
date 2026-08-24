export type AppBackup = {
  version: 1;
  exportedAt: string;

  storage: Record<
    string,
    string
  >;
};

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

export function createAppBackup(): AppBackup {
  const storage: Record<
    string,
    string
  > = {};

  OSUS_STORAGE_KEYS.forEach(
    (key) => {
      const value =
        window.localStorage.getItem(
          key,
        );

      if (value !== null) {
        storage[key] = value;
      }
    },
  );

  return {
    version: 1,
    exportedAt:
      new Date().toISOString(),
    storage,
  };
}

export function downloadAppBackup() {
  const backup =
    createAppBackup();

  const json =
    JSON.stringify(
      backup,
      null,
      2,
    );

    

  const blob =
    new Blob(
      [json],
      {
        type: "application/json",
      },
    );

  const url =
    URL.createObjectURL(blob);

  const anchor =
    document.createElement("a");

  const date =
    new Date()
      .toISOString()
      .slice(0, 10);

  anchor.href = url;

  anchor.download =
    `osus-backup-${date}.json`;

  document.body.appendChild(
    anchor,
  );

  anchor.click();

  anchor.remove();

  URL.revokeObjectURL(url);
}

function isAppBackup(
  value: unknown,
): value is AppBackup {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const backup =
    value as Partial<AppBackup>;

  return (
    backup.version === 1 &&
    typeof backup.exportedAt ===
      "string" &&
    typeof backup.storage ===
      "object" &&
    backup.storage !== null
  );
}

export async function importAppBackup(
  file: File,
) {
  const text =
    await file.text();

  const parsed: unknown =
    JSON.parse(text);

  if (!isAppBackup(parsed)) {
    throw new Error(
      "Bu ÖSÜŞ backup faýly däl.",
    );
  }

  // Restore hakykatdanam "çalşyrmak" bolsun: öňki app maglumatlaryny
  // arassalap, soň backup-daky goldanylýan key-leri ýazýarys.
  OSUS_STORAGE_KEYS.forEach((key) => {
    window.localStorage.removeItem(key);
  });

  Object.entries(
    parsed.storage,
  ).forEach(
    ([key, value]) => {
      if (
        OSUS_STORAGE_KEYS.includes(
          key,
        ) &&
        typeof value ===
          "string"
      ) {
        window.localStorage.setItem(
          key,
          value,
        );
      }
    },
  );

  return parsed;
}