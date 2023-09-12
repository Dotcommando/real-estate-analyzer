import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

import { EN_I18N } from './i18n-translates/en.i18n';
import { RU_I18N } from './i18n-translates/ru.i18n';

const resources = {
  en: EN_I18N,
  ru: RU_I18N,
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
