import React from 'react';
import { Coffee, Heart } from 'lucide-react';
import { CATEGORIES } from '../data/newsData';
import { CategoryId } from '../types/news';
import { ArunNewsLogo } from './ArunNewsLogo';

interface FooterProps {
  onSelectCategory: (id: CategoryId) => void;
  onOpenAdvertise?: () => void;
  onOpenCoffeeModal?: () => void;
  onOpenLogoCustomizer?: () => void;
  onOpenEditorialAdmin?: (tab?: 'logo' | 'redaksi' | 'announcement') => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onSelectCategory, 
  onOpenAdvertise, 
  onOpenCoffeeModal,
  onOpenLogoCustomizer,
  onOpenEditorialAdmin
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-10 pb-8 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Brand & Subportal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <ArunNewsLogo size="md" />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Jembatan Informasi Nusantara menyajikan liputan komprehensif, investigasi independen, politik, ekonomi, opini publik, dan inovasi teknologi secara faktual dan berimbang.
            </p>
            <div className="pt-1 text-[11px] text-slate-500">
              Media Jurnalistik Digital Nusantara · Pedoman Pemberitaan Media Siber & Kode Etik Jurnalistik.
            </div>

            {/* Saweran Kopi Button */}
            <div className="pt-3 flex flex-wrap items-center gap-2">
              {onOpenCoffeeModal && (
                <button
                  onClick={onOpenCoffeeModal}
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all group"
                >
                  <Coffee className="w-4 h-4 fill-slate-950 group-hover:scale-110 transition-transform" />
                  <span>Saweran Kopi</span>
                  <span className="bg-amber-300/80 text-[10px] px-1.5 py-0.2 rounded font-extrabold ml-0.5">Dukung Redaksi</span>
                </button>
              )}
            </div>
          </div>

          {/* Col 2: Kanal Berita Utama */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Kanal Berita Utama
            </h4>
            <ul className="space-y-1.5 text-xs">
              {CATEGORIES.slice(1, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="hover:text-amber-300 transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Kanal Khusus & Layanan Warga */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Kanal Khusus & Warga
            </h4>
            <ul className="space-y-1.5 text-xs">
              {CATEGORIES.slice(5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="hover:text-amber-300 transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Informasi & Kebijakan */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Layanan & Info
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#pedoman" className="hover:text-white transition-colors">Pedoman Media Siber</a></li>
              <li>
                <button 
                  onClick={() => onOpenEditorialAdmin ? onOpenEditorialAdmin('redaksi') : onOpenLogoCustomizer?.()}
                  className="hover:text-white transition-colors text-left"
                >
                  Struktur Redaksi
                </button>
              </li>
              <li><a href="#tentang" className="hover:text-white transition-colors">Tentang Kami</a></li>
              <li><a href="#karir" className="hover:text-white transition-colors">Karir & Rekrutmen</a></li>
              <li>
                <button 
                  onClick={onOpenAdvertise} 
                  className="hover:text-amber-300 text-left transition-colors font-medium text-slate-300"
                >
                  Pasang Iklan Media
                </button>
              </li>
              {onOpenCoffeeModal && (
                <li>
                  <button 
                    onClick={onOpenCoffeeModal} 
                    className="text-amber-400 hover:text-amber-300 text-left transition-colors font-bold flex items-center gap-1.5"
                  >
                    <Coffee className="w-3.5 h-3.5 fill-current" />
                    <span>Saweran Kopi Redaksi</span>
                  </button>
                </li>
              )}
              <li><a href="#privasi" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            Copyright © {new Date().getFullYear()} Arun News. Hak cipta dilindungi undang-undang.
          </div>
          <div className="flex items-center gap-3">
            {onOpenCoffeeModal && (
              <button
                onClick={onOpenCoffeeModal}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 hover:bg-amber-400 hover:text-slate-950 border border-amber-400/40 transition-colors font-bold text-[11px]"
              >
                <Coffee className="w-3 h-3" />
                <span>☕ Saweran Kopi</span>
              </button>
            )}
            <span>·</span>
            <span>Sistem Notifikasi Berita Nusantara</span>
            <span>·</span>
            <span>Arun News Digital 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
