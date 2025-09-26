import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import ko from './locales/ko.json';
import en from './locales/en.json';

const resources = {
  ko: { translation: ko },
  en: { translation: en },
};

// 디바이스 언어 감지
const getDeviceLanguage = (): string => {
  const locale = Localization.getLocales()[0]?.languageTag || 'ko';
  const language = locale.split('-')[0]; // 'ko-KR' -> 'ko'

  // 지원하는 언어인지 확인
  return resources[language as keyof typeof resources] ? language : 'ko';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDeviceLanguage(),
    fallbackLng: 'ko',

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    debug: __DEV__, // 개발 모드에서만 디버그 로그
  });

export default i18n;