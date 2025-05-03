
/**
 * مساعدات للكشف عن منصة التشغيل وتمكين الميزات الخاصة بالهاتف
 */
import { Capacitor } from '@capacitor/core';

/**
 * يتحقق مما إذا كان التطبيق يعمل على جهاز جوال حقيقي
 */
export const isNativeMobile = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * يتحقق مما إذا كان التطبيق يعمل على نظام iOS
 */
export const isIOS = (): boolean => {
  return isNativeMobile() && Capacitor.getPlatform() === 'ios';
};

/**
 * يتحقق مما إذا كان التطبيق يعمل على نظام Android
 */
export const isAndroid = (): boolean => {
  return isNativeMobile() && Capacitor.getPlatform() === 'android';
};

/**
 * يتحقق مما إذا كان التطبيق يعمل في المتصفح
 */
export const isWeb = (): boolean => {
  return Capacitor.getPlatform() === 'web';
};

/**
 * يحصل على اسم المنصة الحالية
 */
export const getPlatform = (): string => {
  return Capacitor.getPlatform();
};

/**
 * يعرض رسالة عن المنصة الحالية
 */
export const getPlatformInfo = (): string => {
  if (isNativeMobile()) {
    return `Running on ${Capacitor.getPlatform()}`;
  }
  return 'Running on web';
};
