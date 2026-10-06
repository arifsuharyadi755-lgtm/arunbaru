import React from 'react';
import { Bookmark, X, Trash2, ArrowRight } from 'lucide-react';
import { NewsArticle } from '../types/news';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedArticles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  onRemoveBookmark: (article: NewsArticle) => void;
  onClearAll: () => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  savedArticles,
  onSelectArticle,
  onRemoveBookmark,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-blue-600 fill-current" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
              Berita Tersimpan ({savedArticles.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        {savedArticles.length > 0 && (
          <div className="px-5 py-2 bg-slate-100/60 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              onClick={onClearAll}
              className="text-xs text-red-600 dark:text-red-400 font-medium hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Kosongkan Semua</span>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100 dark:divide-slate-800">
          {savedArticles.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-slate-400">
              <Bookmark className="w-8 h-8 mb-2 stroke-1" />
              <p className="text-sm font-medium">Belum ada berita yang disimpan</p>
              <p className="text-xs text-slate-400 mt-1">
                Klik ikon bookmark pada kartu berita untuk membacanya nanti.
              </p>
            </div>
          ) : (
            savedArticles.map((article) => (
              <div
                key={article.id}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group"
              >
                <div 
                  onClick={() => {
                    onSelectArticle(article);
                    onClose();
                  }}
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                >
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-12 rounded object-cover shrink-0 bg-slate-900"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                      {article.categoryName}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {article.title}
                    </h4>
                    <span className="text-[11px] text-slate-400">{article.publishedAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onRemoveBookmark(article)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Hapus dari daftar simpanan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onSelectArticle(article);
                      onClose();
                    }}
                    className="p-1.5 text-blue-600 hover:text-blue-800 transition-colors"
                    title="Buka berita"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
