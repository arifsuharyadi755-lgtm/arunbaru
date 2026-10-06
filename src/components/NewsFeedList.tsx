import React, { useState } from 'react';
import { Clock, Eye, MessageSquare, Bookmark, Share2, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { NewsArticle } from '../types/news';

interface NewsFeedListProps {
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  onShare: (article: NewsArticle) => void;
  selectedCategoryName: string;
  selectedSubcategory: string;
  searchQuery: string;
}

export const NewsFeedList: React.FC<NewsFeedListProps> = ({
  articles,
  onSelectArticle,
  isBookmarked,
  onToggleBookmark,
  onShare,
  selectedCategoryName,
  selectedSubcategory,
  searchQuery
}) => {
  const [activeTab, setActiveTab] = useState<'terbaru' | 'terpopuler' | 'editor'>('terbaru');
  const [visibleCount, setVisibleCount] = useState(8);

  // Sorting
  const sortedArticles = [...articles].sort((a, b) => {
    if (activeTab === 'terpopuler') {
      return b.viewsCount - a.viewsCount;
    }
    if (activeTab === 'editor') {
      return (b.isEditorPick ? 1 : 0) - (a.isEditorPick ? 1 : 0);
    }
    return b.timestamp - a.timestamp;
  });

  const displayedArticles = sortedArticles.slice(0, visibleCount);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6 shadow-xs">
      {/* Section Header & Feed Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Berita {selectedCategoryName}</span>
            {selectedSubcategory && selectedSubcategory !== 'Semua' && (
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-[#004a99] dark:text-amber-300 border border-amber-400/40">
                {selectedSubcategory}
              </span>
            )}
          </h2>
          {searchQuery && (
            <p className="text-xs text-slate-500 mt-0.5">
              Menampilkan hasil untuk: &quot;<span className="font-semibold text-slate-800 dark:text-slate-200">{searchQuery}</span>&quot; ({articles.length} berita ditemukan)
            </p>
          )}
        </div>

        {/* Feed Sorting Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveTab('terbaru')}
            className={`px-3 py-1.5 font-bold rounded-md transition-colors ${
              activeTab === 'terbaru'
                ? 'bg-[#004a99] text-amber-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Terbaru
          </button>
          <button
            onClick={() => setActiveTab('terpopuler')}
            className={`px-3 py-1.5 font-bold rounded-md transition-colors ${
              activeTab === 'terpopuler'
                ? 'bg-[#004a99] text-amber-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Terpopuler
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 font-bold rounded-md transition-colors ${
              activeTab === 'editor'
                ? 'bg-[#004a99] text-amber-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Pilihan Editor
          </button>
        </div>
      </div>

      {/* Articles Feed */}
      {displayedArticles.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
            Tidak ada berita yang sesuai dengan kriteria filter saat ini.
          </p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
          {displayedArticles.map((article) => (
            <article
              key={article.id}
              className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 sm:gap-5 group"
            >
              {/* Thumbnail */}
              <div 
                onClick={() => onSelectArticle(article)}
                className="w-full sm:w-48 sm:h-32 aspect-video sm:aspect-auto rounded-lg overflow-hidden bg-slate-900 shrink-0 cursor-pointer relative"
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

              {/* Text Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-1.5">
                    <span className="font-semibold text-blue-700 dark:text-amber-400">{article.subCategory}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-600 dark:text-amber-400" />
                      <span>{article.publishedAt}</span>
                    </span>
                    <span aria-hidden="true" className="hidden md:inline">·</span>
                    <span className="hidden md:inline font-mono">{article.readTime} baca</span>
                  </div>

                  <h3
                    onClick={() => onSelectArticle(article)}
                    className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-amber-400 transition-colors leading-snug line-clamp-2 cursor-pointer mb-2"
                  >
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {article.summary}
                  </p>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-600 dark:text-slate-300">{article.author}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span className="tabular-nums font-mono">{article.viewsCount.toLocaleString('id-ID')}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="tabular-nums font-mono">{article.commentCount}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleBookmark(article)}
                      className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                        isBookmarked(article.id) ? 'text-amber-500' : 'text-slate-400'
                      }`}
                      title={isBookmarked(article.id) ? 'Hapus' : 'Simpan'}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <button
                      onClick={() => onShare(article)}
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
                      title="Bagikan"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < sortedArticles.length && (
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="px-6 py-2.5 bg-blue-50 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-[#004a99] dark:text-amber-300 border border-blue-200 dark:border-blue-900 text-xs sm:text-sm font-bold rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            <span>Muat Lebih Banyak Berita</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
