import React from 'react';
import { Megaphone, ExternalLink, Sparkles } from 'lucide-react';
import { AdSubmission } from '../types/advertising';

interface AdBannerSlotProps {
  type: 'leaderboard' | 'sidebar';
  customAd?: AdSubmission | null;
  onOpenAdvertise: () => void;
}

export const AdBannerSlot: React.FC<AdBannerSlotProps> = ({
  type,
  customAd,
  onOpenAdvertise
}) => {
  if (type === 'leaderboard') {
    return (
      <div className="w-full my-4">
        {/* Ad Meta Bar */}
        <div className="flex items-center justify-between px-1 mb-1 text-[10px] text-slate-400 font-mono">
          <span className="uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            Ruang Iklan Disponsori
          </span>
          <button
            onClick={onOpenAdvertise}
            className="text-blue-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-sans font-bold"
          >
            <span>Pasang Iklan di Sini</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Billboard Banner */}
        <div 
          onClick={onOpenAdvertise}
          className="cursor-pointer group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#002752] via-[#004a99] to-[#001c3d] text-white p-4 sm:p-5 border border-amber-400/30 hover:border-amber-400 shadow-sm transition-all"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <Megaphone className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                    {customAd?.brandName || 'PROMO RESMI'}
                  </span>
                  <span className="text-xs font-semibold text-blue-200">
                    {customAd ? 'Iklan Mitra Terverifikasi' : 'Jangkau 15 Juta+ Pembaca Arun News'}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-amber-300 transition-colors mt-0.5 leading-snug">
                  {customAd?.headline || 'Kembangkan Usaha Anda dengan Kampanye Iklan Digital di Portal Berita Arun News'}
                </h4>
                <p className="text-xs text-blue-100 line-clamp-1 mt-0.5 opacity-90">
                  {customAd?.description || 'Tingkatkan omzet dan kredibilitas bisnis Anda dengan penempatan banner dan artikel advertorial berstandar nasional.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-lg shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>{customAd ? 'Kunjungi Tautan' : 'Mulai Pasang Iklan'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar Rectangle Banner (300x250)
  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs overflow-hidden">
      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 font-mono">
        <span className="uppercase">Advertorial Mitra</span>
        <button
          onClick={onOpenAdvertise}
          className="text-blue-600 dark:text-amber-400 hover:underline font-sans font-bold"
        >
          Info Iklan
        </button>
      </div>

      <div 
        onClick={onOpenAdvertise}
        className="cursor-pointer group space-y-2.5"
      >
        <div className="w-full aspect-16/9 rounded-lg bg-gradient-to-br from-[#003875] via-[#004a99] to-indigo-950 p-4 flex flex-col justify-between text-white relative overflow-hidden group-hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
              {customAd?.brandName || 'SPONSORED'}
            </span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-black text-amber-300">
              {customAd?.brandName || 'Arun Media Network'}
            </div>
            <div className="text-[11px] text-white/90 line-clamp-1">
              {customAd?.headline || 'Solusi Promosi Digital Terpercaya'}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
            {customAd?.headline || 'Promosikan Brand & Produk Anda di Sini untuk Jangkau Pelanggan Tertarget'}
          </h4>
          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
            {customAd?.description || 'Dapatkan paket pasang iklan banner, advertorial berita, dan notifikasi dengan tarif bersahabat.'}
          </p>
        </div>

        <button
          type="button"
          className="w-full py-1.5 bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-amber-300 hover:bg-[#004a99] hover:text-amber-300 border border-blue-200 dark:border-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          <span>{customAd ? 'Buka Penawaran' : 'Pasang Iklan Sekarang'}</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
