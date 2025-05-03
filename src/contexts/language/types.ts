
export type Language = 'en' | 'ar';

export type TranslationKey = keyof typeof import('./translations').enTranslations;

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}
