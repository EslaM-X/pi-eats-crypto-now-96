
import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // التحقق عند التحميل
    checkIfMobile();

    // إضافة مستمع للتغييرات في حجم النافذة
    window.addEventListener('resize', checkIfMobile);
    
    // تنظيف المستمع عند إزالة المكون
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // التحقق مما إذا كان العرض يناسب الأجهزة المحمولة
  function checkIfMobile() {
    setIsMobile(window.innerWidth < 768);
  }

  return isMobile;
}
