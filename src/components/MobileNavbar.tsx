
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as mobileUtils from '@/utils/mobile';

/**
 * شريط تنقل خاص بالهاتف المحمول يعرض معلومات عن منصة التشغيل
 */
const MobileNavbar = () => {
  const location = useLocation();
  const [platformInfo, setPlatformInfo] = useState<string>('');
  
  useEffect(() => {
    // تحديد معلومات المنصة عند تحميل المكون
    setPlatformInfo(mobileUtils.getPlatformInfo());
  }, []);
  
  // عرض شريط التنقل فقط في صفحة التعدين
  if (location.pathname !== '/mining') {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-pi text-white z-50 p-2 text-center text-sm">
      {platformInfo} - {mobileUtils.isNativeMobile() 
        ? `Native App` 
        : `WebView - Use Export to Github to build native app`}
    </div>
  );
};

export default MobileNavbar;
