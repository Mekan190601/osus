import { useSettingsStore } from "../store/settingsStore";
import { getTranslations } from "../features/i18n/translations";

export function useTranslation() {
  const language = useSettingsStore(
    (state) => state.language,
  );

  const t = getTranslations(language);

  return {
    language,
    t,
  };
}