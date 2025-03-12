import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from '@core/locales/lang/en.json';
import vi from '@core/locales/lang/vi.json';

const resources = {
    en: { translation: en },
    vi: { translation: vi },
};

i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "vi",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;