import React, { useState } from 'react';
import { 
  PenTool, 
  Quote, 
  BookOpen, 
  ArrowRight, 
  Clock, 
  MessageSquare, 
  Sparkles, 
  UserCheck, 
  Send,
  Eye,
  Check
} from 'lucide-react';
import { NewsArticle } from '../types/news';
import { OPINION_COLUMNISTS } from '../data/opinionData';

interface OpinionColumnSectionProps {
  opinionArticles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  onOpenSubmitModal: () => void;
}

export const OpinionColumnSection: React.FC<OpinionColumnSectionProps> = ({
  opinionArticles,
  onSelectArticle,
  onOpenSubmitModal
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredArticles = activeFilter === 'all'
    ? opinionArticles
    : opinionArticles.filter(art => {
        if (activeFilter === 'politik') return art.category === 'politik';
        if (activeFilter === 'ekonomi') return art.category === 'ekonomi';
        if (activeFilter === 'budaya') return art.subCategory?.toLowerCase().includes('budaya') || art.subCategory?.toLowerCase().includes('sosial');
        if (activeFilter === 'teknologi') return art.subCategory?.toLowerCase().includes('teknologi') || art.subCategory?.toLowerCase().includes('sains');
        return true;
      });

  return (
    <section className="my-8 bg-gradient-to-b from-amber-50/50 via-white to-slate-50 dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-950 border border-amber-200/70 dark:border-amber-900/40 rounded-2xl p-5 sm:p-7 shadow-xs transition-colors">
      {/* Section Header (Signature Detik Kolom Style) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-amber-200/60 dark:border-slate-800">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#003875] to-[#004a99] text-amber-300 flex items-center justify-center shadow-md border border-amber-400/40 shrink-0">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-amber-400 text-slate-950 shadow-2xs">
                Kanal Opini & Esai
              </span>
              <span className="text-xs text-slate-500 font-serif italic hidden sm:inline">
                Ruang Gagasan & Analisis Intelektual
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 font-serif tracking-tight mt-0.5">
              Kolom & Refleksi Arun News
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
              Perspektif kritis, pemikiran independen, dan telaah mendalam dari para akademisi, pakar kebijakan, budayawan, dan masyarakat luas.
            </p>
          </div>
        </div>

        {/* Action Button: Kirim Tulisan */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenSubmitModal}
            className="w-full sm:w-auto px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5 fill-slate-950" />
            <span>Kirim Tulisan Opini</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="py-3 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar border-b border-slate-100 dark:border-slate-800/80 mb-5">
        <div className="flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap">
          {[
            { id: 'all', label: 'Semua Kolom' },
            { id: 'politik', label: 'Politik & Tata Negara' },
            { id: 'ekonomi', label: 'Ekonomi & Kesejahteraan' },
            { id: 'budaya', label: 'Sosial & Kebudayaan' },
            { id: 'teknologi', label: 'Sains & Masa Depan' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                activeFilter === tab.id
                  ? 'bg-[#004a99] text-amber-300 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-[11px] text-slate-400 font-serif italic hidden md:inline">
          {filteredArticles.length} Esai Pilihan
        </span>
      </div>

      {/* Featured Lead Op-Ed + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Lead Opinion (7 cols) */}
        {filteredArticles.length > 0 && (
          <div 
            onClick={() => onSelectArticle(filteredArticles[0])}
            className="lg:col-span-7 bg-white dark:bg-slate-850 border border-amber-200/80 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Author Strip */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-[#004a99] text-white flex items-center justify-center font-bold text-sm shadow-xs border-2 border-white dark:border-slate-800 shrink-0">
                  {filteredArticles[0].authorAvatar || 'OP'}
                </div>
                <div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-amber-300 transition-colors">
                    {filteredArticles[0].author}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                    {filteredArticles[0].authorRole || 'Kolumnis Arun News'}
                  </div>
                </div>
              </div>

              {/* Tag & Read Time */}
              <div className="flex items-center gap-2 text-[11px] text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider mb-2">
                <span>{filteredArticles[0].subCategory}</span>
                <span>·</span>
                <span className="text-slate-400 font-normal lowercase">{filteredArticles[0].readTime}</span>
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 font-serif leading-snug group-hover:text-[#004a99] dark:group-hover:text-amber-400 transition-colors mb-3">
                &ldquo;{filteredArticles[0].title}&rdquo;
              </h3>

              {/* Pull Quote Box */}
              {filteredArticles[0].pullQuote && (
                <div className="p-3.5 my-3 rounded-lg bg-amber-50/70 dark:bg-slate-800 border-l-4 border-amber-400 text-slate-800 dark:text-slate-200 text-xs italic font-serif leading-relaxed flex items-start gap-2">
                  <Quote className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 opacity-80" />
                  <span>{filteredArticles[0].pullQuote}</span>
                </div>
              )}

              {/* Summary */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                {filteredArticles[0].summary}
              </p>
            </div>

            {/* Bottom Meta & Read Action */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{filteredArticles[0].publishedAt}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>{filteredArticles[0].commentCount} tanggapan</span>
                </span>
              </div>

              <span className="font-bold text-[#004a99] dark:text-amber-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                <span>Baca Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        )}

        {/* Side Stack of Other Op-Eds (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          {filteredArticles.slice(1, 4).map((art) => (
            <div
              key={art.id}
              onClick={() => onSelectArticle(art)}
              className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400/80 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                  {art.authorAvatar || 'OP'}
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-amber-400 transition-colors block truncate">
                    {art.author}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {art.authorRole}
                  </span>
                </div>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 font-serif line-clamp-2 leading-snug group-hover:text-[#004a99] dark:group-hover:text-amber-300 transition-colors">
                {art.title}
              </h4>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                <span className="text-amber-700 dark:text-amber-400 font-semibold">{art.subCategory}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{art.publishedAt}</span>
                </span>
              </div>
            </div>
          ))}

          {/* Quick submission info banner */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-100/60 to-yellow-50 dark:from-slate-800 dark:to-slate-850 border border-amber-300/60 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <span className="font-bold block">Punya Analisis atau Gagasan?</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Redaksi Arun News membuka ruang publikasi esai berbobot.</span>
              </div>
            </div>
            <button
              onClick={onOpenSubmitModal}
              className="px-2.5 py-1 text-[11px] font-bold bg-[#004a99] text-amber-300 rounded-lg hover:bg-[#003875] transition-colors shrink-0"
            >
              Tulis Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* Featured Columnists Profiles Bar */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
            <span>Kolumnis Tetap & Kontributor Pakar</span>
          </span>
          <span className="text-[11px] text-slate-400">Arun Media Network</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {OPINION_COLUMNISTS.map(col => (
            <div 
              key={col.id}
              className="p-3 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center space-y-1.5 shadow-2xs hover:border-amber-400 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-[#004a99] dark:text-amber-300 font-extrabold text-sm mx-auto flex items-center justify-center border border-amber-300/40">
                {col.avatarText}
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {col.name}
              </div>
              <div className="text-[10px] text-slate-500 line-clamp-1">
                {col.title}
              </div>
              <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold pt-0.5">
                {col.articleCount} Artikel Terbit
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
