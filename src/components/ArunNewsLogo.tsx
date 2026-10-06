import React, { useState, useEffect } from 'react';
import { LogoSettings, DEFAULT_LOGO_SETTINGS } from '../types/logoConfig';
import { logoService } from '../services/logoService';

interface ArunNewsLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  overrideSettings?: Partial<LogoSettings>;
}

export const ArunNewsLogo: React.FC<ArunNewsLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  overrideSettings
}) => {
  const [settings, setSettings] = useState<LogoSettings>(() => {
    return { ...logoService.getSettings(), ...overrideSettings };
  });

  useEffect(() => {
    if (overrideSettings) {
      setSettings(prev => ({ ...prev, ...overrideSettings }));
      return;
    }
    const unsubscribe = logoService.onSettingsChange((newSettings) => {
      setSettings(newSettings);
    });
    return () => unsubscribe();
  }, [overrideSettings]);

  const sizeClasses = {
    sm: {
      arun: 'text-xl sm:text-2xl',
      news: 'text-xl sm:text-2xl',
      dot: 'w-2 h-2',
      crown: 'w-3 h-3 -top-2 left-0.5',
      underline: 'max-w-[100px] h-0.5',
      tagline: 'text-[9px] -mt-0.5'
    },
    md: {
      arun: 'text-2xl sm:text-3xl md:text-3xl',
      news: 'text-2xl sm:text-3xl md:text-3xl',
      dot: 'w-2.5 h-2.5',
      crown: 'w-3.5 h-3.5 -top-2.5 left-1',
      underline: 'max-w-[130px] h-1',
      tagline: 'text-[10px] -mt-0.5'
    },
    lg: {
      arun: 'text-3xl sm:text-4xl',
      news: 'text-3xl sm:text-4xl',
      dot: 'w-3 h-3',
      crown: 'w-4 h-4 -top-3 left-1.5',
      underline: 'max-w-[155px] h-1',
      tagline: 'text-[11px] mt-0.5'
    },
    xl: {
      arun: 'text-4xl sm:text-5xl',
      news: 'text-4xl sm:text-5xl',
      dot: 'w-3.5 h-3.5',
      crown: 'w-5 h-5 -top-3.5 left-2',
      underline: 'max-w-[190px] h-1.5',
      tagline: 'text-xs mt-1'
    }
  }[size];

  // Theme color styling
  const getColorStyles = () => {
    switch (settings.colorTheme) {
      case 'cyan_electric':
        return {
          newsGradient: 'from-cyan-300 via-sky-300 to-blue-400',
          newsShadow: 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.7))',
          crownColor: 'text-cyan-300',
          dotBg: 'from-cyan-300 to-sky-400 shadow-[0_0_12px_#38bdf8]',
          underlineColor: 'text-cyan-300',
          taglineColor: 'text-cyan-200',
          arun3dShadow: '0 1px 0 #94a3b8, 0 2px 0 #64748b, 0 3px 0 #475569, 0 4px 1px rgba(0,0,0,0.65), 0 0 12px rgba(255,255,255,0.95), 0 0 24px rgba(186,230,253,0.8), 0 0 40px rgba(56,189,248,0.55)',
          news3dShadow: '0 1px 0 #0284c7, 0 2px 0 #0369a1, 0 3px 0 #075985, 0 4px 1px rgba(0,0,0,0.65), 0 0 14px rgba(56,189,248,0.95), 0 0 28px rgba(14,165,233,0.85), 0 0 45px rgba(2,132,199,0.65)',
          tagline3dShadow: '0 1px 2px rgba(0,0,0,0.9), 0 0 8px rgba(56,189,248,0.9), 0 0 16px rgba(14,165,233,0.6)'
        };
      case 'flame_red':
        return {
          newsGradient: 'from-rose-400 via-amber-300 to-orange-400',
          newsShadow: 'drop-shadow(0 0 10px rgba(244, 63, 94, 0.7))',
          crownColor: 'text-amber-400',
          dotBg: 'from-rose-400 to-amber-400 shadow-[0_0_12px_#fb7185]',
          underlineColor: 'text-amber-400',
          taglineColor: 'text-amber-200',
          arun3dShadow: '0 1px 0 #94a3b8, 0 2px 0 #64748b, 0 3px 0 #475569, 0 4px 1px rgba(0,0,0,0.65), 0 0 12px rgba(255,255,255,0.95), 0 0 24px rgba(254,205,211,0.8), 0 0 40px rgba(244,63,94,0.55)',
          news3dShadow: '0 1px 0 #e11d48, 0 2px 0 #be123c, 0 3px 0 #9f1239, 0 4px 1px rgba(0,0,0,0.65), 0 0 14px rgba(251,113,133,0.95), 0 0 28px rgba(244,63,94,0.85), 0 0 45px rgba(225,29,72,0.65)',
          tagline3dShadow: '0 1px 2px rgba(0,0,0,0.9), 0 0 8px rgba(251,113,133,0.9), 0 0 16px rgba(244,63,94,0.6)'
        };
      case 'emerald_green':
        return {
          newsGradient: 'from-emerald-300 via-teal-300 to-amber-300',
          newsShadow: 'drop-shadow(0 0 10px rgba(52, 211, 153, 0.7))',
          crownColor: 'text-emerald-300',
          dotBg: 'from-emerald-300 to-teal-400 shadow-[0_0_12px_#34d399]',
          underlineColor: 'text-emerald-300',
          taglineColor: 'text-emerald-200',
          arun3dShadow: '0 1px 0 #94a3b8, 0 2px 0 #64748b, 0 3px 0 #475569, 0 4px 1px rgba(0,0,0,0.65), 0 0 12px rgba(255,255,255,0.95), 0 0 24px rgba(167,243,208,0.8), 0 0 40px rgba(52,211,153,0.55)',
          news3dShadow: '0 1px 0 #059669, 0 2px 0 #047857, 0 3px 0 #065f46, 0 4px 1px rgba(0,0,0,0.65), 0 0 14px rgba(52,211,153,0.95), 0 0 28px rgba(16,185,129,0.85), 0 0 45px rgba(5,150,105,0.65)',
          tagline3dShadow: '0 1px 2px rgba(0,0,0,0.9), 0 0 8px rgba(52,211,153,0.9), 0 0 16px rgba(16,185,129,0.6)'
        };
      case 'amber_gold':
      default:
        return {
          newsGradient: 'from-amber-300 via-yellow-300 to-amber-400',
          newsShadow: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.65))',
          crownColor: 'text-amber-300',
          dotBg: 'from-amber-300 to-yellow-400 shadow-[0_0_12px_#facc15]',
          underlineColor: 'text-amber-300',
          taglineColor: 'text-amber-200',
          arun3dShadow: '0 1px 0 #94a3b8, 0 2px 0 #64748b, 0 3px 0 #475569, 0 4px 1px rgba(0,0,0,0.65), 0 0 12px rgba(255,255,255,0.95), 0 0 25px rgba(186,230,253,0.8), 0 0 40px rgba(56,189,248,0.55)',
          news3dShadow: '0 1px 0 #d97706, 0 2px 0 #b45309, 0 3px 0 #92400e, 0 4px 1px rgba(0,0,0,0.65), 0 0 14px rgba(254,240,138,0.95), 0 0 28px rgba(250,204,21,0.85), 0 0 48px rgba(245,158,11,0.7)',
          tagline3dShadow: '0 1px 2px rgba(0,0,0,0.9), 0 0 8px rgba(253,224,71,0.9), 0 0 16px rgba(234,179,8,0.6)'
        };
    }
  };

  const colors = getColorStyles();
  const arunText = settings.textArun || 'ARUN';
  const newsText = settings.textNews || 'NEWS';
  const taglineText = settings.tagline || 'Jembatan Informasi Nusantara';

  // Render Custom Uploaded Image
  if (settings.style === 'custom_image' && settings.customImageUrl) {
    return (
      <div className={`inline-flex flex-col select-none group ${className}`}>
        <div className="flex items-center gap-2">
          <img 
            src={settings.customImageUrl} 
            alt="Arun News Logo" 
            className="h-8 sm:h-9 object-contain drop-shadow-md rounded"
            onError={(e) => {
              // fallback if invalid image
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex flex-col">
            <span className="font-bold text-white text-base tracking-tight leading-none">
              {arunText} <span className="text-amber-300">{newsText}</span>
            </span>
            {showSubtitle && settings.showTagline && (
              <span className={`text-[10px] font-sans font-medium tracking-wide ${colors.taglineColor} mt-0.5`}>
                {taglineText}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render Based on Chosen Style
  return (
    <div className={`inline-flex flex-col select-none group ${className}`}>
      {/* 1. Main Lockup */}
      <div className="relative inline-flex items-baseline tracking-normal">
        {/* Crown Accent (if enabled) */}
        {settings.showCrown && (
          settings.style === 'graffiti_3d_glow' || 
          settings.style === 'graffiti_modern' || 
          settings.style === 'graffiti_tag' || 
          settings.style === 'calligraphy_brush'
        ) && (
          <span 
            aria-hidden="true"
            className={`absolute ${sizeClasses.crown} ${colors.crownColor} opacity-95 -rotate-12 transition-transform group-hover:scale-110 pointer-events-none drop-shadow-[0_0_8px_rgba(250,204,21,0.85)]`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              <path d="M2.5 19h19a.5.5 0 0 0 .5-.5V14l-4.5 2.5L12 8l-5.5 8.5L2 14v4.5a.5.5 0 0 0 .5.5z" />
            </svg>
          </span>
        )}

        {/* STYLE 1: GRAFFITI 3D MENYALA (SIGNATURE DEFAULT) */}
        {settings.style === 'graffiti_3d_glow' && (
          <div className="inline-flex items-baseline">
            <span 
              className={`font-graffiti font-extrabold text-white tracking-wider -rotate-1 ${sizeClasses.arun} transition-transform group-hover:scale-[1.03] inline-block`}
              style={{ 
                textShadow: colors.arun3dShadow,
                letterSpacing: '0.06em'
              }}
            >
              {arunText}
            </span>
            <span 
              className={`font-graffiti font-extrabold text-amber-300 ml-1.5 rotate-1 ${sizeClasses.news} transition-transform group-hover:scale-[1.04] inline-block`}
              style={{ 
                textShadow: colors.news3dShadow,
                letterSpacing: '0.05em'
              }}
            >
              {newsText}
            </span>
          </div>
        )}

        {/* STYLE A: GRAFFITI MODERN ELEGAN */}
        {settings.style === 'graffiti_modern' && (
          <div className="inline-flex items-baseline">
            <span 
              className={`font-graffiti font-normal text-white tracking-wide -rotate-1 drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)] ${sizeClasses.arun} transition-transform group-hover:scale-[1.02] inline-block`}
              style={{ 
                textShadow: colors.arun3dShadow,
                letterSpacing: '0.04em' 
              }}
            >
              {arunText}
            </span>
            <span 
              className={`font-graffiti font-normal text-transparent bg-clip-text bg-gradient-to-br ${colors.newsGradient} ml-1.5 rotate-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] ${sizeClasses.news} transition-transform group-hover:scale-[1.03] inline-block`}
              style={{ 
                filter: colors.newsShadow,
                textShadow: colors.news3dShadow,
                letterSpacing: '0.03em'
              }}
            >
              {newsText}
            </span>
          </div>
        )}

        {/* STYLE B: GRAFFITI STREET TAG */}
        {settings.style === 'graffiti_tag' && (
          <>
            <span 
              className={`font-graffiti-tag font-bold text-white tracking-wider -rotate-2 drop-shadow-[0_3px_2px_rgba(0,0,0,0.7)] ${sizeClasses.arun} transition-transform group-hover:skew-x-2`}
            >
              {arunText}
            </span>
            <span 
              className={`font-graffiti-tag font-bold text-transparent bg-clip-text bg-gradient-to-r ${colors.newsGradient} ml-2 rotate-2 ${sizeClasses.news}`}
              style={{ filter: colors.newsShadow }}
            >
              {newsText}
            </span>
          </>
        )}

        {/* STYLE C: EDITORIAL MODERN BOLD */}
        {settings.style === 'editorial_bold' && (
          <>
            <span className={`font-sans font-black text-white tracking-tighter uppercase ${sizeClasses.arun}`}>
              {arunText}
            </span>
            <span className={`font-sans font-black text-transparent bg-clip-text bg-gradient-to-r ${colors.newsGradient} tracking-tighter uppercase ml-1 ${sizeClasses.news}`}>
              {newsText}
            </span>
          </>
        )}

        {/* STYLE D: KUAS KALIGRAFI NUSANTARA */}
        {settings.style === 'calligraphy_brush' && (
          <>
            <span className={`font-serif italic font-extrabold text-white tracking-wide ${sizeClasses.arun}`}>
              {arunText}
            </span>
            <span className={`font-serif italic font-black text-transparent bg-clip-text bg-gradient-to-r ${colors.newsGradient} ml-1.5 ${sizeClasses.news}`}>
              {newsText}
            </span>
          </>
        )}

        {/* STYLE E: NEON GLOW CYBER */}
        {settings.style === 'neon_glow' && (
          <>
            <span 
              className={`font-sans font-extrabold text-white tracking-tight ${sizeClasses.arun}`}
              style={{ textShadow: '0 0 10px rgba(255,255,255,0.7), 0 0 20px rgba(56,189,248,0.5)' }}
            >
              {arunText}
            </span>
            <span 
              className={`font-sans font-black text-amber-300 ml-1.5 ${sizeClasses.news}`}
              style={{ textShadow: '0 0 10px #facc15, 0 0 25px rgba(251,191,36,0.8)' }}
            >
              {newsText}
            </span>
          </>
        )}

        {/* Dynamic Spray Dot */}
        <span 
          className={`relative ${sizeClasses.dot} rounded-full bg-gradient-to-r ${colors.dotBg} ml-1 mb-1 inline-block animate-pulse`}
          aria-hidden="true"
        />
      </div>

      {/* Modern Street Dynamic Brush Underline Stroke */}
      {settings.showUnderline && settings.style !== 'editorial_bold' && (
        <div className={`relative -mt-1 h-1 w-full ${sizeClasses.underline} overflow-hidden opacity-90 pointer-events-none`}>
          <svg 
            viewBox="0 0 100 8" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`w-full h-full ${colors.underlineColor} drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]`}
            preserveAspectRatio="none"
          >
            <path 
              d="M2 5.5 C 25 2.5, 60 7, 98 3.5 C 75 5, 40 6.5, 2 5.5 Z" 
              fill="currentColor" 
            />
          </svg>
        </div>
      )}

      {/* Official Tagline: Jembatan Informasi Nusantara (Huruf 3D Menyala) */}
      {showSubtitle && settings.showTagline && (
        <div className="flex items-center gap-1.5 mt-0.5 overflow-hidden">
          <span 
            className={`font-sans font-extrabold tracking-widest uppercase ${colors.taglineColor} ${sizeClasses.tagline} inline-block`}
            style={{ 
              textShadow: colors.tagline3dShadow,
              letterSpacing: '0.12em'
            }}
          >
            {taglineText}
          </span>
        </div>
      )}
    </div>
  );
};
