import React from 'react';
import { Clock, Eye, MessageSquare, Bookmark, Share2 } from 'lucide-react';
import { NewsArticle } from '../types/news';

interface LeadStoryHeroProps {
  leadArticle: NewsArticle;
  subLeadArticles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  onShare: (article: NewsArticle) => void;
}

export const LeadStoryHero: React.FC<LeadStoryHeroProps> = ({
  leadArticle,
  subLeadArticles,
  onSelectArticle,
  isBookmarked,
  onToggleBookmark,
  onShare
}) => {
  if (!leadArticle) return null;

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Main Lead Story (Left 8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between">
          <div>
            {/* Visual Frame */}
            <div 
              onClick={() => onSelectArticle(leadArticle)}
              className="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer"
            >
              <img
                src={leadArticle.imageUrl}
                alt={leadArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />
              
              {/* Overlay Meta on Hero Image */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white pointer-events-none">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">
                  <span className="text-amber-300 font-bold">{leadArticle.categoryName}</span>
                  <span aria-hidden="true">·</span>
                  <span>{leadArticle.subCategory}</span>
                  {leadArticle.isBreaking && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black tracking-widest shadow-xs">
                        BREAKING
                      </span>
                    </>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug drop-shadow-xs line-clamp-2">
                  {leadArticle.title}
                </h1>
              </div>
            </div>

            {/* Narrative Deck & Description */}
            <div className="p-4 sm:p-6">
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {leadArticle.summary}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                {leadArticle.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold text-blue-700 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Clean Unboxed Metadata Bottom Bar */}
          <div className="px-4 sm:px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{leadArticle.author}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
                <span>{leadArticle.publishedAt}</span>
              </span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span className="hidden sm:flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span className="tabular-nums">{leadArticle.viewsCount.toLocaleString('id-ID')}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="tabular-nums">{leadArticle.commentCount}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleBookmark(leadArticle)}
                className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  isBookmarked(leadArticle.id) ? 'text-amber-500' : 'text-slate-400'
                }`}
                title={isBookmarked(leadArticle.id) ? 'Hapus dari simpanan' : 'Simpan berita'}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={() => onShare(leadArticle)}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
                title="Bagikan"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sub-Lead Stories Column (Right 4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5 pb-1 border-b border-slate-200 dark:border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-xs" />
            <span>Sorotan Utama Pilihan Redaksi</span>
          </div>

          {subLeadArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between flex-1"
            >
              <div>
                <div 
                  onClick={() => onSelectArticle(article)}
                  className="aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer relative"
                >
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-[#004a99] text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                    {article.categoryName}
                  </div>
                </div>

                <div className="p-3.5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
                    <span className="font-semibold text-blue-700 dark:text-amber-400">{article.subCategory}</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.publishedAt}</span>
                  </div>
                  <h3 
                    onClick={() => onSelectArticle(article)}
                    className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-amber-400 transition-colors leading-snug line-clamp-2 cursor-pointer"
                  >
                    {article.title}
                  </h3>
                </div>
              </div>

              <div className="px-3.5 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span className="tabular-nums">{article.viewsCount.toLocaleString('id-ID')}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span className="tabular-nums">{article.commentCount}</span>
                  </span>
                </div>

                <button
                  onClick={() => onToggleBookmark(article)}
                  className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                    isBookmarked(article.id) ? 'text-amber-500' : 'text-slate-400'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
