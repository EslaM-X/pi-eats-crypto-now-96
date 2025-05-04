
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PiEatLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showEmoji?: boolean;
  textOnly?: boolean;
  piOnly?: boolean;
  showEat?: boolean;
  style?: 'default' | 'bold' | 'gradient' | 'mining';
}

const PiEatLogo: React.FC<PiEatLogoProps> = ({ 
  size = 'md', 
  className = '', 
  showEmoji = true,
  textOnly = false,
  piOnly = false,
  showEat = true,
  style = 'default'
}) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
  };
  
  if (textOnly) {
    return (
      <span className={`font-bold ${sizeClasses[size]} ${className}`}>
        {piOnly ? 'π' : isArabic ? 'بإيت' : 'πEat'}
      </span>
    );
  }

  const emojiSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };
  
  // Different style variations
  const styleVariants = {
    default: {
      container: "no-reverse",
      pi: "font-extrabold text-[#8B5CF6] pi-color",
      eat: "ml-0.5 bg-gradient-to-r from-[#9b87f5] to-orange bg-clip-text text-transparent",
      emoji: `absolute -top-1 -right-2 ${emojiSize[size]} bg-orange text-white rounded-full h-5 w-5 flex items-center justify-center transform rotate-12 border-2 border-white`
    },
    bold: {
      container: "no-reverse",
      pi: "font-black text-[#6E59A5] pi-color",
      eat: "ml-0.5 font-bold text-orange",
      emoji: `absolute -top-1 -right-2 ${emojiSize[size]} bg-orange text-white rounded-full h-5 w-5 flex items-center justify-center transform rotate-12 border-2 border-white`
    },
    gradient: {
      container: "no-reverse",
      pi: "font-extrabold text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#6E59A5] bg-clip-text",
      eat: "ml-0.5 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent font-bold",
      emoji: `absolute -top-1 -right-2 ${emojiSize[size]} bg-gradient-to-r from-orange to-orange-600 text-white rounded-full h-5 w-5 flex items-center justify-center transform rotate-12 border-2 border-white`
    },
    mining: {
      container: "bg-white/95 dark:bg-gray-800/95 py-1 px-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 no-reverse",
      pi: "font-black text-[#8B5CF6] pi-color drop-shadow-md",
      eat: "ml-0.5 font-extrabold text-orange drop-shadow-md",
      emoji: `absolute -top-1 -right-2 ${emojiSize[size]} bg-orange text-white rounded-full h-5 w-5 flex items-center justify-center transform rotate-12 border-2 border-white shadow-md`
    }
  };

  const currentStyle = styleVariants[style];

  // Create the Arabic version of the logo
  if (isArabic) {
    return (
      <div className={`font-bold ${sizeClasses[size]} flex items-center ${className} ${currentStyle.container}`}>
        <span className="relative">
          <span className={currentStyle.pi + " text-sm"}>بـِ</span>
          {showEmoji && (
            <span className={currentStyle.emoji}>
              🍕
            </span>
          )}
        </span>
        {showEat && <span className={currentStyle.eat + " text-sm"}>إيت</span>}
      </div>
    );
  }
  
  // English version
  return (
    <div className={`font-bold ${sizeClasses[size]} flex items-center ${className} ${currentStyle.container}`}>
      <span className="relative">
        <span className={currentStyle.pi}>π</span>
        {showEmoji && (
          <span className={currentStyle.emoji}>
            🍕
          </span>
        )}
      </span>
      {showEat && <span className={currentStyle.eat}>Eat</span>}
    </div>
  );
};

export default PiEatLogo;
