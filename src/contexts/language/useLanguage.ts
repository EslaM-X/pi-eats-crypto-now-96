
import { useContext } from 'react';
import { LanguageContext } from './LanguageContext';
import { LanguageContextType } from './types';

export const useLanguage = (): LanguageContextType => useContext(LanguageContext);
