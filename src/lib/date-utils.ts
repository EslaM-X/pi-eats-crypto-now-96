
import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

/**
 * Formats a date with localization support
 * @param date The date to format
 * @param formatStr The date format string
 * @param locale The locale to use ('en' or 'ar')
 */
export function formatDate(date: Date | string, formatStr: string = 'PPP', locale: 'en' | 'ar' = 'en'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  return format(dateObj, formatStr, {
    locale: locale === 'ar' ? ar : enUS
  });
}

/**
 * Formats a date relative to now
 * @param date The date to format
 * @param locale The locale to use ('en' or 'ar')
 * @param addSuffix Whether to add a suffix/prefix indicating that the result is in the past/future
 */
export function formatRelative(date: Date | string, locale: 'en' | 'ar' = 'en', addSuffix = true): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  return formatDistanceToNow(dateObj, {
    locale: locale === 'ar' ? ar : enUS,
    addSuffix
  });
}

/**
 * Formats a date in a smart way (today, yesterday, or standard format)
 * @param date The date to format
 * @param locale The locale to use ('en' or 'ar')
 */
export function formatSmartDate(date: Date | string, locale: 'en' | 'ar' = 'en'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return locale === 'ar' ? 'اليوم' : 'Today';
  } else if (isYesterday(dateObj)) {
    return locale === 'ar' ? 'أمس' : 'Yesterday';
  } else {
    return formatDate(dateObj, 'PP', locale);
  }
}

/**
 * Formats a date and time
 * @param date The date to format
 * @param locale The locale to use ('en' or 'ar')
 */
export function formatDateTime(date: Date | string, locale: 'en' | 'ar' = 'en'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  return format(dateObj, 'PPp', {
    locale: locale === 'ar' ? ar : enUS
  });
}

/**
 * Formats a time
 * @param date The date to format
 * @param locale The locale to use ('en' or 'ar')
 */
export function formatTime(date: Date | string, locale: 'en' | 'ar' = 'en'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  return format(dateObj, 'p', {
    locale: locale === 'ar' ? ar : enUS
  });
}
