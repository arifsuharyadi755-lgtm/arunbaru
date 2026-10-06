import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  Eye, 
  Share2, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  ThumbsUp, 
  ThumbsDown, 
  Send, 
  Check, 
  Copy, 
  MessageSquare,
  Type,
  ArrowLeft
} from 'lucide-react';
import { NewsArticle, UserComment } from '../types/news';
import { INITIAL_COMMENTS } from '../data/newsData';

interface ArticleDetailModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  onSelectRelatedArticle: (article: NewsArticle) => void;
  relatedArticles: NewsArticle[];
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (article: NewsArticle) => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
  onSelectRelatedArticle,
  relatedArticles,
  isBookmarked,
  onToggleBookmark
}) => {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [comments, setComments] = useState<UserComment[]>([]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // Load comments
  useEffect(() => {
    if (!article) return;
    try {
      const stored = localStorage.getItem(`detik_comments_${article.id}`);
      if (stored) {
        setComments(JSON.parse(stored));
      } else {
        setComments(INITIAL_COMMENTS[article.id] || [
          {
            id: `c-default-${article.id}`,
            articleId: article.id,
            author: 'Pembaca Setia',
            avatar: 'PS',
            timestamp: '1 jam lalu',
            text: 'Informasi yang sangat mendalam dan berbobot. Semoga berdampak positif untuk kemajuan bangsa.',
            upvotes: 14,
            downvotes: 0
          }
        ]);
      }
    } catch {
      // fallback
    }
  }, [article]);

  // Stop audio on close or unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!article) return null;

  // Audio reader (Indonesian SpeechSynthesis)
  const handleToggleAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Fitur Text-to-Speech tidak didukung pada browser ini.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `${article.title}. ${article.summary}. ${article.content.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'id-ID';
    utterance.rate = 1.0;
    
    // Pick Indonesian voice if available
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.startsWith('id') || v.lang.includes('ID'));
    if (idVoice) utterance.voice = idVoice;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleShareWA = () => {
    const text = encodeURIComponent(`${article.title}\n\nBaca selengkapnya di Arun News:\n${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const authorName = newCommentName.trim() || 'Pembaca Anonim';
    const initials = authorName.substring(0, 2).toUpperCase();

    const newComment: UserComment = {
      id: `comm-${Date.now()}`,
      articleId: article.id,
      author: authorName,
      avatar: initials,
      timestamp: 'Baru saja',
      text: newCommentText.trim(),
      upvotes: 0,
      downvotes: 0
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    setNewCommentText('');
    setNewCommentName('');

    try {
      localStorage.setItem(`detik_comments_${article.id}`, JSON.stringify(updated));
    } catch {
      // storage error
    }
  };

  const handleVoteComment = (commentId: string, type: 'up' | 'down') => {
    const updated = comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          upvotes: type === 'up' ? c.upvotes + 1 : c.upvotes,
          downvotes: type === 'down' ? c.downvotes + 1 : c.downvotes
        };
      }
      return c;
    });
    setComments(updated);
    try {
      localStorage.setItem(`detik_comments_${article.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const fontClass = 
    fontSize === 'sm' ? 'text-sm leading-relaxed' :
    fontSize === 'lg' ? 'text-lg leading-loose' :
    'text-base leading-relaxed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 w-full sm:max-w-4xl h-full sm:h-[94vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
      >
        {/* Sticky Top Reader Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali</span>
            </button>
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-md">
              <span className="font-bold text-blue-600 dark:text-blue-400">{article.categoryName}</span>
              <span className="mx-1.5">/</span>
              <span>{article.subCategory}</span>
            </div>
          </div>

          {/* Quick Reader Controls */}
          <div className="flex items-center gap-2">
            {/* Font Resizer */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
              <Type className="w-3.5 h-3.5 text-slate-400 mx-1" />
              <button
                onClick={() => setFontSize('sm')}
                className={`px-1.5 py-0.5 rounded font-bold ${fontSize === 'sm' ? 'bg-white dark:bg-slate-700 text-blue-600' : 'text-slate-500'}`}
                title="Ukuran Huruf Kecil"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-1.5 py-0.5 rounded font-bold ${fontSize === 'base' ? 'bg-white dark:bg-slate-700 text-blue-600' : 'text-slate-500'}`}
                title="Ukuran Huruf Normal"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-1.5 py-0.5 rounded font-bold ${fontSize === 'lg' ? 'bg-white dark:bg-slate-700 text-blue-600' : 'text-slate-500'}`}
                title="Ukuran Huruf Besar"
              >
                A+
              </button>
            </div>

            {/* Audio Reader */}
            <button
              onClick={handleToggleAudio}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isPlayingAudio 
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-xs animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
              }`}
              title="Dengarkan Berita (Suara Bahasa Indonesia)"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-slate-950" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
              <span className="hidden md:inline">{isPlayingAudio ? 'Hentikan' : 'Dengarkan'}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => onToggleBookmark(article)}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked(article.id)
                  ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
              title="Simpan Berita"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Reader Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-2xl mx-auto">
            {/* Category kicker */}
            <div className="flex items-center gap-2 text-xs font-bold text-[#004a99] dark:text-amber-400 uppercase tracking-widest mb-3">
              {article.isOpinion ? (
                <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded tracking-normal shadow-xs">
                  KOLOM OPINI & ESAI
                </span>
              ) : (
                <span>{article.categoryName}</span>
              )}
              <span aria-hidden="true">·</span>
              <span>{article.subCategory}</span>
              {article.isBreaking && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded tracking-normal shadow-xs">
                  BREAKING NEWS
                </span>
              )}
            </div>

            {/* Author Profile Banner for Op-Ed */}
            {article.isOpinion && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-[#004a99] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                  {article.authorAvatar || 'OP'}
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900 dark:text-slate-100">
                    {article.author}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {article.authorRole || 'Kolumnis Arun News'}
                  </div>
                </div>
              </div>
            )}

            {/* Headline */}
            <h1 className={`text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-snug tracking-tight mb-4 ${article.isOpinion ? 'font-serif' : ''}`} style={{ textWrap: 'balance' }}>
              {article.title}
            </h1>

            {/* Meta Row: Author, Date, Stats */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex-wrap gap-2 mb-6">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{article.author}</span>
                <span>- Arun News</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.publishedAt}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span className="tabular-nums">{article.viewsCount.toLocaleString('id-ID')} views</span>
                </span>
              </div>
            </div>

            {/* Social Share Bar */}
            <div className="flex items-center justify-between py-2 px-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg mb-6 text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold">Bagikan Berita:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareWA}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded transition-colors"
                >
                  WhatsApp
                </button>
                <button
                  onClick={handleCopyLink}
                  className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-medium rounded transition-colors flex items-center gap-1"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink ? 'Tersalin' : 'Salin Link'}</span>
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="rounded-xl overflow-hidden mb-4 bg-slate-900">
              <img
                src={article.imageUrl}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-full aspect-video object-cover"
              />
            </div>
            <p className="text-xs text-slate-400 italic mb-8 border-l-2 border-blue-500 pl-3">
              {article.imageCaption}
            </p>

            {/* Editorial Pull Quote */}
            {article.pullQuote && (
              <div className="p-4 sm:p-5 my-6 rounded-xl bg-amber-50/80 dark:bg-slate-800/90 border-l-4 border-amber-400 font-serif italic text-sm sm:text-base text-slate-800 dark:text-slate-100 shadow-2xs leading-relaxed">
                &ldquo;{article.pullQuote}&rdquo;
              </div>
            )}

            {/* Article Narrative Body */}
            <div className={`text-slate-700 dark:text-slate-300 space-y-5 ${article.isOpinion ? 'font-serif' : ''} ${fontClass}`}>
              {article.content.map((paragraph, idx) => (
                <p 
                  key={idx}
                  className={idx === 0 ? "first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-[#004a99] dark:first-letter:text-blue-400" : ""}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* About Author & Editorial Disclaimer for Opinion */}
            {article.isOpinion && (
              <div className="mt-8 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  <span>Tentang Kolumnis</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>{article.author}</strong> - {article.authorBio || article.authorRole || 'Penulis dan praktisi independen.'}
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-400 italic">
                  *Disclaimer: Rubrik Kolom & Esai adalah ruang kebebasan berpendapat. Isi dan gagasan sepenuhnya merupakan tanggung jawab pribadi penulis serta tidak mencerminkan sikap resmi redaksi Arun News.
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Tag Terkait
              </h4>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-3 py-1 bg-slate-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Articles Carousel / Grid */}
            {relatedArticles.length > 0 && (
              <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Berita Terkait Lainnya
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedArticles.slice(0, 2).map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectRelatedArticle(rel)}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 cursor-pointer transition-colors group flex gap-3"
                    >
                      <img
                        src={rel.imageUrl}
                        alt={rel.title}
                        referrerPolicy="no-referrer"
                        className="w-20 h-16 object-cover rounded-lg shrink-0 bg-slate-900"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                          {rel.subCategory}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 line-clamp-2 leading-snug">
                          {rel.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Komentar Pembaca ({comments.length})
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Moderasi Otomatis</span>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-8 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Tulis Tanggapan Anda
                </h4>
                <div className="grid grid-cols-1 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Nama Anda (opsional, default: Pembaca Anonim)"
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none focus:border-blue-500"
                  />
                  <textarea
                    rows={3}
                    placeholder="Kirim opini atau tanggapan Anda secara santun..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Komentar</span>
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comm) => (
                  <div 
                    key={comm.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {comm.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                          {comm.author}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {comm.timestamp}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                        {comm.text}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <button
                          onClick={() => handleVoteComment(comm.id, 'up')}
                          className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span className="tabular-nums">{comm.upvotes}</span>
                        </button>
                        <button
                          onClick={() => handleVoteComment(comm.id, 'down')}
                          className="flex items-center gap-1 hover:text-red-600 transition-colors"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                          <span className="tabular-nums">{comm.downvotes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
