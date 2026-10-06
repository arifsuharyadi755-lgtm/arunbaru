/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  BreakingNewsTicker 
} from './components/BreakingNewsTicker';
import { 
  TrendingBar 
} from './components/TrendingBar';
import { 
  LeadStoryHero 
} from './components/LeadStoryHero';
import { 
  NewsFeedList 
} from './components/NewsFeedList';
import { 
  PopularRankingList 
} from './components/PopularRankingList';
import { 
  PushNotificationModal 
} from './components/PushNotificationModal';
import { 
  NotificationDrawer 
} from './components/NotificationDrawer';
import { 
  InAppNotificationToast 
} from './components/InAppNotificationToast';
import { 
  ArticleDetailModal 
} from './components/ArticleDetailModal';
import { 
  BookmarksModal 
} from './components/BookmarksModal';
import { 
  CitizenReportModal 
} from './components/CitizenReportModal';
import { 
  WeatherWidget 
} from './components/WeatherWidget';
import { 
  NewsletterWidget 
} from './components/NewsletterWidget';
import { 
  AdvertiseModal 
} from './components/AdvertiseModal';
import { 
  AdBannerSlot 
} from './components/AdBannerSlot';
import { 
  OpinionColumnSection 
} from './components/OpinionColumnSection';
import { 
  OpinionSubmissionModal 
} from './components/OpinionSubmissionModal';
import { 
  CoffeeTipModal 
} from './components/CoffeeTipModal';
import { 
  EditorialAdminPage, 
  AdminMenuTab 
} from './components/EditorialAdminPage';
import { 
  Footer 
} from './components/Footer';

import { 
  CATEGORIES, 
  INITIAL_ARTICLES, 
  BREAKING_NEWS_ITEMS 
} from './data/newsData';
import { 
  OPINION_ARTICLES 
} from './data/opinionData';
import { 
  CategoryId, 
  NewsArticle, 
  PushNotificationItem 
} from './types/news';
import { 
  AdSubmission 
} from './types/advertising';
import { 
  pushNotificationService 
} from './services/pushNotificationService';
import { 
  Bell, 
  Zap, 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  Compass, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const STORAGE_KEYS = {
  BOOKMARKS: 'detik_bookmarked_ids_v1'
};

export default function App() {
  // Navigation & Category state
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Articles state (supports live citizen report submissions & opinions)
  const [opinionArticles, setOpinionArticles] = useState<NewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem('arun_user_opinions_v1');
      if (saved) {
        const userOpinions: NewsArticle[] = JSON.parse(saved);
        return [...userOpinions, ...OPINION_ARTICLES];
      }
    } catch {
      // ignore
    }
    return OPINION_ARTICLES;
  });

  const [articles, setArticles] = useState<NewsArticle[]>(() => {
    return [...INITIAL_ARTICLES, ...OPINION_ARTICLES];
  });

  // Article selection & Modals
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAdvertiseModalOpen, setIsAdvertiseModalOpen] = useState(false);
  const [isOpinionModalOpen, setIsOpinionModalOpen] = useState(false);
  const [isCoffeeModalOpen, setIsCoffeeModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'public' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#admin' || window.location.hash.startsWith('#/admin') || window.location.search.includes('view=admin')) {
        return 'admin';
      }
    }
    return 'public';
  });
  const [adminInitialTab, setAdminInitialTab] = useState<AdminMenuTab>('logo');

  // Active User Submitted Ad Banner (persisted)
  const [activeCustomAd, setActiveCustomAd] = useState<AdSubmission | null>(() => {
    try {
      const saved = localStorage.getItem('arun_ads_submissions_v1');
      if (saved) {
        const list: AdSubmission[] = JSON.parse(saved);
        return list.length > 0 ? list[0] : null;
      }
    } catch {
      // ignore
    }
    return null;
  });

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : ['art-1', 'art-3'];
    } catch {
      return ['art-1', 'art-3'];
    }
  });

  // Push Notifications state
  const [notifications, setNotifications] = useState<PushNotificationItem[]>(() => {
    return pushNotificationService.getHistory();
  });
  const [currentToastNotif, setCurrentToastNotif] = useState<PushNotificationItem | null>(null);

  // Permanently clear dark mode from HTML
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    try {
      localStorage.removeItem('detik_dark_mode_v1');
    } catch {
      // ignore
    }
  }, []);

  // Subscribe to push notification service
  useEffect(() => {
    const unsubscribe = pushNotificationService.onNotification((newNotif) => {
      setNotifications(prev => [newNotif, ...prev]);
      setCurrentToastNotif(newNotif);
    });

    // Listen to custom native notification click
    const handleNativeNotifClick = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const artId = customEvent.detail;
      const targetArt = articles.find(a => a.id === artId);
      if (targetArt) {
        setSelectedArticle(targetArt);
      }
    };

    window.addEventListener('detik:open_article', handleNativeNotifClick);

    return () => {
      unsubscribe();
      window.removeEventListener('detik:open_article', handleNativeNotifClick);
    };
  }, [articles]);

  // Periodic automatic breaking news simulation if setting allows
  useEffect(() => {
    const simulationPool = [
      {
        title: '⚡ BREAKING: Gempa Bumi Magnitudo 5.2 Guncang Pesisir Selatan Jawa',
        body: 'BMKG merilis informasi resmi bahwa gempa kedalaman 10 km tidak memicu gelombang tsunami.',
        category: 'daerah' as CategoryId,
        priority: 'high' as const,
        articleId: 'art-1'
      },
      {
        title: '📈 BREAKING: Rupiah Menguat Tajam ke Level Rp 15.580 per Dolar AS',
        body: 'Intervensi terukur dan aliran modal masuk obligasi negara memperkokoh stabilitas nilai tukar.',
        category: 'ekonomi' as CategoryId,
        priority: 'high' as const,
        articleId: 'art-2'
      },
      {
        title: '⚽ Skor Terkini: Timnas Garuda Gandakan Keunggulan Menjadi 2-0!',
        body: 'Gol spektakuler tendangan voli dari luar kotak penalti membuat stadion GBK bergemuruh.',
        category: 'olahraga' as CategoryId,
        priority: 'high' as const,
        articleId: 'art-3'
      },
      {
        title: '🚨 Operasi Siber: Polisi Bekukan Rekening Penampungan Sindikat Penipuan Online',
        body: 'Polda Metro Jaya amankan 12 tersangka dengan aset kejahatan senilai puluhan miliar rupiah.',
        category: 'kriminal' as CategoryId,
        priority: 'high' as const,
        articleId: 'art-4'
      }
    ];

    let poolIndex = 0;
    const interval = setInterval(() => {
      const settings = pushNotificationService.getSettings();
      if (!settings.autoSimulate) return;

      const item = simulationPool[poolIndex % simulationPool.length];
      poolIndex++;

      pushNotificationService.sendNotification({
        title: item.title,
        body: item.body,
        category: item.category,
        priority: item.priority,
        articleId: item.articleId
      });
    }, 75000); // Trigger every 75 seconds for live simulation

    return () => clearInterval(interval);
  }, []);

  // Manual Trigger Test Notification
  const handleTriggerTestNotif = useCallback(() => {
    const testCases = [
      {
        title: '⚡ BREAKING NEWS: Sidang Paripurna DPR Tetapkan Kebijakan Baru Anggaran Daerah',
        body: 'Pemerintah memastikan distribusi bantuan dan pembangunan infrastruktur tersalurkan merata.',
        category: 'politik' as CategoryId,
        priority: 'high' as const,
        articleId: 'art-1'
      },
      {
        title: '🔥 Kemenangan Dramatis Garuda Kunci Tiket Lolos ke Putaran Dunia',
        body: 'Ribuan suporter tumpah ruah merayakan pencapaian bersejarah sepakbola Indonesia malam ini.',
        category: 'olahraga' as CategoryId,
        priority: 'high' as const,
        articleId: 'art-3'
      },
      {
        title: '🚨 Patroli Presisi Gagalkan Sindikat Pemalsuan Sertifikat Tanah Elektronik',
        body: 'Aparat kepolisian amankan dokumen palsu dan barang bukti stempel instansi bodong.',
        category: 'kriminal' as CategoryId,
        priority: 'high' as const,
        articleId: 'art-4'
      },
      {
        title: '📣 Lapor Warga: Aduan Kerusakan Jembatan Antardesa Ditindaklanjuti Dinas PU',
        body: 'Tim survei teknis telah diberangkatkan untuk memasang jembatan darurat penyeberangan.',
        category: 'lapor_warga' as CategoryId,
        priority: 'high' as const,
        articleId: 'art-7'
      }
    ];

    const randomItem = testCases[Math.floor(Math.random() * testCases.length)];
    pushNotificationService.sendNotification({
      title: randomItem.title,
      body: randomItem.body,
      category: randomItem.category,
      priority: randomItem.priority,
      articleId: randomItem.articleId
    });
  }, []);

  // Handle citizen report submission
  const handleAddCitizenReport = useCallback((newReport: NewsArticle) => {
    setArticles(prev => [newReport, ...prev]);
    // Dispatch instant notification
    pushNotificationService.sendNotification({
      title: `📣 Laporan Warga Baru: ${newReport.title}`,
      body: newReport.summary,
      category: 'lapor_warga',
      priority: 'high',
      articleId: newReport.id
    });
  }, []);

  // Handle ad campaign creation
  const handleAdCreated = useCallback((newAd: AdSubmission) => {
    setActiveCustomAd(newAd);
    // Dispatch broadcast notification about new partner
    pushNotificationService.sendNotification({
      title: `📢 Kampanye Mitra Baru: ${newAd.brandName}`,
      body: newAd.headline,
      category: 'ekonomi',
      priority: 'normal'
    });
  }, []);

  // Handle op-ed submission from columnist or reader
  const handleOpinionSubmitted = useCallback((newOp: NewsArticle) => {
    setOpinionArticles(prev => [newOp, ...prev]);
    setArticles(prev => [newOp, ...prev]);
    setSelectedArticle(newOp);
    pushNotificationService.sendNotification({
      title: `✍️ Kolom Opini Baru: ${newOp.author}`,
      body: newOp.title,
      category: 'lain_lain',
      priority: 'high',
      articleId: newOp.id
    });
  }, []);

  // Handle Saweran Kopi success
  const handleTipSuccess = useCallback((donorName: string, amount: number, messageText: string) => {
    pushNotificationService.sendNotification({
      title: `☕ Saweran Kopi Baru dari ${donorName}`,
      body: messageText || `Dukungan donasi ${amount.toLocaleString('id-ID')} untuk operasional redaksi Arun News.`,
      category: 'lain_lain',
      priority: 'high'
    });
  }, []);

  // Listen to hash changes for web route switching
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin' || window.location.hash.startsWith('#/admin')) {
        setCurrentView('admin');
      } else if (!window.location.hash || window.location.hash === '#') {
        setCurrentView('public');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Open Editorial Admin Web View
  const handleOpenEditorialAdmin = useCallback((tab: AdminMenuTab = 'logo') => {
    setAdminInitialTab(tab);
    setCurrentView('admin');
    if (typeof window !== 'undefined') {
      window.location.hash = '#admin';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Back to Public News Web Portal
  const handleBackToPublic = useCallback(() => {
    setCurrentView('public');
    if (typeof window !== 'undefined') {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Filter Articles
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      // Category match
      if (activeCategory !== 'all' && article.category !== activeCategory) {
        return false;
      }

      // Subcategory match
      if (activeSubcategory && activeSubcategory !== 'Semua') {
        if (article.subCategory.toLowerCase() !== activeSubcategory.toLowerCase()) {
          return false;
        }
      }

      // Tag filter
      if (activeTag) {
        const cleanTag = activeTag.replace('#', '').toLowerCase();
        const hasTag = article.tags.some(t => t.toLowerCase().includes(cleanTag));
        if (!hasTag) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = article.title.toLowerCase().includes(q);
        const matchSummary = article.summary.toLowerCase().includes(q);
        const matchContent = article.content.some(c => c.toLowerCase().includes(q));
        const matchTag = article.tags.some(t => t.toLowerCase().includes(q));
        const matchSub = article.subCategory.toLowerCase().includes(q);
        if (!matchTitle && !matchSummary && !matchContent && !matchTag && !matchSub) {
          return false;
        }
      }

      return true;
    });
  }, [articles, activeCategory, activeSubcategory, activeTag, searchQuery]);

  // Lead Story & Sub-Leads
  const leadArticle = useMemo(() => {
    return filteredArticles.find(a => a.isBreaking || a.isEditorPick) || filteredArticles[0] || articles[0];
  }, [filteredArticles, articles]);

  const subLeadArticles = useMemo(() => {
    return filteredArticles.filter(a => a.id !== leadArticle?.id).slice(0, 2);
  }, [filteredArticles, leadArticle]);

  // Related articles for modal reader
  const relatedArticles = useMemo(() => {
    if (!selectedArticle) return [];
    return articles.filter(a => a.id !== selectedArticle.id && a.category === selectedArticle.category);
  }, [articles, selectedArticle]);

  // Saved Articles Data
  const savedArticles = useMemo(() => {
    return articles.filter(a => bookmarkedIds.includes(a.id));
  }, [articles, bookmarkedIds]);

  // Bookmark toggling
  const handleToggleBookmark = useCallback((article: NewsArticle) => {
    setBookmarkedIds(prev => {
      let updated: string[];
      if (prev.includes(article.id)) {
        updated = prev.filter(id => id !== article.id);
      } else {
        updated = [...prev, article.id];
      }
      try {
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const isBookmarked = useCallback((id: string) => {
    return bookmarkedIds.includes(id);
  }, [bookmarkedIds]);

  // Share handler
  const handleShare = useCallback((article: NewsArticle) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${article.title}\n${window.location.href}`);
      alert('Tautan berita berhasil disalin ke clipboard!');
    }
  }, []);

  // Notification management
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const handleMarkAllNotifRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    pushNotificationService.saveHistory(updated);
  };

  const handleClearNotifHistory = () => {
    setNotifications([]);
    pushNotificationService.saveHistory([]);
  };

  const handleSelectNotifItem = (item: PushNotificationItem) => {
    // mark this notification as read
    const updated = notifications.map(n => n.id === item.id ? { ...n, read: true } : n);
    setNotifications(updated);
    pushNotificationService.saveHistory(updated);

    if (item.articleId) {
      const art = INITIAL_ARTICLES.find(a => a.id === item.articleId);
      if (art) {
        setSelectedArticle(art);
        setIsNotifDrawerOpen(false);
      }
    }
  };

  const currentCategoryInfo = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];
  const isHomePage = activeCategory === 'all' && (activeSubcategory === 'Semua' || !activeSubcategory) && !activeTag && !searchQuery.trim();

  // Dedicated Web Portal: Editorial Backoffice
  if (currentView === 'admin') {
    return (
      <EditorialAdminPage
        onBackToPublic={handleBackToPublic}
        initialTab={adminInitialTab}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col font-sans">
      {/* 1. Header with Indonesian Styling & Quick Channels */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={(id) => {
          setActiveCategory(id);
          setActiveSubcategory('Semua');
          setActiveTag(null);
        }}
        activeSubcategory={activeSubcategory}
        onSelectSubcategory={(sub) => {
          if (sub === 'Kirim Laporan') {
            setIsReportModalOpen(true);
          } else {
            setActiveSubcategory(sub);
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        unreadNotifCount={unreadNotifCount}
        onOpenNotifications={() => setIsNotifDrawerOpen(true)}
        onOpenNotifSettings={() => setIsNotifModalOpen(true)}
        savedArticlesCount={bookmarkedIds.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onTriggerTestNotif={handleTriggerTestNotif}
        onOpenAdvertise={() => setIsAdvertiseModalOpen(true)}
      />

      {/* 2. Live Breaking News Ticker */}
      <BreakingNewsTicker
        onSelectHeadline={(headline) => {
          const match = articles.find(a => headline.toLowerCase().includes(a.categoryName.toLowerCase())) || articles[0];
          setSelectedArticle(match);
        }}
      />

      {/* 3. Trending Tags Marquee */}
      <TrendingBar
        activeTag={activeTag}
        onSelectTag={setActiveTag}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-12 flex-1 w-full">
        {/* Push Notification Callout Banner */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#003875] via-[#004a99] to-[#002752] text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-amber-400/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
              <Bell className="w-5 h-5 fill-slate-950 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  Jangan Ketinggalan Breaking News Arun News
                </h2>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded shadow-xs">
                  FITUR NOTIFIKASI
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                Aktifkan push notifikasi browser langsung ke perangkat Anda untuk kabar terpenting Politik, Ekonomi, dan Olahraga.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleTriggerTestNotif}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-amber-400/30 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Coba Notifikasi</span>
            </button>
            <button
              onClick={() => setIsNotifModalOpen(true)}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Atur Notifikasi</span>
            </button>
          </div>
        </div>

        {/* 4. Lead Story Hero & Sub-Leads (when viewing all or when search is not active) */}
        {!searchQuery && !activeTag && activeCategory === 'all' && (
          <LeadStoryHero
            leadArticle={leadArticle}
            subLeadArticles={subLeadArticles}
            onSelectArticle={setSelectedArticle}
            isBookmarked={isBookmarked}
            onToggleBookmark={handleToggleBookmark}
            onShare={handleShare}
          />
        )}

        {/* Leaderboard Billboard Sponsored Slot */}
        <AdBannerSlot 
          type="leaderboard" 
          customAd={activeCustomAd} 
          onOpenAdvertise={() => setIsAdvertiseModalOpen(true)} 
        />

        {/* 5. Two-Column News Layout: Left Feed + Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Feed Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <NewsFeedList
              articles={filteredArticles}
              onSelectArticle={setSelectedArticle}
              isBookmarked={isBookmarked}
              onToggleBookmark={handleToggleBookmark}
              onShare={handleShare}
              selectedCategoryName={currentCategoryInfo.name}
              selectedSubcategory={activeSubcategory}
              searchQuery={searchQuery}
            />

            {/* Kanal Spotlight: Kriminal & Lapor Warga */}
            {activeCategory === 'all' && !searchQuery && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Spotlight 1: Kriminal */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <span className="font-bold text-xs uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-600" />
                      Sorotan Kriminal
                    </span>
                    <button 
                      onClick={() => {
                        setActiveCategory('kriminal');
                        setActiveSubcategory('Semua');
                      }}
                      className="text-[11px] font-semibold text-blue-600 dark:text-amber-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>Lihat Semua</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  {articles.filter(a => a.category === 'kriminal').slice(0, 1).map(art => (
                    <div 
                      key={art.id} 
                      onClick={() => setSelectedArticle(art)}
                      className="cursor-pointer group"
                    >
                      <img 
                        src={art.imageUrl} 
                        alt={art.title} 
                        referrerPolicy="no-referrer"
                        className="w-full aspect-video rounded-lg object-cover mb-2 group-hover:scale-[1.02] transition-transform" 
                      />
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-amber-400 line-clamp-2 leading-snug">
                        {art.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{art.summary}</p>
                    </div>
                  ))}
                </div>

                {/* Spotlight 2: Lapor Warga */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Aspirasi Lapor Warga
                    </span>
                    <button 
                      onClick={() => setIsReportModalOpen(true)}
                      className="text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-0.5 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded"
                    >
                      <span>+ Buat Laporan</span>
                    </button>
                  </div>
                  {articles.filter(a => a.category === 'lapor_warga').slice(0, 1).map(art => (
                    <div 
                      key={art.id} 
                      onClick={() => setSelectedArticle(art)}
                      className="cursor-pointer group"
                    >
                      <img 
                        src={art.imageUrl} 
                        alt={art.title} 
                        referrerPolicy="no-referrer"
                        className="w-full aspect-video rounded-lg object-cover mb-2 group-hover:scale-[1.02] transition-transform" 
                      />
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-amber-400 line-clamp-2 leading-snug">
                        {art.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{art.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Kolom Opini & Esai (Detikcom-style Kolom Section - Khusus Halaman Home) */}
            {isHomePage && (
              <OpinionColumnSection
                opinionArticles={opinionArticles}
                onSelectArticle={setSelectedArticle}
                onOpenSubmitModal={() => setIsOpinionModalOpen(true)}
              />
            )}
          </div>

          {/* Right Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. Terpopuler 1-10 Ranking */}
            <PopularRankingList
              onSelectArticleTitle={(title) => {
                const found = articles.find(a => a.title.toLowerCase().includes(title.substring(0, 25).toLowerCase())) || articles[0];
                setSelectedArticle(found);
              }}
            />

            {/* 2. Prakiraan Cuaca Terkini Widget */}
            <WeatherWidget initialCityId="jakarta" />

            {/* Sponsored Sidebar Ad Banner Slot */}
            <AdBannerSlot 
              type="sidebar" 
              customAd={activeCustomAd} 
              onOpenAdvertise={() => setIsAdvertiseModalOpen(true)} 
            />

            {/* 3. Live Info Box: Jadwal Sholat Jakarta & Valuta */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    Jadwal Sholat Jakarta
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">WIB</span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div className="text-[10px] text-slate-400 font-medium">Subuh</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">04:28</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div className="text-[10px] text-slate-400 font-medium">Dzuhur</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">11:51</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div className="text-[10px] text-slate-400 font-medium">Ashar</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">14:58</div>
                </div>
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900">
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Maghrib</div>
                  <div className="font-extrabold text-blue-800 dark:text-blue-200 mt-0.5">17:56</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div className="text-[10px] text-slate-400 font-medium">Isya</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">19:05</div>
                </div>
              </div>
            </div>

            {/* 4. Newsletter Subscription (Daily Digest) */}
            <NewsletterWidget />

            {/* 5. Push Notification Quick Card */}
            <div className="bg-gradient-to-br from-[#003875] via-[#004a99] to-slate-900 text-white rounded-xl p-5 shadow-xs border border-amber-400/30">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold text-white">Notifikasi Berita Cepat</h4>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed mb-4">
                Dapatkan notifikasi berita politik nasional, perkembangan bursa IHSG, dan skor langsung Timnas tanpa perlu membuka aplikasi terus menerus.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsNotifModalOpen(true)}
                  className="w-full py-2 bg-amber-400 hover:bg-yellow-300 text-slate-950 text-xs font-bold rounded-lg transition-colors text-center shadow-xs"
                >
                  Kelola Notifikasi
                </button>
                <button
                  onClick={handleTriggerTestNotif}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors shrink-0 border border-amber-400/30"
                  title="Tes Notifikasi"
                >
                  Tes Notif
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 6. Footer */}
      <Footer 
        onSelectCategory={(catId) => {
          setActiveCategory(catId);
          setActiveSubcategory('Semua');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
        onOpenAdvertise={() => setIsAdvertiseModalOpen(true)}
        onOpenCoffeeModal={() => setIsCoffeeModalOpen(true)}
      />

      {/* Floating Quick Saweran Kopi Button */}
      <button
        onClick={() => setIsCoffeeModalOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-full shadow-xl border border-amber-300 transition-all hover:scale-105 group"
        title="Saweran Kopi untuk Redaksi"
      >
        <span className="text-base group-hover:rotate-12 transition-transform">☕</span>
        <span className="hidden sm:inline font-extrabold tracking-tight">Saweran Kopi</span>
      </button>

      {/* 7. Modals & Overlays */}
      <ArticleDetailModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onSelectRelatedArticle={(art) => setSelectedArticle(art)}
        relatedArticles={relatedArticles}
        isBookmarked={isBookmarked}
        onToggleBookmark={handleToggleBookmark}
      />

      <PushNotificationModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        onTriggerTestNotif={handleTriggerTestNotif}
      />

      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        notifications={notifications}
        onSelectNotification={handleSelectNotifItem}
        onMarkAllAsRead={handleMarkAllNotifRead}
        onClearAll={handleClearNotifHistory}
        onOpenSettings={() => {
          setIsNotifDrawerOpen(false);
          setIsNotifModalOpen(true);
        }}
      />

      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        savedArticles={savedArticles}
        onSelectArticle={(art) => setSelectedArticle(art)}
        onRemoveBookmark={handleToggleBookmark}
        onClearAll={() => {
          setBookmarkedIds([]);
          try {
            localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify([]));
          } catch {
            // ignore
          }
        }}
      />

      {/* In-App Push Notification Floating Toast Alert */}
      <InAppNotificationToast
        notification={currentToastNotif}
        onClose={() => setCurrentToastNotif(null)}
        onClickToast={(item) => {
          if (item.articleId) {
            const art = INITIAL_ARTICLES.find(a => a.id === item.articleId);
            if (art) setSelectedArticle(art);
          }
          setCurrentToastNotif(null);
        }}
      />

      {/* 8. Layanan Pasang Iklan Modal */}
      <AdvertiseModal
        isOpen={isAdvertiseModalOpen}
        onClose={() => setIsAdvertiseModalOpen(false)}
        onAdCreated={handleAdCreated}
      />

      {/* 9. Kirim Opini & Esai Modal */}
      <OpinionSubmissionModal
        isOpen={isOpinionModalOpen}
        onClose={() => setIsOpinionModalOpen(false)}
        onOpinionSubmitted={handleOpinionSubmitted}
      />

      {/* 10. Saweran Kopi Modal */}
      <CoffeeTipModal
        isOpen={isCoffeeModalOpen}
        onClose={() => setIsCoffeeModalOpen(false)}
        onTipSuccess={handleTipSuccess}
      />
    </div>
  );
}
